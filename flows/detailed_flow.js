import { validateRequiredField, fetchTopRecommendations, displayOutfit, getCurrentStep } from "public/helpers/helperFunctions";

export function detailedFlow(currentStep, userAnswers, hatAnswers, topAnswers, bottomAnswers, shoeAnswers, outfit1UserDecided, outfit2UserDecided, outfit3UserDecided, simpleFlow) {
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
			$w("#topsleevescheckbox").show();
			break;

		case "top_sleeves":
			if (!validateRequiredField($w("#topsleevescheckbox"))) return;
			[userAnswers, topAnswers].forEach((answers) => {
				answers.top_sleeves = $w("#topsleevescheckbox").value;
			});
			$w("#topsleevescheckbox").hide();
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
				fetchTopRecommendations(userAnswers, hatAnswers, topAnswers, bottomAnswers, shoeAnswers, outfit1UserDecided, outfit2UserDecided, outfit3UserDecided, displayOutfit, simpleFlow);

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
			fetchTopRecommendations(userAnswers, hatAnswers, topAnswers, bottomAnswers, shoeAnswers, outfit1UserDecided, outfit2UserDecided, outfit3UserDecided, displayOutfit, simpleFlow);

			$w("#surveryheadersection").collapse();
			$w("#surveysection").collapse();
			$w("#progresssection").collapse();
			break;
	}
}
