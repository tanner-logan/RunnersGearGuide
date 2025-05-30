const fs = require("fs");
const Papa = require("papaparse");

function loadWatchesData(filePath) {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, "utf8", (err, data) => {
			if (err) return reject(err);
			Papa.parse(data, {
				header: true,
				skipEmptyLines: true,
				transformHeader: (header) => header.trim(),
				complete: (results) => {
					const cleanedData = results.data.map((row) => {
						Object.keys(row).forEach((key) => {
							if (typeof row[key] === "string") row[key] = row[key].trim();
						});
						return row;
					});
					resolve(cleanedData);
				},
				error: (error) => reject(error),
			});
		});
	});
}

// Hardcoded price categories
function getPriceCategory(price) {
	const p = parseFloat(price);
	if (p <= 250) return "minimum";
	if (p > 250 && p <= 500) return "medium";
	if (p > 500) return "max";
	return null;
}

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

(async () => {
	try {
		const filePath = "./product_data/watches.csv";
		const watchesData = await loadWatchesData(filePath);

		const userAnswers = {
			style: "any",
			distance: "medium",
			price: "medium",
			smartwatch: "notifications_nice",
			battery: "max",
		};

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
			.slice(0, 3); // Take the top 3 only);

		scoredWatches.forEach((watch) => {
			console.log(watch);
			console.log(`Top Watch: ${watch.watchid}, ${watch.product_name}, Score: ${watch.score}, Preference: ${watch.preferencescore}`);
		});
	} catch (error) {
		console.error("Error:", error);
	}
})();
