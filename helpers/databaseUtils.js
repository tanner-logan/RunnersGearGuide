import wixData from "wix-data";

export function saveToDatabase(userAnswers) {
	const toInsert = {
		outfitid: userAnswers.outfitid,
		weather: userAnswers.weather.join(","),
		gender: userAnswers.gender,
		distance: userAnswers.distance.join(","),
		terrain: userAnswers.terrain.join(","),
		budget: userAnswers.budget.join(","),
		allergies: userAnswers.allergies.join(","),
		ecofriendly: userAnswers.ecofriendly,
		designpreference: userAnswers.designpreference.join(","),
		heavysweater: userAnswers.heavysweater,
		brand: userAnswers.brand.join(","),
		includehat: userAnswers.includehat,
		hatcolor: userAnswers.hatcolor.join(","),
		hatfeatures: userAnswers.hatfeatures.join(","),
		includetop: userAnswers.includetop,
		topcolor: userAnswers.topcolor.join(","),
		top_length: userAnswers.top_length.join(","),
		top_sleeves: userAnswers.top_sleeves.join(","),
		top_preference: userAnswers.top_preference.join(","),
		includebottom: userAnswers.includebottom,
		bottomcolor: userAnswers.bottomcolor.join(","),
		typebottoms: userAnswers.typebottoms.join(","),
		inseam: userAnswers.inseam.join(","),
		bottom_preference: userAnswers.bottom_preference.join(","),
		includeshoes: userAnswers.includeshoes,
		shoecolor: userAnswers.shoecolor.join(","),
		stackheight: userAnswers.stackheight.join(","),
		stability: userAnswers.stability,
		shoeweight: userAnswers.shoeweight.join(","),
		heeltoedrop: userAnswers.heeltoedrop.join(","),
		shoe_preference: userAnswers.shoe_preference.join(","),
		hatid: userAnswers.hatid || "",
		topid: userAnswers.topid || "",
		bottomid: userAnswers.bottomid || "",
		shoeid: userAnswers.shoeid || "",
		userliked: userAnswers.userliked,
		flow: userAnswers.flow,
	};

	wixData
		.insert("UserResponses", toInsert)
		.then((results) => {
			//console.log("Data saved to database:", results);
		})
		.catch((err) => {
			console.error("Error saving to database:", err);
		});
}
