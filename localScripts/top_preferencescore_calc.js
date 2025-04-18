const determineShirtPreferenceScore = (rating, amountOfReviews, runnerRep, materialQuality, fitScore, hasReflectivity) => {
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
const rating = 4.4; // Based on Amazon average rating (assumed as no rating information provided)
const amountOfReviews = 500; // Based on Amazon review count (assumed as no review count provided)
const runnerRep = 7.5; // ASICS is a well-known and trusted brand in the running community
const materialQuality = 7.0; // Lightweight fabric designed for comfort during athletic use
const fitScore = 7.5; // Regular fit designed to be comfortable and allow movement
const hasReflectivity = false; // No reflective details noted

const score = determineShirtPreferenceScore(rating, amountOfReviews, runnerRep, materialQuality, fitScore, hasReflectivity);

console.log("Shirt Preference Score:", score);
