const determinePreferenceScore = (rating, amountOfReviews, runnerRep, materialQuality) => {
	let ratingWeight;

	// Adjust the weight of rating based on the number of reviews
	if (amountOfReviews >= 0 && amountOfReviews <= 10) {
		ratingWeight = 0.3;
	} else if (amountOfReviews >= 11 && amountOfReviews <= 50) {
		ratingWeight = 0.35;
	} else if (amountOfReviews >= 51 && amountOfReviews <= 200) {
		ratingWeight = 0.4;
	} else if (amountOfReviews >= 201 && amountOfReviews <= 500) {
		ratingWeight = 0.45;
	} else if (amountOfReviews > 500) {
		ratingWeight = 0.5;
	} else {
		throw new Error("Invalid amount of reviews");
	}

	// Calculate the logarithmic weight for the number of reviews
	const reviewCountWeight = Math.log10(amountOfReviews + 1) * 0.05; // Reduced multiplier to minimize impact

	// Scale runner reputation by user rating weight
	const scaledRunnerRep = runnerRep * 0.6 * ratingWeight;

	// Calculate the preference score
	const preferenceScore =
		rating * ratingWeight + // User rating with dynamic weight
		scaledRunnerRep + // Scaled runner reputation
		materialQuality * 0.2 + // Material quality weight
		reviewCountWeight; // Logarithmic review count weight

	// Round to the nearest 4 decimal points
	return parseFloat(preferenceScore.toFixed(4));
};

const rating = 4.0; // From Amazon
const amountOfReviews = 51; // From Amazon
const runnerRep = 7.5; // Salomon is well-regarded in the trail running community for its technical gear
const materialQuality = 8;

const score = determinePreferenceScore(rating, amountOfReviews, runnerRep, materialQuality);
console.log("Preference Score:", score);

// node hat_preferencescore_calc.js
