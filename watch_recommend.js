import wixData from "wix-data";

/**
 * Main function to get the top three watch objects based on user answers.
 * @param {Object} userAnswers - The user answers object from the frontend.
 * @returns {Promise<Array>} - A promise that resolves to an array of the top three watch objects.
 */
export async function getTopThreeWatches(userAnswers) {
	try {
		// Load watches data from the Wix 'watches' collection
		const watchesData = await loadWatchesData();

		// Score and sort all watches
		const scoredWatches = watchesData
			.map((watch) => ({
				...watch,
				score: scoreWatch(watch, userAnswers),
			}))
			.sort((a, b) => {
				if (b.score !== a.score) {
					return b.score - a.score; // Higher score first
				}
				return parseFloat(b.preferencescore) - parseFloat(a.preferencescore); // Higher preferencescore first
			})
			.slice(0, 3); // Take the top 3 only

		return scoredWatches;
	} catch (error) {
		console.error("Error in getTopThreeWatches:", error);
		return [];
	}
}

/**
 * Loads watches data from the Wix 'watches' collection.
 * @returns {Promise<Array>} - A promise that resolves to an array of watch objects.
 */
async function loadWatchesData() {
	try {
		const result = await wixData.query("watches").find();
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
		console.error("Error loading watches data:", error);
		throw error;
	}
}

/**
 * Hardcoded price categories.
 */
function getPriceCategory(price) {
	const p = parseFloat(price);
	if (p <= 250) return "minimum";
	if (p > 250 && p <= 500) return "medium";
	if (p > 500) return "max";
	return null;
}

/**
 * Scores a watch based on user answers.
 * @param {Object} watch - The watch object.
 * @param {Object} userAnswers - The user answers object.
 * @returns {number} - The score for the watch.
 */
function scoreWatch(watch, userAnswers) {
	let score = 0;

	// Style
	if (watch.style && userAnswers.style) {
		const watchStyles = watch.style.split(",").map((s) => s.trim().toLowerCase());
		if (watchStyles.includes(userAnswers.style.toLowerCase())) score++;
	}

	// Distance
	if (watch.distance && userAnswers.distance) {
		const watchDistances = watch.distance.split(",").map((d) => d.trim().toLowerCase());
		if (watchDistances.includes(userAnswers.distance.toLowerCase())) score++;
	}

	// Price
	if (userAnswers.price) {
		const userPriceCat = userAnswers.price.toLowerCase();
		const watchPriceCat = getPriceCategory(watch.price);
		if (watchPriceCat === userPriceCat) score++;
	}

	// Smartwatch
	if (watch.smartwatch && userAnswers.smartwatch) {
		if (watch.smartwatch.toLowerCase() === userAnswers.smartwatch.toLowerCase()) score++;
	}

	// Battery
	if (watch.battery && userAnswers.battery) {
		const watchBatteries = watch.battery.split(",").map((b) => b.trim().toLowerCase());
		if (watchBatteries.includes(userAnswers.battery.toLowerCase())) score++;
	}

	return score;
}
