import { validateRequiredField, displayWatches } from "public/helpers/helperFunctions";
import { getTopThreeWatches } from "public/watch_recommend";

export function watchFlow(currentStep, userAnswers) {
	switch (currentStep) {
		case "distance":
			if (!validateRequiredField($w("#primarygoalradio"))) return;
			userAnswers.distance = $w("#primarygoalradio").value;
			$w("#primarygoalradio").hide();
			$w("#progressbar").value += 5;
			$w("#budgetradio").show();
			break;

		case "price":
			if (!validateRequiredField($w("#budgetradio"))) return;
			userAnswers.price = $w("#budgetradio").value;
			$w("#budgetradio").hide();
			$w("#progressbar").value += 5;
			$w("#smartwatchradio").show();
			break;

		case "smartwatch":
			if (!validateRequiredField($w("#smartwatchradio"))) return;
			userAnswers.smartwatch = $w("#smartwatchradio").value;
			$w("#smartwatchradio").hide();
			$w("#progressbar").value += 5;
			$w("#batteryradio").show();
			break;

		case "battery":
			if (!validateRequiredField($w("#batteryradio"))) return;
			userAnswers.battery = $w("#batteryradio").value;
			$w("#batteryradio").hide();
			$w("#progressbar").value += 5;
			$w("#styleradio").show();
			break;

		case "style":
			if (!validateRequiredField($w("#styleradio"))) return;
			userAnswers.style = $w("#styleradio").value;
			$w("#styleradio").disable();
			$w("#nextbutton").disable();
			$w("#watchesforyousection").expand();
			$w("#headersection").expand();
			$w("#productimagesection").expand();
			$w("#watchtitlesection").expand();
			$w("#amazonbuttonssection").expand();

			getTopThreeWatches(userAnswers).then((topThreeWatches) => {
				displayWatches(topThreeWatches[0], topThreeWatches[1], topThreeWatches[2]);
			});

			$w("#watch1").show();
			$w("#watch2").show();
			$w("#watch3").show();

			$w("#watchquizsection").collapse();
			$w("#progresssection").collapse();
			break;
	}
}
