function calculateShoePreferenceScore(rating, amountOfReviews, runnerRep, fitScore, durabilityScore, runningBrandScore) {
	// Weights for each factor
	const weights = {
		rating: 0.2, // 20% weight
		amountOfReviews: 0.1, // 10% weight
		runnerRep: 0.25, // 25% weight
		fitScore: 0.2, // 20% weight
		durabilityScore: 0.1, // 10% weight
		runningBrandScore: 0.15, // 15% weight
	};

	// Normalize amountOfReviews to a scale of 0-10
	const normalizedReviews = Math.min(amountOfReviews / 100, 10); // Cap at 10

	// Calculate the weighted score
	const preferenceScore = rating * weights.rating + normalizedReviews * weights.amountOfReviews + runnerRep * weights.runnerRep + fitScore * weights.fitScore + durabilityScore * weights.durabilityScore + runningBrandScore * weights.runningBrandScore;

	// Return the final score rounded to 4 decimal places
	return parseFloat(preferenceScore.toFixed(4));
}

// Example usage
const rating = 4.5; // From Amazon
const amountOfReviews = 262; // From Amazon
const runnerRep = 8.7; // Popular among runners seeking lightweight stability
const fitScore = 8.5; // True to size with a snug heel and midfoot
const durabilityScore = 8.5; // Durable outsole and midsole materials
const runningBrandScore = 9.0;

const preferenceScore = calculateShoePreferenceScore(rating, amountOfReviews, runnerRep, fitScore, durabilityScore, runningBrandScore);

console.log("Shoe Preference Score:", preferenceScore);
