import { saveToDatabase } from "public/helpers/databaseUtils";
import { getCurrentStep, displayOutfit } from "public/helpers/helperFunctions";
import { detailedFlow } from "public/flows/detailed_flow";
import { simpleFlow } from "public/flows/simple_flow";

let outfit1UserDecided = false;
let outfit2UserDecided = false;
let outfit3UserDecided = false;
let isSimpleFlow;

// Global object to store user's answers
let userAnswers = {
	weather: ["no_preference"],
	gender: "no_preference",
	distance: ["no_preference"],
	terrain: ["no_preference"],
	budget: ["no_preference"],
	allergies: ["no_preference"],
	ecofriendly: "no_preference",
	designpreference: ["no_preference"],
	heavysweater: "no_preference",
	brand: ["no_preference"],
	includehat: "yes",
	hatcolor: ["no_preference"],
	hatfeatures: ["no_preference"],
	includetop: "yes",
	topcolor: ["no_preference"],
	top_length: ["no_preference"],
	top_sleeves: ["no_preference"],
	top_preference: ["no_preference"],
	includebottom: "yes",
	bottomcolor: ["no_preference"],
	typebottoms: ["no_preference"],
	inseam: ["no_preference"],
	bottom_preference: ["no_preference"],
	includeshoes: "yes",
	shoecolor: ["no_preference"],
	stackheight: ["no_preference"],
	stability: "no_preference",
	shoeweight: ["no_preference"],
	heeltoedrop: ["no_preference"],
	shoe_preference: ["no_preference"],
	hatids: ["", "", ""],
	topids: ["", "", ""],
	bottomids: ["", "", ""],
	shoeids: ["", "", ""],
	userliked: "no_preference",
};

let hatAnswers = {
	brand: ["no_preference"],
	gender: "no_preference",
	weather: ["no_preference"],
	distance: ["no_preference"],
	price: ["no_preference"],
	allergies: ["no_preference"],
	ecofriendly: "no_preference",
	designpreference: ["no_preference"],
	hatcolor: ["no_preference"],
	hatfeatures: ["no_preference"],
};

let topAnswers = {
	brand: ["no_preference"],
	gender: "no_preference",
	weather: ["no_preference"],
	distance: ["no_preference"],
	price: ["no_preference"],
	allergies: ["no_preference"],
	ecofriendly: "no_preference",
	topcolor: ["no_preference"],
	top_sleeves: ["no_preference"],
	top_length: ["no_preference"],
	top_preference: ["no_preference"],
};

let bottomAnswers = {
	brand: ["no_preference"],
	gender: "no_preference",
	weather: ["no_preference"],
	distance: ["no_preference"],
	price: ["no_preference"],
	allergies: ["no_preference"],
	ecofriendly: "no_preference",
	bottomcolor: ["no_preference"],
	typebottoms: ["no_preference"],
	inseam: ["no_preference"],
	bottom_preference: ["no_preference"],
};

let shoeAnswers = {
	brand: ["no_preference"],
	gender: "no_preference",
	distance: ["no_preference"],
	terrain: ["no_preference"],
	price: ["no_preference"],
	ecofriendly: "no_preference",
	shoecolor: ["no_preference"],
	stackheight: ["no_preference"],
	stability: "no_preference",
	shoeweight: ["no_preference"],
	heeltoedrop: ["no_preference"],
	shoe_preference: ["no_preference"],
};

// Initialize event listeners
$w.onReady(function () {
	// Progress bar initialization
	$w("#progressbar").value = 0;

	// Begin button click handler
	$w("#beginbutton").onClick((event) => {
		$w("#surveryheadersection").scrollTo();
	});

	$w("#simplebutton").onClick((event) => {
		isSimpleFlow = true;
		$w("#simplesurvey").expand();
		$w("#progresssection").expand();
		$w("#selectoneheadertext").hide();
		$w("#outfitquestionstext").show();
		$w("#flowselectionsection").collapse();
		$w("#checkbacksection").collapse();
	});

	$w("#detailedbutton").onClick((event) => {
		isSimpleFlow = false;
		$w("#surveysection").expand();
		$w("#progresssection").expand();
		$w("#selectoneheadertext").hide();
		$w("#initialquestionstext").show();
		$w("#flowselectionsection").collapse();
		$w("#checkbacksection").collapse();
	});

	// Next button click handler
	$w("#nextbutton").onClick((event) => {
		if (isSimpleFlow) {
			simpleFlow(userAnswers, hatAnswers, topAnswers, bottomAnswers, shoeAnswers, outfit1UserDecided, outfit2UserDecided, outfit3UserDecided, true);
		} else {
			const currentStep = getCurrentStep();

			if (!currentStep) {
				console.log("No current step found"); // Add this line for debugging
				return;
			}

			detailedFlow(currentStep, userAnswers, hatAnswers, topAnswers, bottomAnswers, shoeAnswers, outfit1UserDecided, outfit2UserDecided, outfit3UserDecided, false);
		}
	});
});

$w("#thumbsupicon").onClick(() => {
	handleLikeDislike(currentOutfitIndex, true); // Use the current outfit index
});

$w("#thumbsdownicon").onClick(() => {
	handleLikeDislike(currentOutfitIndex, false); // Use the current outfit index
});

let currentOutfitIndex = 0; // Track the currently displayed outfit

$w("#outfit1button").onClick(() => {
	currentOutfitIndex = 0; // Set the index to 0 for Outfit 1
	displayOutfit(0, userAnswers, outfit1UserDecided, outfit2UserDecided, outfit3UserDecided); // Display Outfit 1
});

$w("#outfit2button").onClick(() => {
	currentOutfitIndex = 1; // Set the index to 1 for Outfit 2
	displayOutfit(1, userAnswers, outfit1UserDecided, outfit2UserDecided, outfit3UserDecided); // Display Outfit 2
});

$w("#outfit3button").onClick(() => {
	currentOutfitIndex = 2; // Set the index to 2 for Outfit 3
	displayOutfit(2, userAnswers, outfit1UserDecided, outfit2UserDecided, outfit3UserDecided); // Display Outfit 3
});

function handleLikeDislike(outfitIndex, liked) {
	const outfitId = Math.random().toString(36).substring(2, 18);

	const outfit = {
		outfitid: outfitId,
		hatid: userAnswers.hatids[outfitIndex],
		topid: userAnswers.topids[outfitIndex],
		bottomid: userAnswers.bottomids[outfitIndex],
		shoeid: userAnswers.shoeids[outfitIndex],
		userliked: liked ? "yes" : "no",
	};

	// Update the corresponding variable based on the outfit index
	if (outfitIndex === 0) {
		outfit1UserDecided = true;
	} else if (outfitIndex === 1) {
		outfit2UserDecided = true;
	} else if (outfitIndex === 2) {
		outfit3UserDecided = true;
	}

	$w("#thumbsupicon").hide();
	$w("#thumbsdownicon").hide();

	// Create a shallow copy of userAnswers and exclude specific keys
	const filteredUserAnswers = { ...userAnswers };
	delete filteredUserAnswers.hatids;
	delete filteredUserAnswers.topids;
	delete filteredUserAnswers.bottomids;
	delete filteredUserAnswers.shoeids;
	delete filteredUserAnswers.userliked;

	// Combine filtered userAnswers and outfit into a single object
	const dataToSave = {
		...filteredUserAnswers, // Include filtered userAnswers
		...outfit, // Include the specific outfit data
		flow: isSimpleFlow ? "simple" : "detailed", // Add the flow type
	};

	saveToDatabase(dataToSave);
}
