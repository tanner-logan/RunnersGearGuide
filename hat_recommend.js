import wixData from "wix-data";
import { getRandomItems } from "public/helpers/helperFunctions";

/**
 * Main function to get the top three hat IDs based on user answers.
 * @param {Object} userAnswers - The user answers object from the frontend.
 * @returns {Promise<Array>} - A promise that resolves to an array of the top three hat IDs.
 */
export async function getTopThreeHats(userAnswers, simpleFlow) {
	try {
		// Load hats data from the Wix 'hats' collection
		const hatsData = await loadHatsData();

		// Filter hats based on user answers
		const filteredHats = filterHatsByUserAnswers(hatsData, userAnswers);

		// Score the filtered hats
		const scoredHats = filteredHats
			.map((hat) => ({
				...hat,
				score: scoreHat(hat, userAnswers, hatsData),
			}))
			.sort((a, b) => {
				if (b.score !== a.score) {
					return b.score - a.score;
				}
				return parseFloat(b.preferencescore) - parseFloat(a.preferencescore);
			});

		// Determine how many hats to slice based on simpleFlow
		const topHats = simpleFlow ? scoredHats.slice(0, 15) : scoredHats.slice(0, 5);

		// Randomly select 3 hats from the sliced top hats
		const randomThreeHats = getRandomItems(topHats, 3);

		// Return the top three hat IDs
		return randomThreeHats.map((hat) => hat.hatid);
	} catch (error) {
		console.error("Error in getTopThreeHats:", error);
		return [];
	}
}

/**
 * Loads hats data from the Wix 'hats' collection.
 * @returns {Promise<Array>} - A promise that resolves to an array of hat objects.
 */
async function loadHatsData() {
	try {
		const result = await wixData.query("hats").find();
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
		console.error("Error loading hats data:", error);
		throw error;
	}
}

/**
 * Filters hats based on user answers.
 * @param {Array} hatsData - The array of hat objects.
 * @param {Object} userAnswers - The user answers object.
 * @returns {Array} - The filtered array of hat objects.
 */
function filterHatsByUserAnswers(hatsData, userAnswers) {
	const matchingHats = hatsData.filter((hat) => {
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
				if (hat[key]) {
					return hat[key].toLowerCase().includes(userValue.toLowerCase());
				}
				return false;
			}

			if (key === "brand") {
				if (Array.isArray(userValue)) {
					return userValue.includes(hat[key]?.toLowerCase());
				}
				return false;
			}

			if (key === "allergies" && Array.isArray(userValue)) {
				if (hat[key]) {
					const hatAllergies = hat[key].split(",").map((allergy) => allergy.trim().toLowerCase());
					return !userValue.some((allergy) => hatAllergies.includes(allergy.toLowerCase()));
				}
				return true; // If the item has no allergies listed, include it
			}

			if (Array.isArray(userValue)) {
				if (hat[key]) {
					const hatValues = hat[key].split(",").map((value) => value.trim().toLowerCase());
					return userValue.some((answer) => hatValues.includes(answer.toLowerCase()));
				}
				return false;
			}

			if (typeof userValue === "string") {
				return hat[key] && hat[key].toLowerCase() === userValue.toLowerCase();
			}

			return false;
		});
	});

	// Handle cases where fewer than 3 matches are found
	// if (matchingHats.length >= 5) {
	// 	console.log("5 or more hat matches found: ", matchingHats.length);
	// } else {
	// 	console.log("Less than 5 hat matches found");
	// }

	return matchingHats.length >= 5
		? matchingHats
		: hatsData.filter((hat) => {
				if (userAnswers.gender !== "no_preference") {
					return hat.gender && hat.gender.toLowerCase().includes(userAnswers.gender.toLowerCase());
				}
				return true; // If gender is "no_preference", include all items
		  });
}

/**
 * Scores a hat based on user answers.
 * @param {Object} hat - The hat object.
 * @param {Object} userAnswers - The user answers object.
 * @param {Array} allHats - The array of all hat objects.
 * @returns {number} - The score for the hat.
 */
function scoreHat(hat, userAnswers, allHats) {
	let score = 0;

	// Calculate price ranges for minimum, medium, and max
	const prices = allHats.map((item) => parseFloat(item.price)).sort((a, b) => a - b);
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
		if (hat.brand && userAnswers.brand.includes(hat.brand)) {
			score++;
		}
	}

	// Score hatcolor
	if (!userAnswers.hatcolor.includes("no_preference")) {
		if (hat.hatcolor) {
			const hatColors = hat.hatcolor.split(",").map((color) => color.trim());
			const matchingColors = userAnswers.hatcolor.filter((color) => hatColors.includes(color));
			score += matchingColors.length;
		}
	}

	// Score weather
	if (!userAnswers.weather.includes("no_preference")) {
		if (hat.weather) {
			const hatWeather = hat.weather.split(",").map((weather) => weather.trim());
			const matchingWeather = userAnswers.weather.filter((weather) => hatWeather.includes(weather));
			score += matchingWeather.length;
		}
	}

	// Score gender
	if (userAnswers.gender !== "no_preference") {
		if (hat.gender && hat.gender.toLowerCase().includes(userAnswers.gender.toLowerCase())) {
			score++;
		}
	}

	// Score distance
	if (!userAnswers.distance.includes("no_preference")) {
		if (hat.distance) {
			const hatDistances = hat.distance.split(",").map((distance) => distance.trim());
			const matchingDistances = userAnswers.distance.filter((distance) => hatDistances.includes(distance));
			score += matchingDistances.length;
		}
	}

	// Score allergies (negative score for matching allergies)
	if (!userAnswers.allergies.includes("no_preference")) {
		if (hat.allergies) {
			const hatAllergies = hat.allergies.split(",").map((allergy) => allergy.trim());
			const matchingAllergies = userAnswers.allergies.filter((allergy) => hatAllergies.includes(allergy));
			score -= matchingAllergies.length;
		}
	}

	// Score ecofriendly
	if (userAnswers.ecofriendly === "yes") {
		if (hat.ecofriendly === "yes") {
			score += 1.5;
		}
	}

	// Score designpreference
	if (!userAnswers.designpreference.includes("no_preference")) {
		if (hat.designpreference) {
			const hatDesignPreferences = hat.designpreference.split(",").map((design) => design.trim());
			const matchingDesigns = userAnswers.designpreference.filter((design) => hatDesignPreferences.includes(design));
			score += matchingDesigns.length;
		}
	}

	// Score hatfeatures
	if (!userAnswers.hatfeatures.includes("no_preference")) {
		if (hat.hatfeatures) {
			const hatFeatures = hat.hatfeatures.split(",").map((feature) => feature.trim());
			const matchingFeatures = userAnswers.hatfeatures.filter((feature) => hatFeatures.includes(feature));
			score += matchingFeatures.length;
		}
	}

	// Score price
	if (!userAnswers.price.includes("no_preference")) {
		const itemPrice = parseFloat(hat.price);
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
