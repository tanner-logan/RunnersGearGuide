import wixData from "wix-data";

/**
 * Main function to get the top three bottom IDs based on user answers.
 * @param {Object} userAnswers - The user answers object from the frontend.
 * @returns {Promise<Array>} - A promise that resolves to an array of the top three bottom IDs.
 */
export async function getTopThreeBottoms(userAnswers) {
	try {
		// Load bottoms data from the Wix 'bottoms' collection
		const bottomsData = await loadBottomsData();

		// Filter bottoms based on user answers
		const filteredBottoms = filterBottomsByUserAnswers(bottomsData, userAnswers);

		// Score the filtered bottoms
		const scoredBottoms = filteredBottoms
			.map((bottom) => ({
				...bottom,
				score: scoreBottom(bottom, userAnswers, filteredBottoms),
			}))
			.sort((a, b) => {
				if (b.score !== a.score) {
					return b.score - a.score;
				}
				return parseFloat(b.preferencescore) - parseFloat(a.preferencescore);
			})
			.slice(0, 3); // Get the top three bottoms

		// Return the top three bottom IDs
		return scoredBottoms.map((bottom) => bottom.bottomid);
	} catch (error) {
		console.error("Error in getTopThreeBottoms:", error);
		return [];
	}
}

/**
 * Loads bottoms data from the Wix 'bottoms' collection.
 * @returns {Promise<Array>} - A promise that resolves to an array of bottom objects.
 */
async function loadBottomsData() {
	try {
		const result = await wixData.query("bottoms").find();
		return result.items.map((item) => {
			// Clean up the data by trimming whitespace from all string values
			Object.keys(item).forEach((key) => {
				if (typeof item[key] === "string") {
					item[key] = item[key].trim();
				}
			});
			return item;
		});
	} catch (error) {
		console.error("Error loading bottoms data:", error);
		throw error;
	}
}

/**
 * Filters bottoms based on user answers.
 * @param {Array} bottomsData - The array of bottom objects.
 * @param {Object} userAnswers - The user answers object.
 * @returns {Array} - The filtered array of bottom objects.
 */
function filterBottomsByUserAnswers(bottomsData, userAnswers) {
	const excludedBrands = ["adidas", "asics", "brooks", "nike", "under_armour", "new_balance", "reebok", "hoka", "saucony"];

	// Filter the bottoms based on userAnswers
	const matchingBottoms = bottomsData.filter((bottom) => {
		return Object.keys(userAnswers).every((key) => {
			const userValue = userAnswers[key];

			// Ignore price filtering
			if (key === "price") {
				return true;
			}

			// Ignore inseam filtering if typebottoms includes pants, tights_leggings, or capris
			if (key === "inseam" && ["pants", "tights_leggings", "capris"].some((type) => userAnswers.typebottoms.includes(type))) {
				return true;
			}

			if (userValue === "no_preference" || (Array.isArray(userValue) && userValue.includes("no_preference"))) {
				return true;
			}

			if (key === "gender" && typeof userValue === "string") {
				if (bottom[key]) {
					return bottom[key].toLowerCase().includes(userValue.toLowerCase());
				}
				return false;
			}

			if (key === "brand") {
				if (Array.isArray(userValue)) {
					if (userValue.length === 1 && userValue[0].toLowerCase() === "other") {
						return !excludedBrands.includes(bottom[key]?.toLowerCase());
					} else if (userValue.includes("other")) {
						const specifiedBrands = userValue.filter((brand) => brand.toLowerCase() !== "other").map((brand) => brand.toLowerCase());
						return !excludedBrands.includes(bottom[key]?.toLowerCase()) || specifiedBrands.includes(bottom[key]?.toLowerCase());
					} else {
						return userValue.includes(bottom[key]?.toLowerCase());
					}
				}
				return false;
			}

			if (key === "allergies" && Array.isArray(userValue)) {
				if (bottom[key]) {
					const bottomAllergies = bottom[key].split(",").map((allergy) => allergy.trim().toLowerCase());
					return !userValue.some((allergy) => bottomAllergies.includes(allergy.toLowerCase()));
				}
				return true; // If the item has no allergies listed, include it
			}

			if (Array.isArray(userValue)) {
				if (bottom[key]) {
					const bottomValues = bottom[key].split(",").map((value) => value.trim().toLowerCase());
					return userValue.some((answer) => bottomValues.includes(answer.toLowerCase()));
				}
				return false;
			}

			if (typeof userValue === "string") {
				return bottom[key] && bottom[key].toLowerCase() === userValue.toLowerCase();
			}

			return false;
		});
	});

	// Handle cases where fewer than 3 matches are found
	// if (matchingBottoms.length >= 3) {
	// 	console.log("3 or more matches found: ", matchingBottoms.length);
	// } else {
	// 	console.log("Less than 3 matches found");
	// }

	return matchingBottoms.length >= 3
		? matchingBottoms
		: bottomsData.filter((bottom) => {
				if (userAnswers.gender !== "no_preference") {
					return bottom.gender && bottom.gender.toLowerCase().includes(userAnswers.gender.toLowerCase());
				}
				return true; // If gender is "no_preference", include all items
		  });
}

/**
 * Scores a bottom based on user answers.
 * @param {Object} bottom - The bottom object.
 * @param {Object} userAnswers - The user answers object.
 * @param {Array} filteredBottoms - The array of filtered bottom objects.
 * @returns {number} - The score for the bottom.
 */
function scoreBottom(bottom, userAnswers, filteredBottoms) {
	let score = 0;

	// Calculate price ranges for minimum, medium, and max based on filteredBottoms
	const prices = filteredBottoms.map((item) => parseFloat(item.price)).sort((a, b) => a - b);
	const lowestPrice = prices[0];
	const highestPrice = prices[prices.length - 1];
	const priceRangeStep = (highestPrice - lowestPrice) / 3;

	const priceRanges = {
		minimum: [lowestPrice, lowestPrice + priceRangeStep],
		medium: [lowestPrice + priceRangeStep, lowestPrice + 2 * priceRangeStep],
		max: [lowestPrice + 2 * priceRangeStep, highestPrice],
	};

	// Score brand
	if (!userAnswers.brand.includes("no_preference")) {
		if (bottom.brand && userAnswers.brand.includes(bottom.brand)) {
			score++;
		}
	}

	// Score bottomcolor
	if (!userAnswers.bottomcolor.includes("no_preference")) {
		if (bottom.bottomcolor) {
			const bottomColors = bottom.bottomcolor.split(",").map((color) => color.trim());
			const matchingColors = userAnswers.bottomcolor.filter((color) => bottomColors.includes(color));
			score += matchingColors.length;
		}
	}

	// Score typebottoms
	if (!userAnswers.typebottoms.includes("no_preference")) {
		if (bottom.typebottoms) {
			const bottomTypes = bottom.typebottoms.split(",").map((type) => type.trim());
			const matchingTypes = userAnswers.typebottoms.filter((type) => bottomTypes.includes(type));
			score += matchingTypes.length;
		}
	}

	// Score bottom_preference
	if (!userAnswers.bottom_preference.includes("no_preference")) {
		if (bottom.bottomfeatures) {
			const bottomPreferences = bottom.bottomfeatures.split(",").map((preference) => preference.trim());
			const matchingPreferences = userAnswers.bottom_preference.filter((preference) => bottomPreferences.includes(preference));
			score += matchingPreferences.length;
		}
	}

	// Score weather
	if (!userAnswers.weather.includes("no_preference")) {
		if (bottom.weather) {
			const bottomWeather = bottom.weather.split(",").map((weather) => weather.trim());
			const matchingWeather = userAnswers.weather.filter((weather) => bottomWeather.includes(weather));
			score += matchingWeather.length;
		}
	}

	// Score gender
	if (userAnswers.gender !== "no_preference") {
		if (bottom.gender && bottom.gender.toLowerCase().includes(userAnswers.gender.toLowerCase())) {
			score++;
		}
	}

	// Score distance
	if (!userAnswers.distance.includes("no_preference")) {
		if (bottom.distance) {
			const bottomDistances = bottom.distance.split(",").map((distance) => distance.trim());
			const matchingDistances = userAnswers.distance.filter((distance) => bottomDistances.includes(distance));
			score += matchingDistances.length;
		}
	}

	// Score allergies (negative score for matching allergies)
	if (!userAnswers.allergies.includes("no_preference")) {
		if (bottom.allergies) {
			const bottomAllergies = bottom.allergies.split(",").map((allergy) => allergy.trim());
			const matchingAllergies = userAnswers.allergies.filter((allergy) => bottomAllergies.includes(allergy));
			score -= matchingAllergies.length;
		}
	}

	// Score ecofriendly
	if (userAnswers.ecofriendly === "yes") {
		if (bottom.ecofriendly === "yes") {
			score += 1.5;
		}
	}

	// Score inseam only if typebottoms includes "shorts"
	if (userAnswers.typebottoms.includes("shorts") && !userAnswers.inseam.includes("no_preference")) {
		if (bottom.inseam) {
			const inseamValues = bottom.inseam.split(",").map((inseam) => inseam.trim());
			const matchingInseams = userAnswers.inseam.filter((inseam) => inseamValues.includes(inseam));
			score += matchingInseams.length;
		}
	}

	// Score price
	if (!userAnswers.price.includes("no_preference")) {
		const itemPrice = parseFloat(bottom.price);
		if (userAnswers.price.includes("minimum") && itemPrice >= priceRanges.minimum[0] && itemPrice <= priceRanges.minimum[1]) {
			score++;
		}
		if (userAnswers.price.includes("medium") && itemPrice > priceRanges.medium[0] && itemPrice <= priceRanges.medium[1]) {
			score++;
		}
		if (userAnswers.price.includes("max") && itemPrice > priceRanges.max[0]) {
			score++;
		}
	}

	return score;
}
