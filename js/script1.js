import {recipes} from './recipe.js';

let recipesArray = Object.entries(recipes);

//F to create element
const create = (elm, attributes) => {
    const element = document.createElement(elm);
    for (let key in attributes) {
        element.setAttribute (key, attributes[key])

    }
    return element;
}

let createCard = (recipe) => {

    //Img
    let image = create("div", {class: "card-img-top card-img-placeholder", alt: "card-image"});

    //Title
    let title = create ("h2", {class: "card-title w-50 card-content-title"})
    title.textContent = recipe[1].name;

    //Time
	let timeParent = create("div", {class: "d-flex font-weight-bold"});
	timeParent.innerHTML = "<span class='far fa-clock mt-2' style='font-size:1.5rem'></span>"
							+ "<p class='ml-2' style='font-size:1.5rem'>" + recipe[1].time + " min</p>"

    //Header 
	let headerParent = create("div", {class: "d-flex justify-content-between mt-3 px-3"});
	headerParent.appendChild(title);
	headerParent.appendChild(timeParent);

	//ingredients list
	let ingredients = create("div");

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

	//Method description
	let method = create("p", {class: "w-50"});
	method.textContent = recipe[1].description;

	//Appliance
	let appliances = create("p", {class: "sr-only appliance"});
	appliances.textContent = recipe[1].appliance;

	//Utensils
	let utensils = create("div", {class: "sr-only"});
	let eachUtensils = recipe[1].ustensils.map(function(utensil) {
		return "<p class='utensil'>" + utensil + "</p>";
	}).join("");
	utensils.innerHTML = eachUtensils;
	

	//Card body
	let cardBody = create("div", {class: "card-body d-flex justify-content-between card-content"});
	
    //Combine in card body
	cardBody.appendChild(ingredients);
	cardBody.appendChild(method);
	cardBody.appendChild(appliances);
	cardBody.appendChild(utensils);

	//Card container
	let cardContainer = create("article", {class: "card recipe-card pb-3 mb-5"});

	//Combine to DOM
	cardContainer.appendChild(image);
	cardContainer.appendChild(headerParent);
	cardContainer.appendChild(cardBody);

	let mainSection = document.getElementById("main");

	//Put into DOM
	mainSection.appendChild(cardContainer);                        
}

//Create card for each recipe
recipesArray.forEach(recipe => createCard(recipe));

//F to split
let splitString = (array) => {
    let newArray = [];
    for (let i=0; i < array.lenght; i++) {
        newArray.puch(array[i].split (""));

    }
    return newArray;
}

//Exctract all ingredients names in 1 array
let ingredientsOptions = [...new Set(recipesArray.map(a => a[1].ingredients.map(b => b.ingredient.toLowerCase())).flat())];
//Words from ingredients options
let ingredientsWords = [...new Set (splitString(ingredientsOptions).flat())];
//Words from recipe name
let recipeName = [...new Set (recipesArray.map(a => a[1].name.toLocaleLowerCase()))];
let recipeNameWords = [...new Set (splitString(recipeName).flat())];
//Words from description 
let recipeDesc = [...new Set (recipesArray.map(a => a[1].description.toLowerCase().replace(/[^\w\s+è+ç+é+ï+à+ù+û+ô+ê+î]/gi, "")))];
let recipeDescWords = splitString(recipeDesc).flat();

//All extract to the main search
let searchOptions = [...new Set (ingredientsWords.concat(recipeNameWords, recipeDescWords))];
console.log(searchOptions);

//Search main case
let searchInput = document.querySelector ("#search-input");

let launchSearch = (e) => {
	let mainSection = document.getElementById("main");
	if (searchInput.value.length > 2) {
		let input = e.target.value.toLocaleLowerCase();
		let selectedArr = [];
		mainSection.innerHTML = "";
		for (let i=0; i < recipesArray.length; i++) {
			if (recipesArray[i][1].name.toLocaleLowerCase().includes(input) ||
			    recipesArray[i][1].description.toLocaleLowerCase().includes(input) ||
			    Object.values (recipesArray[i][1].ingredients).indexOf(input) > -1) {
					selectedArr.push (recipesArray[i]);
				}
		}

		if (selectedArr.length > 0) {
			selectedArr.forEach (recipe => {
				createCard (recipe);
			})
		} else {
			mainSection.innerHTML = "<p id='noresult-msg'>Aucune recette ne correspond à votre critère... vous pouvez chercher <<tarte aux pommes>>, <<poisson>>, etc.</p>";

		}
	} else {
		mainSection.innerHTML = "";
		recipesArray.forEach (recipe => createCard (recipe));

	}
}

//Implement
searchInput.addEventListener ("keyup", function (e) {launchSearch (e)});

searchInput.addEventListener("input", (e) => {
	const value = e.target.value
	console.log(value);
})

//Tags
//F to add items on dropdown
let addItem = (array, parentElm) => {
	array.forEach (item => {
		let option = create ("li", {class: "dropdown-item"});
		option.textContent = item.charAt(0).toUppercase() + item.slice(1);
		parentElm.appendChild(option);

	})
}

//Search tag
let tagSearch = (input, option) => {
	input.addEventListener ("input", function (e) {
		for (let i=0; i < option.lenght; i++) {
			if (!option[i].textContent.toLocaleLowerCase().includes(e.taget.value.toLowerCase())) {
				option[i].style.display = "none";

			} else {
				option[i].removeAttribute ("style");
			}
		}
	})
}

//Open dropdown (click)
let openDropdown = (btn, className, parentElm, inputId, optionsArray) => {
	closeAllDropdowns(); //close other drpdwn

	let dropdownContainer = document.getElementById(parentElm);
	dropdownContainer.textContent = "";
	//Load tag
	let choices = array.from(document.querySelector (className));
	let choicesArr = [];
	choices.forEach (choice => {
		choicesArr.push (choice.textContent);
	})

	let optionsArr = [...new set (choicesArr)];

	//Launch in dpdwn option
	addItem (optionsArr, dropdownContainer);
	//Search input
	let inputField = document.getElementById("inputId");

	//Search F by keywords
	tagSearch (inputField, Array.from(document.querySelectorAll(optionsArray)));
	inputField.parentElement.classList.add("show"); //launch tag
	inputField.parentNode.parentElement.classList.add("show");
	dropdownContainer.parentElement.classList.add("show-opts");
	btn.style.display = "none";

};

//Close dropdown
let closeAllDropdowns = () => {
	Array.from (document.getElementsByClassName("tag-btn")).forEach (btn => {btn.removeAttribute ("style")});
	Array.from (document.getElementsByClassName("tag-search")).forEach (item => {item.classList.remove ("show")});
	Array.from (document.getElementsByClassName("container-tag-options")).forEach (btn => {item.classList.remove ("show-opts")});
	Array.from (document.getElementsByClassName("opened-btn-container")).forEach (btn => {item.classList.remove ("show")});
	Array.from (document.getElementsByClassName("fa-chevron-down")).forEach (btn => {item.removeAttribute ("style")});
	
}
//Implementation
//Ingredients tags
document.getElementById("ingredients-tag-btn").addEventListener("click", function (e) {openDropdown (e.target, ".ingredient", "ingredients-dropdown", "ingredients-tag-input", "#ingredients-dropdown .dropdown-item")});
//Appliances tags
document.getElementById("appliances-tag-btn").addEventListener("click", function (e) {openDropdown (e.target, "appliance", "appliances-dropdown", "appliances-tag-input", "#appliances-dropdown .appliance-item")});
//Utensils tags
document.getElementById("utensils-tag-btn").addEventListener("click", function (e) {openDropdown (e.target, "utensil", "utensils-dropdown", "utensils-tag-input", "#utensils-dropdown .dropdown-item")});

//Ingredients dropdown
tagSearch(document.getElementById("ingredients-tag-input"), Array.from(document.querySelectorAll("#ingredients-dropdown .dropdown-item")));
tagSearch(document.getElementById("appliances-tag-input"), Array.from(document.querySelectorAll("#appliances-dropdown .dropdown-item")));
tagSearch(document.getElementById("utensils-tag-input"), Array.from(document.querySelectorAll("#utensils-dropdown .dropdown-item")));

//Create tag btn
let createTag = (target) => {
	let selectedTag = create ("button", {class: "btn selected-tag-btn"});
	selectedTag.innerHTML = target.textContent + "<span
}