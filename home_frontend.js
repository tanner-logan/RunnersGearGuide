import wixData from "wix-data";
import { saveToDatabase } from "public/helpers/databaseUtils";
import { convertToCSV, validateRequiredField, getCurrentStep } from "public/helpers/helperFunctions";
import { getTopThreeHats } from "public/hat_recommend";
import { getTopThreeTops } from "public/top_recommend";
import { getTopThreeBottoms } from "public/bottom_recommend";
import { getTopThreeShoes } from "public/shoe_recommend";

let outfit1UserDecided = false;
let outfit2UserDecided = false;
let outfit3UserDecided = false;

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
	top_sleeves: "no_preference",
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

// Global variable to track liked/disliked outfits
let likedOutfits = [];

// Initialize event listeners
$w.onReady(function () {
	// Progress bar initialization
	$w("#progressbar").value = 0;

	// Begin button click handler
	$w("#beginbutton").onClick((event) => {
		$w("#surveryheadersection").scrollTo();
	});

	// Next button click handler
	$w("#nextbutton").onClick((event) => {
		const currentStep = getCurrentStep();

		if (!currentStep) {
			console.log("No current step found"); // Add this line for debugging
			return;
		}

		switch (currentStep) {
			case "weather":
				if (!validateRequiredField($w("#weathercheckbox"))) return;
				[userAnswers, hatAnswers, topAnswers, bottomAnswers].forEach((answers) => {
					answers.weather = $w("#weathercheckbox").value;
				});
				$w("#weathercheckbox").hide();
				$w("#genderradio").show();
				break;

			case "gender":
				if (!validateRequiredField($w("#genderradio"))) return;
				[userAnswers, hatAnswers, topAnswers, bottomAnswers, shoeAnswers].forEach((answers) => {
					answers.gender = $w("#genderradio").value;
				});
				$w("#genderradio").hide();
				$w("#distancecheckbox").show();
				break;

			case "distance":
				if (!validateRequiredField($w("#distancecheckbox"))) return;
				[userAnswers, hatAnswers, topAnswers, bottomAnswers, shoeAnswers].forEach((answers) => {
					answers.distance = $w("#distancecheckbox").value;
				});
				$w("#distancecheckbox").hide();
				$w("#terraincheckbox").show();
				break;

			case "terrain":
				if (!validateRequiredField($w("#terraincheckbox"))) return;
				[userAnswers, shoeAnswers].forEach((answers) => {
					answers.terrain = $w("#terraincheckbox").value;
				});
				$w("#terraincheckbox").hide();
				$w("#budgetcheckbox").show();
				break;

			case "budget":
				if (!validateRequiredField($w("#budgetcheckbox"))) return;
				[userAnswers, hatAnswers, topAnswers, bottomAnswers, shoeAnswers].forEach((answers) => {
					answers.budget = $w("#budgetcheckbox").value;
				});
				$w("#budgetcheckbox").hide();
				$w("#allergiescheckbox").show();
				break;

			case "allergies":
				if (!validateRequiredField($w("#allergiescheckbox"))) return;
				[userAnswers, hatAnswers, topAnswers, bottomAnswers].forEach((answers) => {
					answers.allergies = $w("#allergiescheckbox").value;
				});
				$w("#allergiescheckbox").hide();
				$w("#ecofriendlyradio").show();
				break;

			case "ecofriendly":
				if (!validateRequiredField($w("#ecofriendlyradio"))) return;
				[userAnswers, hatAnswers, topAnswers, bottomAnswers, shoeAnswers].forEach((answers) => {
					answers.ecofriendly = $w("#ecofriendlyradio").value;
				});
				$w("#ecofriendlyradio").hide();
				$w("#designpreferencecheckbox").show();
				break;

			case "designpreference":
				if (!validateRequiredField($w("#designpreferencecheckbox"))) return;
				[userAnswers, hatAnswers].forEach((answers) => {
					answers.designpreference = $w("#designpreferencecheckbox").value;
				});
				$w("#designpreferencecheckbox").hide();
				$w("#heavysweaterradio").show();
				break;

			case "heavysweater":
				if (!validateRequiredField($w("#heavysweaterradio"))) return;
				userAnswers.heavysweater = $w("#heavysweaterradio").value;
				$w("#heavysweaterradio").hide();
				$w("#brandcheckbox").show();
				break;

			case "brand":
				if (!validateRequiredField($w("#brandcheckbox"))) return;
				[userAnswers, hatAnswers, topAnswers, bottomAnswers, shoeAnswers].forEach((answers) => {
					answers.brand = $w("#brandcheckbox").value;
				});
				$w("#brandcheckbox").hide();
				$w("#initialquestionstext").hide();
				$w("#initialQuestionsContainer").hide();
				$w("#progressbar").value += 5;
				$w("#hattext").show();
				$w("#includehatradio").show();
				break;

			case "includehat":
				if (!validateRequiredField($w("#includehatradio"))) return;
				userAnswers.includehat = $w("#includehatradio").value;
				if (userAnswers.includehat === "no") {
					$w("#includehatradio").hide();
					$w("#hatContainer").hide();
					$w("#progressbar").value += 5;
					$w("#hattext").hide();
					$w("#toptext").show();
					$w("#topContainer").show();
					$w("#includetopradio").show();
				} else {
					$w("#includehatradio").hide();
					$w("#hatcolorcheckbox").show();
				}
				break;

			case "hatcolor":
				if (!validateRequiredField($w("#hatcolorcheckbox"))) return;
				[userAnswers, hatAnswers].forEach((answers) => {
					answers.hatcolor = $w("#hatcolorcheckbox").value;
				});
				$w("#hatcolorcheckbox").hide();
				$w("#hatfeaturescheckbox").show();
				break;

			case "hatfeatures":
				if (!validateRequiredField($w("#hatfeaturescheckbox"))) return;
				[userAnswers, hatAnswers].forEach((answers) => {
					answers.hatfeatures = $w("#hatfeaturescheckbox").value;
				});
				$w("#hatfeaturescheckbox").hide();
				$w("#hatContainer").hide();
				$w("#hattext").hide();
				$w("#progressbar").value += 5;
				$w("#toptext").show();
				$w("#topContainer").show();
				$w("#includetopradio").show();
				break;

			case "includetop":
				if (!validateRequiredField($w("#includetopradio"))) return;
				userAnswers.includetop = $w("#includetopradio").value;
				if (userAnswers.includetop === "no") {
					$w("#includetopradio").hide();
					$w("#topContainer").hide();
					$w("#progressbar").value += 5;
					$w("#toptext").hide();
					$w("#bottomtext").show();
					$w("#bottomContainer").show();
					$w("#includebottomradio").show();
				} else {
					$w("#includetopradio").hide();
					$w("#topcolorcheckbox").show();
				}
				break;

			case "topcolor":
				if (!validateRequiredField($w("#topcolorcheckbox"))) return;
				[userAnswers, topAnswers].forEach((answers) => {
					answers.topcolor = $w("#topcolorcheckbox").value;
				});
				$w("#topcolorcheckbox").hide();
				$w("#topsleevesradio").show();
				break;

			case "top_sleeves":
				if (!validateRequiredField($w("#topsleevesradio"))) return;
				[userAnswers, topAnswers].forEach((answers) => {
					answers.top_sleeves = [$w("#topsleevesradio").value];
				});
				$w("#topsleevesradio").hide();
				$w("#toplengthcheckbox").show();
				break;

			case "top_length":
				if (!validateRequiredField($w("#toplengthcheckbox"))) return;
				[userAnswers, topAnswers].forEach((answers) => {
					answers.top_length = $w("#toplengthcheckbox").value;
				});
				$w("#toplengthcheckbox").hide();
				$w("#toppreferencecheckbox").show();
				break;

			case "top_preference":
				if (!validateRequiredField($w("#toppreferencecheckbox"))) return;
				[userAnswers, topAnswers].forEach((answers) => {
					answers.top_preference = $w("#toppreferencecheckbox").value;
				});
				$w("#toppreferencecheckbox").hide();
				$w("#topContainer").hide();
				$w("#toptext").hide();
				$w("#progressbar").value += 5;
				$w("#bottomtext").show();
				$w("#bottomContainer").show();
				$w("#includebottomradio").show();
				break;

			case "includebottom":
				if (!validateRequiredField($w("#includebottomradio"))) return;
				userAnswers.includebottom = $w("#includebottomradio").value;
				if (userAnswers.includebottom === "no") {
					$w("#includebottomradio").hide();
					$w("#bottomContainer").hide();
					$w("#bottomtext").hide();
					$w("#progressbar").value += 5;
					$w("#shoestext").show();
					$w("#shoesContainer").show();
					$w("#includeshoesradio").show();
				} else {
					$w("#includebottomradio").hide();
					$w("#bottomcolorcheckbox").show();
				}
				break;

			case "bottomcolor":
				if (!validateRequiredField($w("#bottomcolorcheckbox"))) return;
				[userAnswers, bottomAnswers].forEach((answers) => {
					answers.bottomcolor = $w("#bottomcolorcheckbox").value;
				});
				$w("#bottomcolorcheckbox").hide();
				$w("#typebottomscheckbox").show();
				break;

			case "typebottoms":
				if (!validateRequiredField($w("#typebottomscheckbox"))) return;
				[userAnswers, bottomAnswers].forEach((answers) => {
					answers.typebottoms = $w("#typebottomscheckbox").value;
				});
				$w("#typebottomscheckbox").hide();
				if (userAnswers.typebottoms.includes("shorts") || userAnswers.typebottoms.includes("no_preference")) {
					$w("#inseamcheckbox").show();
				} else {
					$w("#bottompreferencecheckbox").show();
				}
				break;

			case "inseam":
				if (!validateRequiredField($w("#inseamcheckbox"))) return;
				[userAnswers, bottomAnswers].forEach((answers) => {
					answers.inseam = $w("#inseamcheckbox").value;
				});
				$w("#inseamcheckbox").hide();
				$w("#bottompreferencecheckbox").show();
				break;

			case "bottom_preference":
				if (!validateRequiredField($w("#bottompreferencecheckbox"))) return;
				[userAnswers, bottomAnswers].forEach((answers) => {
					answers.bottom_preference = $w("#bottompreferencecheckbox").value;
				});
				$w("#bottompreferencecheckbox").hide();
				$w("#bottomContainer").hide();
				$w("#bottomtext").hide();
				$w("#progressbar").value += 5;
				$w("#shoestext").show();
				$w("#includeshoesradio").show();
				break;

			case "includeshoes":
				if (!validateRequiredField($w("#includeshoesradio"))) return;
				userAnswers.includeshoes = $w("#includeshoesradio").value;
				if (userAnswers.includeshoes === "no") {
					$w("#includeshoesradio").hide();
					$w("#shoestext").hide();
					$w("#progressbar").value += 5;
					$w("#completetext").show();
					$w("#nextbutton").disable();
					$w("#headersection").expand();
					$w("#productimagesection").expand();
					$w("#likedislikesection").expand();
					$w("#outfitbuttonsection").expand();
					$w("#hatheader").show();
					$w("#topheader").show();
					$w("#bottomheader").show();
					$w("#shoesheader").show();
					$w("#outfitsforyousection").expand();

					// Fetch top recommendations
					fetchTopRecommendations();

					$w("#surveryheadersection").collapse();
					$w("#surveysection").collapse();
					$w("#progresssection").collapse();
				} else {
					$w("#includeshoesradio").hide();
					$w("#shoecolorcheckbox").show();
				}
				break;

			case "shoecolor":
				if (!validateRequiredField($w("#shoecolorcheckbox"))) return;
				[userAnswers, shoeAnswers].forEach((answers) => {
					answers.shoecolor = $w("#shoecolorcheckbox").value;
				});
				$w("#shoecolorcheckbox").hide();
				$w("#stackheightcheckbox").show();
				break;

			case "stackheight":
				if (!validateRequiredField($w("#stackheightcheckbox"))) return;
				[userAnswers, shoeAnswers].forEach((answers) => {
					answers.stackheight = $w("#stackheightcheckbox").value;
				});
				$w("#stackheightcheckbox").hide();
				$w("#stabilityradio").show();
				break;

			case "stability":
				if (!validateRequiredField($w("#stabilityradio"))) return;
				[userAnswers, shoeAnswers].forEach((answers) => {
					answers.stability = $w("#stabilityradio").value;
				});
				$w("#stabilityradio").hide();
				$w("#shoeweightcheckbox").show();
				break;

			case "shoeweight":
				if (!validateRequiredField($w("#shoeweightcheckbox"))) return;
				[userAnswers, shoeAnswers].forEach((answers) => {
					answers.shoeweight = $w("#shoeweightcheckbox").value;
				});
				$w("#shoeweightcheckbox").hide();
				$w("#heeltoedropcheckbox").show();
				break;

			case "heeltoedrop":
				if (!validateRequiredField($w("#heeltoedropcheckbox"))) return;
				[userAnswers, shoeAnswers].forEach((answers) => {
					answers.heeltoedrop = $w("#heeltoedropcheckbox").value;
				});
				$w("#heeltoedropcheckbox").hide();
				$w("#shoepreferencescheckbox").show();
				break;

			case "shoe_preference":
				if (!validateRequiredField($w("#shoepreferencescheckbox"))) return;
				[userAnswers, shoeAnswers].forEach((answers) => {
					answers.shoe_preference = $w("#shoepreferencescheckbox").value;
				});
				$w("#shoepreferencescheckbox").disable();
				$w("#shoestext").hide();
				$w("#progressbar").value += 5;
				$w("#completetext").show();
				$w("#nextbutton").disable();
				$w("#headersection").expand();
				$w("#productimagesection").expand();
				$w("#likedislikesection").expand();
				$w("#outfitbuttonsection").expand();
				$w("#hatheader").show();
				$w("#topheader").show();
				$w("#bottomheader").show();
				$w("#shoesheader").show();
				$w("#outfitsforyousection").expand();

				// Fetch top recommendations
				fetchTopRecommendations();

				$w("#surveryheadersection").collapse();
				$w("#surveysection").collapse();
				$w("#progresssection").collapse();

				$w("#surveryheadersection").collapse();
				$w("#surveysection").collapse();
				$w("#progresssection").collapse();
				break;
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
	displayOutfit(0); // Display Outfit 1
});

$w("#outfit2button").onClick(() => {
	currentOutfitIndex = 1; // Set the index to 1 for Outfit 2
	displayOutfit(1); // Display Outfit 2
});

$w("#outfit3button").onClick(() => {
	currentOutfitIndex = 2; // Set the index to 2 for Outfit 3
	displayOutfit(2); // Display Outfit 3
});

async function fetchTopRecommendations() {
	try {
		// Fetch top recommendations for each category
		const [hatIds, topIds, bottomIds, shoeIds] = await Promise.all([getTopThreeHats(hatAnswers), getTopThreeTops(topAnswers), getTopThreeBottoms(bottomAnswers), getTopThreeShoes(shoeAnswers)]);

		// Update userAnswers with the fetched IDs
		userAnswers.hatids = hatIds;
		userAnswers.topids = topIds;
		userAnswers.bottomids = bottomIds;
		userAnswers.shoeids = shoeIds;

		// Ensure data is fully updated before calling displayOutfit
		if (userAnswers.hatids.length > 0 && userAnswers.topids.length > 0 && userAnswers.bottomids.length > 0 && userAnswers.shoeids.length > 0) {
			displayOutfit(0); // Call displayOutfit only when data is ready
		} else {
			console.error("Error: One or more categories are empty in userAnswers.");
		}
	} catch (error) {
		console.error("Error fetching top recommendations:", error);
	}
}

async function displayOutfit(outfitIndex) {
	const outfit = [userAnswers.hatids[outfitIndex], userAnswers.topids[outfitIndex], userAnswers.bottomids[outfitIndex], userAnswers.shoeids[outfitIndex]];

	// Ensure like/dislike buttons are hidden if the user has already decided
	if (outfitIndex === 0 && outfit1UserDecided) {
		$w("#thumbsupicon").hide();
		$w("#thumbsdownicon").hide();
	} else if (outfitIndex === 1 && outfit2UserDecided) {
		$w("#thumbsupicon").hide();
		$w("#thumbsdownicon").hide();
	} else if (outfitIndex === 2 && outfit3UserDecided) {
		$w("#thumbsupicon").hide();
		$w("#thumbsdownicon").hide();
	} else {
		$w("#thumbsupicon").show();
		$w("#thumbsdownicon").show();
	}

	// Fetch and display hat image
	if (userAnswers.includehat === "yes" && outfit[0]) {
		const hat = await wixData.query("hats").eq("hatid", outfit[0]).find();
		if (hat.items.length > 0 && hat.items[0].image) {
			$w("#hatimage").src = hat.items[0].image; // Set the image URL
			$w("#hatimage").link = hat.items[0].link; // Set the link URL
			$w("#hatimage").show();
			$w("#nohatincludedtext").hide();
		} else {
			$w("#hatimage").hide();
			$w("#nohatincludedtext").show();
		}
	} else {
		$w("#hatimage").hide();
		$w("#nohatincludedtext").show();
	}

	// Fetch and display top image
	if (userAnswers.includetop === "yes" && outfit[1]) {
		const top = await wixData.query("tops").eq("topid", outfit[1]).find();
		if (top.items.length > 0 && top.items[0].image) {
			$w("#shirtimage").src = top.items[0].image; // Set the image URL
			$w("#shirtimage").link = top.items[0].link; // Set the link URL
			$w("#shirtimage").show();
			$w("#notopincludedtext").hide();
		} else {
			$w("#shirtimage").hide();
			$w("#notopincludedtext").show();
		}
	} else {
		$w("#shirtimage").hide();
		$w("#notopincludedtext").show();
	}

	// Fetch and display bottom image
	if (userAnswers.includebottom === "yes" && outfit[2]) {
		const bottom = await wixData.query("bottoms").eq("bottomid", outfit[2]).find();
		if (bottom.items.length > 0 && bottom.items[0].image) {
			$w("#pantsimage").src = bottom.items[0].image; // Set the image URL
			$w("#pantsimage").link = bottom.items[0].link; // Set the link URL
			$w("#pantsimage").show();
			$w("#nobottomincludedtext").hide();
		} else {
			$w("#pantsimage").hide();
			$w("#nobottomincludedtext").show();
		}
	} else {
		$w("#pantsimage").hide();
		$w("#nobottomincludedtext").show();
	}

	// Fetch and display shoe image
	if (userAnswers.includeshoes === "yes" && outfit[3]) {
		const shoe = await wixData.query("shoes").eq("shoeid", outfit[3]).find();
		if (shoe.items.length > 0 && shoe.items[0].image) {
			$w("#shoesimage").src = shoe.items[0].image; // Set the image URL
			$w("#shoesimage").link = shoe.items[0].link; // Set the link URL
			$w("#shoesimage").show();
			$w("#noshoesincludedtext").hide();
		} else {
			$w("#shoesimage").hide();
			$w("#noshoesincludedtext").show();
		}
	} else {
		$w("#shoesimage").hide();
		$w("#noshoesincludedtext").show();
	}
}

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
	};

	saveToDatabase(dataToSave);
}
