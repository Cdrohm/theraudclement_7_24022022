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
let splitSptring = (array) => {
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
let recipeDescWords = splitSptring(recipeDesc).flat();

//All extract to the main search
let searchOptions = [...new Set (ingredientsWords.concat(recipeNameWords, recipeDescWords))];
console.log(searchOptions);