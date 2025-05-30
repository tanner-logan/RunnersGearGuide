import wixData from "wix-data";
import { getTopThreeHats } from "public/hat_recommend";
import { getTopThreeTops } from "public/top_recommend";
import { getTopThreeBottoms } from "public/bottom_recommend";
import { getTopThreeShoes } from "public/shoe_recommend";

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
		{ id: "#topsleevescheckbox", step: "top_sleeves" },
		{ id: "#toplengthcheckbox", step: "top_length" },
		{ id: "#toppreferencecheckbox", step: "top_preference" },
		{ id: "#includebottomradio", step: "includebottom" },
		{ id: "#bottomcolorcheckbox", step: "bottomcolor" },
		{ id: "#typebottomscheckbox", step: "typebottoms" },
		{ id: "#inseamcheckbox", step: "inseam" },
		{ id: "#bottompreferencecheckbox", step: "bottom_preference" },
		{ id: "#includeshoesradio", step: "includeshoes" },
		{ id: "#shoecolorcheckbox", step: "shoecolor" },
		{ id: "#stackheightcheckbox", step: "stackheight" },
		{ id: "#stabilityradio", step: "stability" },
		{ id: "#shoeweightcheckbox", step: "shoeweight" },
		{ id: "#heeltoedropcheckbox", step: "heeltoedrop" },
		{ id: "#shoepreferencescheckbox", step: "shoe_preference" },
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

export function getCurrentWatchStep() {
	const visibleElements = [
		{ id: "#primarygoalradio", step: "distance" },
		{ id: "#budgetradio", step: "price" },
		{ id: "#smartwatchradio", step: "smartwatch" },
		{ id: "#batteryradio", step: "battery" },
		{ id: "#styleradio", step: "style" },
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

export function getRandomItems(items, count) {
	const shuffled = [...items].sort(() => 0.5 - Math.random()); // Shuffle the array
	return shuffled.slice(0, count); // Return the first `count` items
}

export async function fetchTopRecommendations(userAnswers, hatAnswers, topAnswers, bottomAnswers, shoeAnswers, outfit1UserDecided, outfit2UserDecided, outfit3UserDecided, displayOutfit, simpleFlow) {
	try {
		// Fetch top recommendations for each category
		const [hatIds, topIds, bottomIds, shoeIds] = await Promise.all([getTopThreeHats(hatAnswers, simpleFlow), getTopThreeTops(topAnswers, simpleFlow), getTopThreeBottoms(bottomAnswers, simpleFlow), getTopThreeShoes(shoeAnswers, simpleFlow)]);

		// Update userAnswers with the fetched IDs
		userAnswers.hatids = hatIds;
		userAnswers.topids = topIds;
		userAnswers.bottomids = bottomIds;
		userAnswers.shoeids = shoeIds;

		// Ensure data is fully updated before calling displayOutfit
		if (userAnswers.hatids.length > 0 && userAnswers.topids.length > 0 && userAnswers.bottomids.length > 0 && userAnswers.shoeids.length > 0) {
			displayOutfit(0, userAnswers, outfit1UserDecided, outfit2UserDecided, outfit3UserDecided);
		} else {
			console.error("Error: One or more categories are empty in userAnswers.");
		}
	} catch (error) {
		console.error("Error fetching top recommendations:", error);
	}
}

export async function displayWatches(watch1, watch2, watch3) {
	const watch_1 = await wixData.query("watches").eq("watchid", watch1.watchid).find();
	$w("#watch1").src = watch_1.items[0].image; // Set the image URL
	$w("#watch1").link = watch_1.items[0].link; // Set the link URL
	$w("#watch1").tooltip = watch_1.items[0].description;
	$w("#watch1").show();
	$w("#watch1text").text = watch_1.items[0].product_name; // Set the product name
	$w("#watch1amazonbutton").link = watch_1.items[0].link; // Set the Amazon link

	const watch_2 = await wixData.query("watches").eq("watchid", watch2.watchid).find();
	$w("#watch2").src = watch_2.items[0].image; // Set the image URL
	$w("#watch2").link = watch_2.items[0].link; // Set the link URL
	$w("#watch2").tooltip = watch_2.items[0].description;
	$w("#watch2").show();
	$w("#watch2text").text = watch_2.items[0].product_name; // Set the product name
	$w("#watch2amazonbutton").link = watch_2.items[0].link; // Set the Amazon link

	const watch_3 = await wixData.query("watches").eq("watchid", watch3.watchid).find();
	$w("#watch3").src = watch_3.items[0].image; // Set the image URL
	$w("#watch3").link = watch_3.items[0].link; // Set the link URL
	$w("#watch3").tooltip = watch_3.items[0].description;
	$w("#watch3").show();
	$w("#watch3text").text = watch_3.items[0].product_name; // Set the product name
	$w("#watch3amazonbutton").link = watch_3.items[0].link; // Set the Amazon link
}

export async function displayOutfit(outfitIndex, userAnswers, outfit1UserDecided, outfit2UserDecided, outfit3UserDecided) {
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
