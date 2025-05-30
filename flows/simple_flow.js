import { validateRequiredField, fetchTopRecommendations, displayOutfit } from "public/helpers/helperFunctions";

export function simpleFlow(userAnswers, hatAnswers, topAnswers, bottomAnswers, shoeAnswers, outfit1UserDecided, outfit2UserDecided, outfit3UserDecided, simpleFlow) {
	if (!validateRequiredField($w("#simplegenderradio"))) return;
	if (!validateRequiredField($w("#simpleweathercheckbox"))) return;
	if (!validateRequiredField($w("#simpleincludeditemscheckbox"))) return;

	[userAnswers, hatAnswers, topAnswers, bottomAnswers, shoeAnswers].forEach((answers) => {
		answers.gender = $w("#simplegenderradio").value;
	});

	[userAnswers, hatAnswers, topAnswers, bottomAnswers].forEach((answers) => {
		answers.weather = $w("#simpleweathercheckbox").value;
	});

	userAnswers.includehat = $w("#simpleincludeditemscheckbox").value.includes("hat") ? "yes" : "no";
	userAnswers.includetop = $w("#simpleincludeditemscheckbox").value.includes("top") ? "yes" : "no";
	userAnswers.includebottom = $w("#simpleincludeditemscheckbox").value.includes("bottoms") ? "yes" : "no";
	userAnswers.includeshoes = $w("#simpleincludeditemscheckbox").value.includes("shoes") ? "yes" : "no";

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
	$w("#simplesurvey").collapse();
	$w("#progresssection").collapse();
}
