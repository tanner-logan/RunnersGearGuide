import wixData from "wix-data";

/**
 * Main function to get the top three shoe IDs based on user answers.
 * @param {Object} userAnswers - The user answers object from the frontend.
 * @returns {Promise<Array>} - A promise that resolves to an array of the top three shoe IDs.
 */
export async function getTopThreeShoes(userAnswers) {
	try {
		// Load shoes data from the Wix 'shoes' collection
		const shoesData = await loadShoesData();

		// Filter shoes based on user answers
		const filteredShoes = filterShoesByUserAnswers(shoesData, userAnswers);

		// Score the filtered shoes
		const scoredShoes = filteredShoes
			.map((shoe) => ({
				...shoe,
				score: scoreShoes(shoe, userAnswers, filteredShoes),
			}))
			.sort((a, b) => {
				if (b.score !== a.score) {
					return b.score - a.score;
				}
				return parseFloat(b.preferencescore) - parseFloat(a.preferencescore);
			})
			.slice(0, 3); // Get the top three shoes

		// Return the top three shoe IDs
		return scoredShoes.map((shoe) => shoe.shoeid);
	} catch (error) {
		console.error("Error in getTopThreeShoes:", error);
		return [];
	}
}

/**
 * Loads shoes data from the Wix 'shoes' collection.
 * @returns {Promise<Array>} - A promise that resolves to an array of shoe objects.
 */
async function loadShoesData() {
	try {
		const result = await wixData.query("shoes").find();
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
		console.error("Error loading shoes data:", error);
		throw error;
	}
}

/**
 * Filters shoes based on user answers.
 * @param {Array} shoesData - The array of shoe objects.
 * @param {Object} userAnswers - The user answers object.
 * @returns {Array} - The filtered array of shoe objects.
 */
function filterShoesByUserAnswers(shoesData, userAnswers) {
	const excludedBrands = ["adidas", "asics", "brooks", "nike", "under_armour", "new_balance", "reebok", "hoka", "saucony"];

	// Filter the shoes based on userAnswers
	const matchingShoes = shoesData.filter((shoe) => {
		return Object.keys(userAnswers).every((key) => {
			const userValue = userAnswers[key];

			// Ignore price, stackheight, shoeweight, and heeltoedrop filtering here
			if (["price", "stackheight", "shoeweight", "heeltoedrop"].includes(key)) {
				return true;
			}

			if (userValue === "no_preference" || (Array.isArray(userValue) && userValue.includes("no_preference"))) {
				return true;
			}

			if (key === "gender" && typeof userValue === "string") {
				if (shoe[key]) {
					return shoe[key].toLowerCase().includes(userValue.toLowerCase());
				}
				return false;
			}

			// Brand filtering logic
			if (key === "brand") {
				if (Array.isArray(userValue)) {
					if (userValue.length === 1 && userValue[0].toLowerCase() === "other") {
						return !excludedBrands.includes(shoe[key]?.toLowerCase());
					} else if (userValue.includes("other")) {
						const specifiedBrands = userValue.filter((brand) => brand.toLowerCase() !== "other").map((brand) => brand.toLowerCase());
						return !excludedBrands.includes(shoe[key]?.toLowerCase()) || specifiedBrands.includes(shoe[key]?.toLowerCase());
					} else {
						return userValue.includes(shoe[key]?.toLowerCase());
					}
				}
				return false;
			}

			if (Array.isArray(userValue)) {
				if (shoe[key]) {
					const shoeValues = shoe[key].split(",").map((value) => value.trim().toLowerCase());
					return userValue.some((answer) => shoeValues.includes(answer.toLowerCase()));
				}
				return false;
			}

			if (typeof userValue === "string") {
				return shoe[key] && shoe[key].toLowerCase() === userValue.toLowerCase();
			}

			return false;
		});
	});

	// Handle cases where fewer than 3 matches are found
	// if (matchingShoes.length >= 3) {
	// 	console.log("3 or more matches found: ", matchingShoes.length);
	// } else {
	// 	console.log("Less than 3 matches found");
	// }

	return matchingShoes.length >= 3
		? matchingShoes
		: shoesData.filter((shoe) => {
				if (userAnswers.gender !== "no_preference") {
					return shoe.gender && shoe.gender.toLowerCase().includes(userAnswers.gender.toLowerCase());
				}
				return true; // If gender is "no_preference", include all items
		  });
}

/**
 * Scores a shoe based on user answers.
 * @param {Object} shoe - The shoe object.
 * @param {Object} userAnswers - The user answers object.
 * @param {Array} filteredShoes - The array of filtered shoe objects.
 * @returns {number} - The score for the shoe.
 */
function scoreShoes(shoe, userAnswers, filteredShoes) {
	let score = 0;

	// Calculate ranges for price, stackheight, shoeweight, and heeltoedrop
	const calculateRanges = (column) => {
		const values = filteredShoes
			.map((item) => parseFloat(item[column]))
			.filter((value) => !isNaN(value)) // Filter out invalid or non-numeric values
			.sort((a, b) => a - b);

		if (values.length === 0) {
			// Handle the case where no valid values are found
			return {
				minimum: [0, 0],
				medium: [0, 0],
				max: [0, 0],
			};
		}

		const lowest = values[0];
		const highest = values[values.length - 1];
		const rangeStep = (highest - lowest) / 3;

		return {
			minimum: [lowest, lowest + rangeStep],
			medium: [lowest + rangeStep, lowest + 2 * rangeStep],
			max: [lowest + 2 * rangeStep, highest],
		};
	};

	const priceRanges = calculateRanges("price");
	const stackHeightRanges = calculateRanges("stackheight");
	const shoeWeightRanges = calculateRanges("shoeweight");
	const heelToeDropRanges = calculateRanges("heeltoedrop");

	// Score price
	if (!userAnswers.price.includes("no_preference")) {
		const itemPrice = parseFloat(shoe.price);
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

	// Score brand
	if (!userAnswers.brand.includes("no_preference")) {
		if (shoe.brand && userAnswers.brand.includes(shoe.brand)) {
			score++;
		}
	}

	// Score shoecolor
	if (!userAnswers.shoecolor.includes("no_preference")) {
		if (shoe.shoecolor) {
			const shoeColors = shoe.shoecolor.split(",").map((color) => color.trim());
			const matchingColors = userAnswers.shoecolor.filter((color) => shoeColors.includes(color));
			score += matchingColors.length;
		}
	}

	// Score distance
	if (!userAnswers.distance.includes("no_preference")) {
		if (shoe.distance) {
			const shoeDistances = shoe.distance.split(",").map((distance) => distance.trim());
			const matchingDistances = userAnswers.distance.filter((distance) => shoeDistances.includes(distance));
			score += matchingDistances.length;
		}
	}

	// Score ecofriendly
	if (userAnswers.ecofriendly === "yes") {
		if (shoe.ecofriendly === "yes") {
			score += 1.5;
		}
	}

	// Score stackheight
	if (!userAnswers.stackheight.includes("no_preference")) {
		const itemStackHeight = parseFloat(shoe.stackheight);
		if (userAnswers.stackheight.includes("minimum") && itemStackHeight >= stackHeightRanges.minimum[0] && itemStackHeight <= stackHeightRanges.minimum[1]) {
			score++;
		}
		if (userAnswers.stackheight.includes("medium") && itemStackHeight > stackHeightRanges.medium[0] && itemStackHeight <= stackHeightRanges.medium[1]) {
			score++;
		}
		if (userAnswers.stackheight.includes("max") && itemStackHeight > stackHeightRanges.max[0]) {
			score++;
		}
	}

	// Score shoeweight
	if (!userAnswers.shoeweight.includes("no_preference")) {
		const itemShoeWeight = parseFloat(shoe.shoeweight);
		if (userAnswers.shoeweight.includes("minimum") && itemShoeWeight >= shoeWeightRanges.minimum[0] && itemShoeWeight <= shoeWeightRanges.minimum[1]) {
			score++;
		}
		if (userAnswers.shoeweight.includes("medium") && itemShoeWeight > shoeWeightRanges.medium[0] && itemShoeWeight <= shoeWeightRanges.medium[1]) {
			score++;
		}
		if (userAnswers.shoeweight.includes("max") && itemShoeWeight > shoeWeightRanges.max[0]) {
			score++;
		}
	}

	// Score heeltoedrop
	if (!userAnswers.heeltoedrop.includes("no_preference")) {
		const itemHeelToeDrop = parseFloat(shoe.heeltoedrop);
		if (userAnswers.heeltoedrop.includes("minimum") && itemHeelToeDrop >= heelToeDropRanges.minimum[0] && itemHeelToeDrop <= heelToeDropRanges.minimum[1]) {
			score++;
		}
		if (userAnswers.heeltoedrop.includes("medium") && itemHeelToeDrop > heelToeDropRanges.medium[0] && itemHeelToeDrop <= heelToeDropRanges.medium[1]) {
			score++;
		}
		if (userAnswers.heeltoedrop.includes("max") && itemHeelToeDrop > heelToeDropRanges.max[0]) {
			score++;
		}
	}

	// Score shoe_preference
	if (!userAnswers.shoe_preference.includes("no_preference")) {
		if (shoe.shoe_preference) {
			const shoePreferences = shoe.shoe_preference.split(",").map((preference) => preference.trim());
			const matchingPreferences = userAnswers.shoe_preference.filter((preference) => shoePreferences.includes(preference));
			score += matchingPreferences.length;
		}
	}

	// Score terrain
	if (!userAnswers.terrain.includes("no_preference")) {
		if (shoe.terrain) {
			const shoeTerrains = shoe.terrain.split(",").map((terrain) => terrain.trim());
			const matchingTerrains = userAnswers.terrain.filter((terrain) => shoeTerrains.includes(terrain));
			score += matchingTerrains.length;
		}
	}

	// Score stability
	if (userAnswers.stability !== "no_preference") {
		if (shoe.stability && shoe.stability.toLowerCase() === userAnswers.stability.toLowerCase()) {
			score++;
		}
	}

	return score;
}
