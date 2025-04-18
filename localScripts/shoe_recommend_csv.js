/*
shoes csv
shoeid,product_name,brand,shoecolor,gender,distance,terrain,price,ecofriendly,stackheight,stability,shoeweight,heeltoedrop,shoe_preference,preferencescore,description,image,link
*/

const fs = require("fs");
const Papa = require("papaparse");

function loadShoesData(filePath) {
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

function filterShoesByUserAnswers(shoesData, userAnswers) {
	const excludedBrands = ["adidas", "asics", "brooks", "nike", "under_armour", "new_balance", "reebok", "hoka", "saucony"];

	// Filter the shoes based on userAnswers
	const matchingShoes = shoesData.filter((shoe) => {
		return Object.keys(userAnswers).every((key) => {
			const userValue = userAnswers[key];

			// Ignore price, stackheight, shoeweight, and heeltoedrop filtering here
			if (["price", "stackheight", "shoeweight", "heeltoedrop"].includes(key)) {
				return true;
			}

			if (userValue === "no_preference" || (Array.isArray(userValue) && userValue.includes("no_preference"))) {
				return true;
			}

			if (key === "gender" && typeof userValue === "string") {
				if (shoe[key]) {
					return shoe[key].toLowerCase().includes(userValue.toLowerCase());
				}
				return false;
			}

			// Brand filtering logic
			if (key === "brand") {
				if (Array.isArray(userValue)) {
					if (userValue.length === 1 && userValue[0].toLowerCase() === "other") {
						return !excludedBrands.includes(shoe[key]?.toLowerCase());
					} else if (userValue.includes("other")) {
						const specifiedBrands = userValue.filter((brand) => brand.toLowerCase() !== "other").map((brand) => brand.toLowerCase());
						return !excludedBrands.includes(shoe[key]?.toLowerCase()) || specifiedBrands.includes(shoe[key]?.toLowerCase());
					} else {
						return userValue.includes(shoe[key]?.toLowerCase());
					}
				}
				return false;
			}

			if (Array.isArray(userValue)) {
				if (shoe[key]) {
					const shoeValues = shoe[key].split(",").map((value) => value.trim().toLowerCase());
					return userValue.some((answer) => shoeValues.includes(answer.toLowerCase()));
				}
				return false;
			}

			if (typeof userValue === "string") {
				return shoe[key] && shoe[key].toLowerCase() === userValue.toLowerCase();
			}

			return false;
		});
	});

	// Add logic to handle cases where fewer than 3 matches are found
	if (matchingShoes.length >= 3) {
		console.log("3 or more matches found: ", matchingShoes.length);
	} else {
		console.log("Less than 3 matches found");
	}

	return matchingShoes.length >= 3
		? matchingShoes
		: shoesData.filter((shoe) => {
				if (userAnswers.gender !== "no_preference") {
					return shoe.gender && shoe.gender.toLowerCase().includes(userAnswers.gender.toLowerCase());
				}
				return true; // If gender is "no_preference", include all items
		  });
}

function scoreShoes(shoe, userAnswers, filteredShoes) {
	let score = 0;

	// Calculate ranges for price, stackheight, shoeweight, and heeltoedrop
	const calculateRanges = (column) => {
		const values = filteredShoes
			.map((item) => parseFloat(item[column]))
			.filter((value) => !isNaN(value)) // Filter out invalid or non-numeric values
			.sort((a, b) => a - b);

		if (values.length === 0) {
			// Handle the case where no valid values are found
			return {
				minimum: [0, 0],
				medium: [0, 0],
				max: [0, 0],
			};
		}

		const lowest = values[0];
		const highest = values[values.length - 1];
		const rangeStep = (highest - lowest) / 3;

		return {
			minimum: [lowest, lowest + rangeStep],
			medium: [lowest + rangeStep, lowest + 2 * rangeStep],
			max: [lowest + 2 * rangeStep, highest],
		};
	};

	const priceRanges = calculateRanges("price");
	const stackHeightRanges = calculateRanges("stackheight");
	const shoeWeightRanges = calculateRanges("shoeweight");
	const heelToeDropRanges = calculateRanges("heeltoedrop");

	// Score price
	if (!userAnswers.price.includes("no_preference")) {
		const itemPrice = parseFloat(shoe.price);
		if (userAnswers.price.includes("minimum") && itemPrice >= priceRanges.minimal[0] && itemPrice <= priceRanges.minimal[1]) {
			score++;
		}
		if (userAnswers.price.includes("medium") && itemPrice > priceRanges.moderate[0] && itemPrice <= priceRanges.moderate[1]) {
			score++;
		}
		if (userAnswers.price.includes("max") && itemPrice > priceRanges.max[0]) {
			score++;
		}
	}

	// Score brand
	if (!userAnswers.brand.includes("no_preference")) {
		if (shoe.brand && userAnswers.brand.includes(shoe.brand)) {
			score++;
		}
	}

	// Score shoecolor
	if (!userAnswers.shoecolor.includes("no_preference")) {
		if (shoe.shoecolor) {
			const shoeColors = shoe.shoecolor.split(",").map((color) => color.trim());
			const matchingColors = userAnswers.shoecolor.filter((color) => shoeColors.includes(color));
			score += matchingColors.length;
		}
	}

	// Score distance
	if (!userAnswers.distance.includes("no_preference")) {
		if (shoe.distance) {
			const shoeDistances = shoe.distance.split(",").map((distance) => distance.trim());
			const matchingDistances = userAnswers.distance.filter((distance) => shoeDistances.includes(distance));
			score += matchingDistances.length;
		}
	}

	// Score ecofriendly
	if (userAnswers.ecofriendly === "yes") {
		if (shoe.ecofriendly === "yes") {
			score += 1.5;
		}
	}

	// Score stackheight
	if (!userAnswers.stackheight.includes("no_preference")) {
		const itemStackHeight = parseFloat(shoe.stackheight);
		if (userAnswers.stackheight.includes("minimum") && itemStackHeight >= stackHeightRanges.minimum[0] && itemStackHeight <= stackHeightRanges.minimum[1]) {
			score++;
		}
		if (userAnswers.stackheight.includes("medium") && itemStackHeight > stackHeightRanges.medium[0] && itemStackHeight <= stackHeightRanges.medium[1]) {
			score++;
		}
		if (userAnswers.stackheight.includes("max") && itemStackHeight > stackHeightRanges.max[0]) {
			score++;
		}
	}

	// Score shoeweight
	if (!userAnswers.shoeweight.includes("no_preference")) {
		const itemShoeWeight = parseFloat(shoe.shoeweight);
		if (userAnswers.shoeweight.includes("minimum") && itemShoeWeight >= shoeWeightRanges.minimum[0] && itemShoeWeight <= shoeWeightRanges.minimum[1]) {
			score++;
		}
		if (userAnswers.shoeweight.includes("medium") && itemShoeWeight > shoeWeightRanges.medium[0] && itemShoeWeight <= shoeWeightRanges.medium[1]) {
			score++;
		}
		if (userAnswers.shoeweight.includes("max") && itemShoeWeight > shoeWeightRanges.max[0]) {
			score++;
		}
	}

	// Score heeltoedrop
	if (!userAnswers.heeltoedrop.includes("no_preference")) {
		const itemHeelToeDrop = parseFloat(shoe.heeltoedrop);
		if (userAnswers.heeltoedrop.includes("minimum") && itemHeelToeDrop >= heelToeDropRanges.minimum[0] && itemHeelToeDrop <= heelToeDropRanges.minimum[1]) {
			score++;
		}
		if (userAnswers.heeltoedrop.includes("medium") && itemHeelToeDrop > heelToeDropRanges.medium[0] && itemHeelToeDrop <= heelToeDropRanges.medium[1]) {
			score++;
		}
		if (userAnswers.heeltoedrop.includes("max") && itemHeelToeDrop > heelToeDropRanges.max[0]) {
			score++;
		}
	}

	// Score shoe_preference
	if (!userAnswers.shoe_preference.includes("no_preference")) {
		if (shoe.shoe_preference) {
			const shoePreferences = shoe.shoe_preference.split(",").map((preference) => preference.trim());
			const matchingPreferences = userAnswers.shoe_preference.filter((preference) => shoePreferences.includes(preference));
			score += matchingPreferences.length;
		}
	}

	// Score terrain
	if (!userAnswers.terrain.includes("no_preference")) {
		if (shoe.terrain) {
			const shoeTerrains = shoe.terrain.split(",").map((terrain) => terrain.trim());
			const matchingTerrains = userAnswers.terrain.filter((terrain) => shoeTerrains.includes(terrain));
			score += matchingTerrains.length;
		}
	}

	// Score stability
	if (userAnswers.stability !== "no_preference") {
		if (shoe.stability && shoe.stability.toLowerCase() === userAnswers.stability.toLowerCase()) {
			score++;
		}
	}

	return score;
}

(async () => {
	try {
		const filePath = "./product_data/shoes.csv";
		const shoesData = await loadShoesData(filePath);

		const userAnswers = {
			brand: ["no_preference"],
			shoecolor: ["no_preference"],
			gender: "female",
			distance: ["no_preference"],
			terrain: ["no_preference"],
			price: ["no_preference"],
			ecofriendly: "no_preference",
			stackheight: ["no_preference"],
			stability: "no_preference",
			shoeweight: ["no_preference"],
			heeltoedrop: ["no_preference"],
			shoe_preference: ["wide_toe_box"],
		};

		const result = filterShoesByUserAnswers(shoesData, userAnswers);
		const scoredShoes = result
			.map((shoe) => ({
				...shoe,
				score: scoreShoes(shoe, userAnswers, result), // Pass the filtered results
			}))
			.sort((a, b) => {
				if (b.score !== a.score) {
					return b.score - a.score;
				}
				return parseFloat(b.preferencescore) - parseFloat(a.preferencescore);
			})
			.slice(0, 3);

		scoredShoes.forEach((shoe) => {
			console.log("Scored Shoes:", shoe);
		});
	} catch (error) {
		console.error("Error:", error);
	}
})();
