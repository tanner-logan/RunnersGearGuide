/*
tops.csv columns
topid,product_name,brand,topcolor,gender,weather,distance,price,allergies,ecofriendly,top_sleeves,top_length,top_preference,preferencescore,description,image,link
*/

const fs = require("fs");
const Papa = require("papaparse");

function loadTopsData(filePath) {
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

	if (matchingTops.length >= 3) {
		console.log("3 or more matches found: ", matchingTops.length);
	} else {
		console.log("Less than 3 matches found");
	}

	return matchingTops.length >= 3
		? matchingTops
		: topsData.filter((top) => {
				if (userAnswers.gender !== "no_preference") {
					return top.gender && top.gender.toLowerCase().includes(userAnswers.gender.toLowerCase());
				}
				return true; // If gender is "no_preference", include all items
		  });
}

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

	//console.log("Top ID: " + top.topid + " Score: " + score);
	return score;
}

(async () => {
	try {
		const filePath = "./product_data/tops.csv";
		const topsData = await loadTopsData(filePath);

		const userAnswers = {
			brand: ["no_preference"],
			topcolor: ["no_preference"],
			gender: "female",
			weather: ["no_preference"],
			distance: ["no_preference"],
			price: ["medium"], // range 17-35, 35-53, 53-70
			allergies: ["no_preference"],
			ecofriendly: "no_preference",
			top_sleeves: ["no_preference"],
			top_length: ["no_preference"],
			top_preference: ["no_preference"],
		};

		const result = filterTopsByUserAnswers(topsData, userAnswers);
		const scoredTops = result
			.map((top) => ({
				...top,
				score: scoreTop(top, userAnswers, topsData), // Pass topsData for price calculation
			}))
			.sort((a, b) => {
				if (b.score !== a.score) {
					return b.score - a.score;
				}
				return parseFloat(b.preferencescore) - parseFloat(a.preferencescore);
			})
			.slice(0, 3);

		scoredTops.forEach((top) => {
			console.log("Scored Tops:", top);
		});
	} catch (error) {
		console.error("Error:", error);
	}
})();
