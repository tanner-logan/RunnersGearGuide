import { getCurrentWatchStep } from "public/helpers/helperFunctions";
import { watchFlow } from "public/flows/watch_flow";

// Global object to store user's answers
let userAnswers = {
	distance: "none",
	price: "none",
	smartwatch: "none",
	battery: "none",
	style: "none",
};

// Initialize event listeners
$w.onReady(function () {
	// Progress bar initialization
	$w("#progressbar").value = 0;

	$w("#startbutton").onClick((event) => {
		$w("#watchquizsection").expand();
		$w("#progresssection").expand();
		$w("#flowselectionsection").collapse();
	});

	// Next button click handler
	$w("#nextbutton").onClick((event) => {
		const currentStep = getCurrentWatchStep();

		if (!currentStep) {
			console.log("No current step found"); // Add this line for debugging
			return;
		}

		watchFlow(currentStep, userAnswers);
	});
});
