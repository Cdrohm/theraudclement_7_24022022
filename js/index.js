import {recipes} from './recipe.js';

let recipesArray = Object.entries(recipes);

//console.log(recipesArray);

//f Create element
const create = (elm, attributes) => {
	const element = document.createElement(elm);
	for (let key in attributes) {
		element.setAttribute(key, attributes[key])
	}
	return element;
}

let createCard = (recipe) => {
	
    //Image
	let image = create("div", {class: "card-img-top card-img-placeholder", alt: "card-image"});
	
    //Title
	let title = create("h2", {class: "card-title w-50 card-content-title"});
	title.textContent = recipe[1].name;

	let timeParent = create("div", {class: "d-flex font-weight-bold"});
	timeParent.innerHTML = "<span class='far fa-clock mt-2' style='font-size:1.5rem'></span>"
							+ "<p class='ml-2' style='font-size:1.5rem'>" + recipe[1].time + " min</p>"

	//Header elements
	let headerParent = create("div", {class: "d-flex justify-content-between mt-3 px-3"});
	headerParent.appendChild(title);
	headerParent.appendChild(timeParent);

	//Ingredients list
	let ingredients = create("div", {class: "ingredient-container"});

	let eachIngredient = recipe[1].ingredients.map(function(ingredients) {
		if (Object.prototype.hasOwnProperty.call(ingredients, "quantity") && Object.prototype.hasOwnProperty.call(ingredients, "unit")) {
			return "<p class='mb-0'><span class='font-weight-bold ingredient'>" + ingredients.ingredient + "</span>: "+ ingredients.quantity + ingredients.unit + "</p>";
		} else if (Object.prototype.hasOwnProperty.call(ingredients, "quantity") && !Object.prototype.hasOwnProperty.call(ingredients, "unit")) {
			return "<p class='mb-0'><span class='font-weight-bold ingredient'>" + ingredients.ingredient + "</span>: "+ ingredients.quantity + "</p>";
		} else if (!Object.prototype.hasOwnProperty.call(ingredients, "quantity") && !Object.prototype.hasOwnProperty.call(ingredients, "unit")) {
			return "<p class='mb-0'><span class='font-weight-bold ingredient'>" + ingredients.ingredient + "</span></p>";
		}
	}).join("");

	ingredients.innerHTML = eachIngredient;

	//cook instruction / method
	let method = create("p", {class: "description w-50"});
	method.textContent = recipe[1].description;

	//Device section
	let appliances = create("p", {class: "sr-only appliance"});
	appliances.textContent = recipe[1].appliance;
	//utensils section
	let utensils = create("div", {class: "sr-only"});
	let eachUtensils = recipe[1].ustensils.map(function(utensil) {
		return "<p class='utensil'>" + utensil + "</p>";
	}).join("");
	utensils.innerHTML = eachUtensils;
	

	//Card body
	let cardBody = create("div", {class: "card-body d-flex justify-content-between card-content"});
	
    //Put in card body
	cardBody.appendChild(ingredients);
	cardBody.appendChild(method);
	cardBody.appendChild(appliances);
	cardBody.appendChild(utensils);

	//Card container
	let cardContainer = create("article", {class: "card recipe-card pb-3 mb-5"});

	//to DOM
	cardContainer.appendChild(image);
	cardContainer.appendChild(headerParent);
	cardContainer.appendChild(cardBody);

    //declare main
	let mainSection = document.getElementById("main");

	//Put
	mainSection.appendChild(cardContainer);
}

recipesArray.forEach(recipe => createCard(recipe));

//Tags
//Add items for dropdown options
let addItem = (array, parentElm) => {
	array.forEach(item => {
		let option = create("li", {class: "dropdown-item"});
		option.textContent = item.charAt(0).toUpperCase() + item.slice(1);
		parentElm.appendChild(option);
	})
}

//Search on tag buttons
let tagSearch = (input, options) => {
	input.addEventListener("input", function(e) {
		for (let i=0; i<options.length; i++) {
			if (!options[i].textContent.toLowerCase().includes(e.target.value.toLowerCase())) {
				options[i].style.display = "none";
			} else {
				options[i].removeAttribute("style");
			}
		}
	})
}

//Dropdown filters

//Open dropdown
let openDropdown = (btn, className, parentElm, inputId, optionsArray) => {
console.log ("test");
	//close other open dropdowns, if any
	closeAllDropdowns();

	//current dropdown DOM
	let dropdownContainer = document.getElementById(parentElm);

	//empty current dropdown
	dropdownContainer.textContent = "";

	//take available tag options from DOM
	let choices = Array.from(document.querySelectorAll(className));
	let choicesArr = [];
	choices.forEach(choice => {
		choicesArr.push(choice.textContent);
	})
	let optionsArr = [...new Set(choicesArr)];

	//put into dropdown options
	addItem(optionsArr, dropdownContainer);

	//search input DOM
	let inputField = document.getElementById(inputId);

	//run keyword search function
	tagSearch(inputField, Array.from(document.querySelectorAll(optionsArray)));
	inputField.parentElement.classList.add("show");
	inputField.parentNode.parentElement.classList.add("show");
	dropdownContainer.parentElement.classList.add("show-opts");
	btn.style.display = "none";
};

//Close Dropdown
let closeAllDropdowns = () => {
	Array.from(document.getElementsByClassName("tag-btn")).forEach(btn => {btn.removeAttribute("style")});
	Array.from(document.getElementsByClassName("tag-search")).forEach(item => {item.classList.remove("show")});
	Array.from(document.getElementsByClassName("container-tag-options")).forEach(item => {item.classList.remove("show-opts")});
	Array.from(document.getElementsByClassName("opened-btn-container")).forEach(item => {item.classList.remove("show")});
	Array.from(document.getElementsByClassName("fa-chevron-down")).forEach(item => {item.removeAttribute("style")});
}

//Dropdown close on click icon
Array.from(document.getElementsByClassName("fa-chevron-up")).forEach(item => {
	item.addEventListener("click", function() {
		closeAllDropdowns();
	});
});

//Ingredient tag
document.getElementById("ingredients-tag-btn").addEventListener("click", function(e) {openDropdown(e.target, ".ingredient", "ingredients-dropdown", "ingredients-tag-input", "#ingredients-dropdown .dropdown-item")});
//Appliances tag
document.getElementById("appliances-tag-btn").addEventListener("click", function(e) {openDropdown(e.target, ".appliance", "appliances-dropdown", "appliances-tag-input", "#appliances-dropdown .dropdown-item")});
//Utensils tag
document.getElementById("utensils-tag-btn").addEventListener("click", function(e) {openDropdown(e.target, ".utensil", "utensils-dropdown", "utensils-tag-input", "#utensils-dropdown .dropdown-item")});

//Ingredients dropdown
tagSearch(document.getElementById("appliances-tag-input"), Array.from(document.querySelectorAll("#ingradients-dropdown .dropdown-item")));
tagSearch(document.getElementById("appliances-tag-input"), Array.from(document.querySelectorAll("#appliances-dropdown .dropdown-item")));
tagSearch(document.getElementById("utensils-tag-input"), Array.from(document.querySelectorAll("#utensils-dropdown .dropdown-item")));


//SEARCH algo 1

//F to extract and sort keywords
//Sorting F | if more elements left + more elements right
let quickSort = (array, left, right) => {
	let index;
	if (array.length > 1) {
		index = partition (array, left, right);
		if (left < index-1) {
			quickSort (array, left, index-1);
		}
		if (index < right) {
			quickSort (array, index, right);
		}
	}
	return array;
}

//Left + right elements list
let partition = (array, left, right) => {
	//
	let pivot = array[Math.floor((right + left) / 2)];
}