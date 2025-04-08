const determineShirtPreferenceScore = (
	rating,
	amountOfReviews,
	runnerRep,
	materialQuality,
	fitScore, // 0–10
	hasReflectivity // boolean (true = 1 point bonus)
) => {
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

	// Reflectivity bonus
	const reflectivityBonus = hasReflectivity ? 0.05 : 0;

	// Calculate the preference score
	const preferenceScore =
		rating * ratingWeight + // User rating
		scaledRunnerRep + // Runner rep scaled
		materialQuality * 0.25 + // Material quality
		fitScore * 0.2 + // Running-specific fit
		reviewCountWeight + // Review volume influence
		reflectivityBonus; // Safety bonus

	return parseFloat(preferenceScore.toFixed(4));
};

/* 
const rating = 4.6; 
const amountOfReviews = 26; 
const runnerRep = 8.5; 
const materialQuality = 8.8; 
const fitScore = 8.5;
const hasReflectivity = false;  
*/

// Example usage
const rating = 4.6; // Based on Amazon average rating
const amountOfReviews = 32; // Based on Amazon review count (no commas per your request)
const runnerRep = 8.0; // PUMA is generally well-accepted in the running community for quality running apparel
const materialQuality = 8.5; // Made with 100% polyester for lightweight comfort and moisture-wicking
const fitScore = 8.0; // Regular fit designed for a comfortable range of motion
const hasReflectivity = true; // No reflective features noted

const score = determineShirtPreferenceScore(rating, amountOfReviews, runnerRep, materialQuality, fitScore, hasReflectivity);

console.log("Shirt Preference Score:", score);
