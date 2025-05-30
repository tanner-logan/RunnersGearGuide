/*
hat csv columns
hatid,product_name,brand,hatcolor,gender,weather,distance,price,allergies,ecofriendly,designpreference,hatfeatures,preferencescore,description,image,link
*/

const fs = require("fs");
const Papa = require("papaparse");

function loadHatsData(filePath) {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, "utf8", (err, data) => {
			if (err) {
				return reject(err);
			}

			Papa.parse(data, {
				header: true, // Treat the first row as headers
				skipEmptyLines: true, // Skip empty rows
				complete: (results) => {
					// Clean up the data by trimming whitespace from all string values
					const cleanedData = results.data.map((row) => {
						Object.keys(row).forEach((key) => {
							if (typeof row[key] === "string") {
								row[key] = row[key].trim();
							}
						});
						return row;
					});
					resolve(cleanedData);
				},
				error: (error) => {
					reject(error);
				},
			});
		});
	});
}

function filterHatsByUserAnswers(hatsData, userAnswers) {
	// Filter the hats based on userAnswers
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

	if (matchingHats.length >= 3) {
		console.log("3 or more matches found: ", matchingHats.length);
	} else {
		console.log("Less than 3 matches found");
	}

	return matchingHats.length >= 5
		? matchingHats
		: hatsData.filter((hat) => {
				if (userAnswers.gender !== "no_preference") {
					return hat.gender && hat.gender.toLowerCase().includes(userAnswers.gender.toLowerCase());
				}
				return true; // If gender is "no_preference", include all items
		  });
}

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

(async () => {
	try {
		const filePath = "./product_data/hats.csv";
		const hatsData = await loadHatsData(filePath);

		const userAnswers = {
			brand: ["no_preference"],
			hatcolor: ["black"],
			gender: "mens",
			weather: ["hot"],
			distance: ["minimal"],
			price: ["no_preference"],
			allergies: ["no_preference"],
			ecofriendly: "no_preference",
			designpreference: ["bold"],
			hatfeatures: ["no_preference"],
		};

		const result = filterHatsByUserAnswers(hatsData, userAnswers);
		const scoredHats = result
			.map((hat) => ({
				...hat,
				score: scoreHat(hat, userAnswers, hatsData),
			}))
			.sort((a, b) => {
				if (b.score !== a.score) {
					return b.score - a.score;
				}
				return parseFloat(b.preferencescore) - parseFloat(a.preferencescore);
			})
			.slice(0, 5);

		// Randomly select 3 hats from the top 5
		const randomThreeHats = getRandomItems(scoredHats, 3);

		randomThreeHats.forEach((hat) => {
			console.log("Scored Hats:", hat);
		});
	} catch (error) {
		console.error("Error:", error);
	}
})();

function getRandomItems(items, count) {
	const shuffled = [...items].sort(() => 0.5 - Math.random()); // Shuffle the array
	return shuffled.slice(0, count); // Return the first `count` items
}
