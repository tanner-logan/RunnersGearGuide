export function convertToCSV(obj) {
	const keys = Object.keys(obj);
	const values = Object.values(obj).map((value) => {
		if (Array.isArray(value)) {
			return value.join(",");
		}
		return value;
	});
	const csv = keys.join(",") + "\n" + values.join(",");
	return csv;
}

// Function to validate required fields before proceeding
export function validateRequiredField(element) {
	const requiredFieldError = $w("#requiredfielderror");
	if (!element || !element.value) {
		requiredFieldError.show();
		return false;
	}

	// For radio buttons and checkboxes, check if any option is selected
	if (Array.isArray(element.value) && element.value.length === 0) {
		requiredFieldError.show();
		return false;
	}

	requiredFieldError.hide();
	return true;
}

// Helper function to determine current step
export function getCurrentStep() {
	const visibleElements = [
		{ id: "#weathercheckbox", step: "weather" },
		{ id: "#genderradio", step: "gender" },
		{ id: "#distancecheckbox", step: "distance" },
		{ id: "#terraincheckbox", step: "terrain" },
		{ id: "#budgetcheckbox", step: "budget" },
		{ id: "#allergiescheckbox", step: "allergies" },
		{ id: "#ecofriendlyradio", step: "ecofriendly" },
		{ id: "#designpreferencecheckbox", step: "designpreference" },
		{ id: "#heavysweaterradio", step: "heavysweater" },
		{ id: "#brandcheckbox", step: "brand" },
		{ id: "#includehatradio", step: "includehat" },
		{ id: "#hatcolorcheckbox", step: "hatcolor" },
		{ id: "#hatfeaturescheckbox", step: "hatfeatures" },
		{ id: "#includetopradio", step: "includetop" },
		{ id: "#topcolorcheckbox", step: "topcolor" },
		{ id: "#topfitcheckbox", step: "topfit" },
		{ id: "#topfeaturescheckbox", step: "topfeatures" },
		{ id: "#shortlongsleevesradio", step: "shortlongsleeves" },
		{ id: "#includebottomradio", step: "includebottom" },
		{ id: "#bottomcolorcheckbox", step: "bottomcolor" },
		{ id: "#pocketsradio", step: "pockets" },
		{ id: "#typebottomscheckbox", step: "typebottoms" },
		{ id: "#linerradio", step: "liner" },
		{ id: "#inseamradio", step: "inseam" },
		{ id: "#thermalsradio", step: "thermals" },
		{ id: "#highwaistedradio", step: "highwaisted" },
		{ id: "#includeshoesradio", step: "includeshoes" },
		{ id: "#shoecolorcheckbox", step: "shoecolor" },
		{ id: "#stackheightcheckbox", step: "stackheight" },
		{ id: "#stabilityradio", step: "stability" },
		{ id: "#shoeweightcheckbox", step: "shoeweight" },
		{ id: "#heeltoedropcheckbox", step: "heeltoedrop" },
		{ id: "#shoepreferencescheckbox", step: "shoepreferences" },
	];

	try {
		const visibleElement = visibleElements.find((el) => {
			return $w(el.id) && $w(el.id).isVisible;
		});
		return visibleElement ? visibleElement.step : null;
	} catch (error) {
		console.error("Error in getCurrentStep:", error);
		return null;
	}
}
