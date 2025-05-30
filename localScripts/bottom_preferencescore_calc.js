const determineBottomPreferenceScore = (rating, amountOfReviews, runnerRep, materialQuality, fitScore) => {
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
	const reviewCountWeight = Math.log10(amountOfReviews + 1) * 0.05;

	// Scale runner reputation
	const scaledRunnerRep = runnerRep * 0.6 * ratingWeight;

	// Calculate the preference score (no reflectivity bonus)
	const preferenceScore =
		rating * ratingWeight + // User rating
		scaledRunnerRep + // Runner rep scaled
		materialQuality * 0.25 + // Material quality
		fitScore * 0.2 + // Fit quality
		reviewCountWeight; // Review volume influence

	return parseFloat(preferenceScore.toFixed(4));
};

const rating = 4.5; // Based on Amazon customer reviews
const amountOfReviews = 10640; // Total number of reviews on Amazon
const runnerRep = 6.5; // Popular among fitness enthusiasts; moderately favored by runners
const materialQuality = 8.0; // Buttery-soft, stretchy fabric with decent compression and moisture-wicking properties
const fitScore = 8.0;

const bottomScore = determineBottomPreferenceScore(rating, amountOfReviews, runnerRep, materialQuality, fitScore);

console.log("Bottom Preference Score:", bottomScore);
