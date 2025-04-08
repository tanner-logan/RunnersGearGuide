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
		topfit: userAnswers.topfit.join(","),
		topfeatures: userAnswers.topfeatures.join(","),
		shortlongsleeves: userAnswers.shortlongsleeves,
		includebottom: userAnswers.includebottom,
		bottomcolor: userAnswers.bottomcolor.join(","),
		pockets: userAnswers.pockets,
		typebottoms: userAnswers.typebottoms.join(","),
		liner: userAnswers.liner,
		inseam: userAnswers.inseam,
		thermals: userAnswers.thermals,
		highwaisted: userAnswers.highwaisted,
		includeshoes: userAnswers.includeshoes,
		shoecolor: userAnswers.shoecolor.join(","),
		stackheight: userAnswers.stackheight.join(","),
		stability: userAnswers.stability,
		shoeweight: userAnswers.shoeweight.join(","),
		heeltoedrop: userAnswers.heeltoedrop.join(","),
		shoepreferences: userAnswers.shoepreferences.join(","),
		hatid: userAnswers.hatid,
		topid: userAnswers.topid,
		bottomid: userAnswers.bottomid,
		shoeid: userAnswers.shoeid,
		userliked: userAnswers.userliked,
	};

	wixData.insert("UserResponses", toInsert).catch((err) => {
		console.error("Error saving to database:", err);
	});
}
