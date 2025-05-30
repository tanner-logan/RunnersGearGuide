import wixData from "wix-data";
import { getRandomItems } from "public/helpers/helperFunctions";

/**
 * Main function to get the top three top IDs based on user answers.
 * @param {Object} userAnswers - The user answers object from the frontend.
 * @returns {Promise<Array>} - A promise that resolves to an array of the top three top IDs.
 */
export async function getTopThreeTops(userAnswers, simpleFlow) {
	try {
		// Load tops data from the Wix 'tops' collection
		const topsData = await loadTopsData();

		// Filter tops based on user answers
		const filteredTops = filterTopsByUserAnswers(topsData, userAnswers);

		// Score the filtered tops
		const scoredTops = filteredTops
			.map((top) => ({
				...top,
				score: scoreTop(top, userAnswers, topsData),
			}))
			.sort((a, b) => {
				if (b.score !== a.score) {
					return b.score - a.score;
				}
				return parseFloat(b.preferencescore) - parseFloat(a.preferencescore);
			});

		// Determine how many tops to slice based on simpleFlow
		const topTops = simpleFlow ? scoredTops.slice(0, 15) : scoredTops.slice(0, 5);

		// Randomly select 3 tops from the sliced top tops
		const randomThreeTops = getRandomItems(topTops, 3);

		// Return the top three top IDs
		return randomThreeTops.map((top) => top.topid);
	} catch (error) {
		console.error("Error in getTopThreeTops:", error);
		return [];
	}
}

/**
 * Loads tops data from the Wix 'tops' collection.
 * @returns {Promise<Array>} - A promise that resolves to an array of top objects.
 */
async function loadTopsData() {
	try {
		const result = await wixData.query("tops").find();
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
		console.error("Error loading tops data:", error);
		throw error;
	}
}

/**
 * Filters tops based on user answers.
 * @param {Array} topsData - The array of top objects.
 * @param {Object} userAnswers - The user answers object.
 * @returns {Array} - The filtered array of top objects.
 */
function filterTopsByUserAnswers(topsData, userAnswers) {
	const excludedBrands = ["adidas", "asics", "brooks", "nike", "under_armour", "new_balance", "reebok", "hoka", "saucony"];

	// Filter the tops based on userAnswers
	const matchingTops = topsData.filter((top) => {
		return Object.keys(userAnswers).every((key) => {
			const userValue = userAnswers[key];

			// Ignore price filtering
			if (key === "price") {
				return true;
			}

			if (userValue === "no_preference" || (Array.isArray(userValue) && userValue.includes("no_preference"))) {
				return true;
			}

			if (key === "gender" && typeof userValue === "string") {
				if (top[key]) {
					return top[key].toLowerCase().includes(userValue.toLowerCase());
				}
				return false;
			}

			if (key === "brand") {
				if (Array.isArray(userValue)) {
					if (userValue.length === 1 && userValue[0].toLowerCase() === "other") {
						return !excludedBrands.includes(top[key]?.toLowerCase());
					} else if (userValue.includes("other")) {
						const specifiedBrands = userValue.filter((brand) => brand.toLowerCase() !== "other").map((brand) => brand.toLowerCase());
						return !excludedBrands.includes(top[key]?.toLowerCase()) || specifiedBrands.includes(top[key]?.toLowerCase());
					} else {
						return userValue.includes(top[key]?.toLowerCase());
					}
				}
				return false;
			}

			if (key === "allergies" && Array.isArray(userValue)) {
				if (top[key]) {
					const topAllergies = top[key].split(",").map((allergy) => allergy.trim().toLowerCase());
					return !userValue.some((allergy) => topAllergies.includes(allergy.toLowerCase()));
				}
				return true; // If the item has no allergies listed, include it
			}

			if (Array.isArray(userValue)) {
				if (top[key]) {
					const topValues = top[key].split(",").map((value) => value.trim().toLowerCase());
					return userValue.some((answer) => topValues.includes(answer.toLowerCase()));
				}
				return false;
			}

			if (typeof userValue === "string") {
				return top[key] && top[key].toLowerCase() === userValue.toLowerCase();
			}

			return false;
		});
	});

	// Handle cases where fewer than 3 matches are found
	// if (matchingTops.length >= 5) {
	// 	console.log("5 or more matches found: ", matchingTops.length);
	// } else {
	// 	console.log("Less than 5 matches found");
	// }

	return matchingTops.length >= 5
		? matchingTops
		: topsData.filter((top) => {
				if (userAnswers.gender !== "no_preference") {
					return top.gender && top.gender.toLowerCase().includes(userAnswers.gender.toLowerCase());
				}
				return true; // If gender is "no_preference", include all items
		  });
}

/**
 * Scores a top based on user answers.
 * @param {Object} top - The top object.
 * @param {Object} userAnswers - The user answers object.
 * @param {Array} allTops - The array of all top objects.
 * @returns {number} - The score for the top.
 */
function scoreTop(top, userAnswers, allTops) {
	let score = 0;

	// Calculate price ranges for minimum, medium, and max
	const prices = allTops.map((item) => parseFloat(item.price)).sort((a, b) => a - b);
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
		if (top.brand && userAnswers.brand.includes(top.brand)) {
			score++;
		}
	}

	// Score topcolor
	if (!userAnswers.topcolor.includes("no_preference")) {
		if (top.topcolor) {
			const topColors = top.topcolor.split(",").map((color) => color.trim());
			const matchingColors = userAnswers.topcolor.filter((color) => topColors.includes(color));
			score += matchingColors.length;
		}
	}

	// Score top_preference
	if (!userAnswers.top_preference.includes("no_preference")) {
		if (top.top_preference) {
			const topPreferences = top.top_preference.split(",").map((preference) => preference.trim());
			const matchingPreferences = userAnswers.top_preference.filter((preference) => topPreferences.includes(preference));
			score += matchingPreferences.length;
		}
	}

	// Score weather
	if (!userAnswers.weather.includes("no_preference")) {
		if (top.weather) {
			const topWeather = top.weather.split(",").map((weather) => weather.trim());
			const matchingWeather = userAnswers.weather.filter((weather) => topWeather.includes(weather));
			score += matchingWeather.length;
		}
	}

	// Score gender
	if (userAnswers.gender !== "no_preference") {
		if (top.gender && top.gender.toLowerCase().includes(userAnswers.gender.toLowerCase())) {
			score++;
		}
	}

	// Score distance
	if (!userAnswers.distance.includes("no_preference")) {
		if (top.distance) {
			const topDistances = top.distance.split(",").map((distance) => distance.trim());
			const matchingDistances = userAnswers.distance.filter((distance) => topDistances.includes(distance));
			score += matchingDistances.length;
		}
	}

	// Score allergies (negative score for matching allergies)
	if (!userAnswers.allergies.includes("no_preference")) {
		if (top.allergies) {
			const topAllergies = top.allergies.split(",").map((allergy) => allergy.trim());
			const matchingAllergies = userAnswers.allergies.filter((allergy) => topAllergies.includes(allergy));
			score -= matchingAllergies.length;
		}
	}

	// Score ecofriendly
	if (userAnswers.ecofriendly === "yes") {
		if (top.ecofriendly === "yes") {
			score += 1.5;
		}
	}

	// Score top_sleeves
	if (!userAnswers.top_sleeves.includes("no_preference")) {
		if (top.top_sleeves) {
			const topSleeves = top.top_sleeves.split(",").map((sleeve) => sleeve.trim());
			const matchingSleeves = userAnswers.top_sleeves.filter((sleeve) => topSleeves.includes(sleeve));
			score += matchingSleeves.length;
		}
	}

	// Score top_length
	if (!userAnswers.top_length.includes("no_preference")) {
		if (top.top_length) {
			const topLengths = top.top_length.split(",").map((length) => length.trim());
			const matchingLengths = userAnswers.top_length.filter((length) => topLengths.includes(length));
			score += matchingLengths.length;
		}
	}

	// Score price
	if (!userAnswers.price.includes("no_preference")) {
		const itemPrice = parseFloat(top.price);
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
