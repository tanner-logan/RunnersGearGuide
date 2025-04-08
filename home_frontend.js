import { saveToDatabase } from "public/databaseUtils";
import { convertToCSV, validateRequiredField, getCurrentStep } from "public/helperFunctions";

// Global object to store user's answers
let userAnswers = {
	outfitid: Math.random()
		.toString(36)
		.substring(2, 18)
		.padEnd(16, "0")
		.slice(0, Math.floor(Math.random() * 5) + 12),
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
	//topfit: ["no_preference"],
	topfeatures: ["no_preference"],
	shortlongsleeves: "no_preference",
	includebottom: "yes",
	bottomcolor: ["no_preference"],
	pockets: "no_preference",
	typebottoms: ["no_preference"],
	liner: "no_preference",
	inseam: "no_preference",
	thermals: "no_preference",
	highwaisted: "no_preference",
	includeshoes: "yes",
	shoecolor: ["no_preference"],
	stackheight: ["no_preference"],
	stability: "no_preference",
	shoeweight: ["no_preference"],
	heeltoedrop: ["no_preference"],
	shoepreferences: ["no_preference"],
	hatid: "none",
	topid: "none",
	bottomid: "none",
	shoeid: "none",
	userliked: "no_preference",
};

// Initialize event listeners
$w.onReady(function () {
	//$w("#beginbutton").disable();
	// Hide elements that should not be visible initially
	$w("#initialquestionstext").hide();
	$w("#weathercheckbox").hide();
	$w("#genderradio").hide();
	$w("#distancecheckbox").hide();
	$w("#terraincheckbox").hide();
	$w("#budgetcheckbox").hide();
	$w("#allergiescheckbox").hide();
	$w("#ecofriendlyradio").hide();
	$w("#designpreferencecheckbox").hide();
	$w("#heavysweaterradio").hide();
	$w("#brandcheckbox").hide();
	$w("#requiredfielderror").hide();
	$w("#nextbutton").hide();
	$w("#progressbar").hide();
	$w("#hatimage").hide();
	$w("#shirtimage").hide();
	$w("#pantsimage").hide();
	$w("#shoesimage").hide();
	$w("#thumbsupicon").hide();
	$w("#thumbsdownicon").hide();
	$w("#respinbutton").hide();

	// Progress bar initialization
	$w("#progressbar").value = 0;

	// Begin button click handler
	$w("#beginbutton").onClick((event) => {
		// Disable begin button after click
		$w("#beginbutton").disable();

		// Show initial elements
		$w("#initialquestionstext").show();
		$w("#weathercheckbox").show();
		$w("#nextbutton").show();
		$w("#progressbar").show();
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
				userAnswers.weather = $w("#weathercheckbox").value;
				$w("#weathercheckbox").hide();
				$w("#genderradio").show();
				break;

			case "gender":
				if (!validateRequiredField($w("#genderradio"))) return;
				userAnswers.gender = $w("#genderradio").value;
				$w("#genderradio").hide();
				$w("#distancecheckbox").show();
				break;

			case "distance":
				if (!validateRequiredField($w("#distancecheckbox"))) return;
				userAnswers.distance = $w("#distancecheckbox").value;
				$w("#distancecheckbox").hide();
				$w("#terraincheckbox").show();
				break;

			case "terrain":
				if (!validateRequiredField($w("#terraincheckbox"))) return;
				userAnswers.terrain = $w("#terraincheckbox").value;
				$w("#terraincheckbox").hide();
				$w("#budgetcheckbox").show();
				break;

			case "budget":
				if (!validateRequiredField($w("#budgetcheckbox"))) return;
				userAnswers.budget = $w("#budgetcheckbox").value;
				$w("#budgetcheckbox").hide();
				$w("#allergiescheckbox").show();
				break;

			case "allergies":
				if (!validateRequiredField($w("#allergiescheckbox"))) return;
				userAnswers.allergies = $w("#allergiescheckbox").value;
				$w("#allergiescheckbox").hide();
				$w("#ecofriendlyradio").show();
				break;

			case "ecofriendly":
				if (!validateRequiredField($w("#ecofriendlyradio"))) return;
				userAnswers.ecofriendly = $w("#ecofriendlyradio").value;
				$w("#ecofriendlyradio").hide();
				$w("#designpreferencecheckbox").show();
				break;

			case "designpreference":
				if (!validateRequiredField($w("#designpreferencecheckbox"))) return;
				userAnswers.designpreference = $w("#designpreferencecheckbox").value;
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
				userAnswers.brand = $w("#brandcheckbox").value;
				$w("#brandcheckbox").hide();
				$w("#initialquestionstext").hide();
				$w("#progressbar").value += 5;
				$w("#hattext").show();
				$w("#includehatradio").show();
				break;

			case "includehat":
				if (!validateRequiredField($w("#includehatradio"))) return;
				userAnswers.includehat = $w("#includehatradio").value;

				if (userAnswers.includehat === "no") {
					$w("#includehatradio").hide();
					$w("#progressbar").value += 5;
					$w("#hattext").hide();
					$w("#toptext").show();
					$w("#includetopradio").show();
				} else {
					$w("#includehatradio").hide();
					$w("#hatcolorcheckbox").show();
				}
				break;

			case "hatcolor":
				if (!validateRequiredField($w("#hatcolorcheckbox"))) return;
				userAnswers.hatcolor = $w("#hatcolorcheckbox").value;
				$w("#hatcolorcheckbox").hide();
				$w("#hatfeaturescheckbox").show();
				break;

			case "hatfeatures":
				if (!validateRequiredField($w("#hatfeaturescheckbox"))) return;
				userAnswers.hatfeatures = $w("#hatfeaturescheckbox").value;
				$w("#hatfeaturescheckbox").hide();
				$w("#hattext").hide();
				$w("#progressbar").value += 5;
				$w("#toptext").show();
				$w("#includetopradio").show();
				break;

			case "includetop":
				if (!validateRequiredField($w("#includetopradio"))) return;
				userAnswers.includetop = $w("#includetopradio").value;

				if (userAnswers.includetop === "no") {
					$w("#includetopradio").hide();
					$w("#progressbar").value += 5;
					$w("#toptext").hide();
					$w("#bottomtext").show();
					$w("#includebottomradio").show();
				} else {
					$w("#includetopradio").hide();
					$w("#topcolorcheckbox").show();
				}
				break;

			case "topcolor":
				if (!validateRequiredField($w("#topcolorcheckbox"))) return;
				userAnswers.topcolor = $w("#topcolorcheckbox").value;
				$w("#topcolorcheckbox").hide();
				//$w("#topfitcheckbox").show();
				$w("#topfeaturescheckbox").show();
				break;

			/* 			case "topfit":
				if (!validateRequiredField($w("#topfitcheckbox"))) return;
				userAnswers.topfit = $w("#topfitcheckbox").value;
				$w("#topfitcheckbox").hide();
				$w("#topfeaturescheckbox").show();
				break; */

			case "topfeatures":
				if (!validateRequiredField($w("#topfeaturescheckbox"))) return;
				userAnswers.topfeatures = $w("#topfeaturescheckbox").value;
				$w("#topfeaturescheckbox").hide();
				$w("#shortlongsleevesradio").show();
				break;

			case "shortlongsleeves":
				if (!validateRequiredField($w("#shortlongsleevesradio"))) return;
				userAnswers.shortlongsleeves = $w("#shortlongsleevesradio").value;
				$w("#shortlongsleevesradio").hide();
				$w("#toptext").hide();
				$w("#progressbar").value += 5;
				$w("#bottomtext").show();
				$w("#includebottomradio").show();
				break;

			case "includebottom":
				if (!validateRequiredField($w("#includebottomradio"))) return;
				userAnswers.includebottom = $w("#includebottomradio").value;

				if (userAnswers.includebottom === "no") {
					$w("#includebottomradio").hide();
					$w("#bottomtext").hide();
					$w("#progressbar").value += 5;
					$w("#shoestext").show();
					$w("#includeshoesradio").show();
				} else {
					$w("#includebottomradio").hide();
					$w("#bottomcolorcheckbox").show();
				}
				break;

			case "bottomcolor":
				if (!validateRequiredField($w("#bottomcolorcheckbox"))) return;
				userAnswers.bottomcolor = $w("#bottomcolorcheckbox").value;
				$w("#bottomcolorcheckbox").hide();
				$w("#pocketsradio").show();
				break;

			case "pockets":
				if (!validateRequiredField($w("#pocketsradio"))) return;
				userAnswers.pockets = $w("#pocketsradio").value;
				$w("#pocketsradio").hide();
				$w("#typebottomscheckbox").show();
				break;

			case "typebottoms":
				if (!validateRequiredField($w("#typebottomscheckbox"))) return;
				userAnswers.typebottoms = $w("#typebottomscheckbox").value;

				$w("#typebottomscheckbox").hide();

				if (userAnswers.typebottoms.includes("shorts")) {
					$w("#linerradio").show();
				} else if (["pants", "tights_leggings", "capris"].some((type) => userAnswers.typebottoms.includes(type))) {
					$w("#thermalsradio").show();
				} else if (userAnswers.gender === "female") {
					$w("#highwaistedradio").show();
				} else {
					$w("#bottomtext").hide();
					$w("#progressbar").value += 5;
					$w("#shoestext").show();
					$w("#includeshoesradio").show();
				}
				break;

			case "liner":
				if (!validateRequiredField($w("#linerradio"))) return;
				userAnswers.liner = $w("#linerradio").value;
				$w("#linerradio").hide();
				$w("#inseamradio").show();
				break;

			case "inseam":
				if (!validateRequiredField($w("#inseamradio"))) return;
				userAnswers.inseam = $w("#inseamradio").value;
				$w("#inseamradio").hide();

				if (["pants", "tights_leggings", "capris"].some((type) => userAnswers.typebottoms.includes(type))) {
					$w("#thermalsradio").show();
				} else if (userAnswers.gender === "female") {
					$w("#highwaistedradio").show();
				} else {
					$w("#bottomtext").hide();
					$w("#progressbar").value += 5;
					$w("#shoestext").show();
					$w("#includeshoesradio").show();
				}
				break;

			case "thermals":
				if (!validateRequiredField($w("#thermalsradio"))) return;
				userAnswers.thermals = $w("#thermalsradio").value;
				$w("#thermalsradio").hide();

				if (userAnswers.gender === "female") {
					$w("#highwaistedradio").show();
				} else {
					$w("#bottomtext").hide();
					$w("#progressbar").value += 5;
					$w("#shoestext").show();
					$w("#includeshoesradio").show();
				}
				break;

			case "highwaisted":
				if (!validateRequiredField($w("#highwaistedradio"))) return;
				userAnswers.highwaisted = $w("#highwaistedradio").value;
				$w("#highwaistedradio").hide();
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
					$w("#hatimage").show();
					$w("#shirtimage").show();
					$w("#pantsimage").show();
					$w("#shoesimage").show();
					$w("#thumbsupicon").show();
					$w("#thumbsdownicon").show();
					$w("#respinbutton").show();
					$w("#nextbutton").disable();

					setTimeout(() => {
						$w("#completetext").hide("fade", { duration: 500 });
					}, 3000);

					console.log(convertToCSV(userAnswers));
					console.log(userAnswers);
				} else {
					$w("#includeshoesradio").hide();
					$w("#shoecolorcheckbox").show();
				}
				break;

			case "shoecolor":
				if (!validateRequiredField($w("#shoecolorcheckbox"))) return;
				userAnswers.shoecolor = $w("#shoecolorcheckbox").value;
				$w("#shoecolorcheckbox").hide();
				$w("#stackheightcheckbox").show();
				break;

			case "stackheight":
				if (!validateRequiredField($w("#stackheightcheckbox"))) return;
				userAnswers.stackheight = $w("#stackheightcheckbox").value;
				$w("#stackheightcheckbox").hide();
				$w("#stabilityradio").show();
				break;

			case "stability":
				if (!validateRequiredField($w("#stabilityradio"))) return;
				userAnswers.stability = $w("#stabilityradio").value;
				$w("#stabilityradio").hide();
				$w("#shoeweightcheckbox").show();
				break;

			case "shoeweight":
				if (!validateRequiredField($w("#shoeweightcheckbox"))) return;
				userAnswers.shoeweight = $w("#shoeweightcheckbox").value;
				$w("#shoeweightcheckbox").hide();
				$w("#heeltoedropcheckbox").show();
				break;

			case "heeltoedrop":
				if (!validateRequiredField($w("#heeltoedropcheckbox"))) return;
				userAnswers.heeltoedrop = $w("#heeltoedropcheckbox").value;
				$w("#heeltoedropcheckbox").hide();
				$w("#shoepreferencescheckbox").show();
				break;

			case "shoepreferences":
				if (!validateRequiredField($w("#shoepreferencescheckbox"))) return;
				userAnswers.shoepreferences = $w("#shoepreferencescheckbox").value;
				$w("#shoepreferencescheckbox").hide();
				$w("#shoestext").hide();
				$w("#progressbar").value += 5;
				$w("#completetext").show();
				$w("#hatimage").show();
				$w("#shirtimage").show();
				$w("#pantsimage").show();
				$w("#shoesimage").show();
				$w("#thumbsupicon").show();
				$w("#thumbsdownicon").show();
				$w("#respinbutton").show();
				$w("#nextbutton").disable();

				setTimeout(() => {
					$w("#completetext").hide("fade", { duration: 500 });
				}, 3000);

				console.log(convertToCSV(userAnswers));
				console.log(userAnswers);
				break;
		}
	});
});

$w("#thumbsupicon").onClick(() => {
	$w("#thumbsupicon").hide();
	$w("#thumbsdownicon").hide();
	userAnswers.userliked = "yes";
	saveToDatabase(userAnswers);
	console.log("Thumbs up selected, data saved:", userAnswers);
});

$w("#thumbsdownicon").onClick(() => {
	$w("#thumbsupicon").hide();
	$w("#thumbsdownicon").hide();
	userAnswers.userliked = "no";
	saveToDatabase(userAnswers);
	console.log("Thumbs down selected, data saved:", userAnswers);
});
