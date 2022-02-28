import {recipes} from "./recipe.js";
console.log(recipes);

//Array
let recipesArray = Object.entries(recipes);

//F create recipe block for card
const create = (elm, attributes) => {
    const element = document.createElement(elm);
    for(let key in attributes) {
        element.setAttribute(key, attributes[key])
    }
    return element;
}

//Create Card
let createCard = (recipes) => {
    let image = create("div", {class: "card-img-top card-img-placeholder", alt: "card-image"});
    let title = create("h2", {class: "card-title w-50 card-content-title"});
        title.textContent = recipes[1].name;
        //console.log(title);
    let timeParent = create("div", {class: "d-flex font-weight-bold"});
        timeParent.innerHTML = "<span class= 'far fa-clock mt-2' style='font-size: 1.5rem'></span>"
                        + "<p class= 'ml-2' style='font-size: 1.5rem'>" + recipes[1].time + "min </p>"
    //console.log(timeParent);

        //Card Header
        let headerParent = create("div", {class: "d-flex justify-content-between mt-3 px-3"});
        headerParent.appendChild(title);
        headerParent.appendChild(timeParent);

        //Card Ingredients
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

        //Cook instructions
        let instructions = create("div", {class: "description w-50"});
        instructions.textContent = recipes[1].description;

        //Device
        let appliances = create("p", {class: "sr-only device"});
        appliances.textContent = recipes[1].appliance;

        //Utensils
        let utensils = create("div", {class: "sr-only"});
        let eachUtensils = recipes[1].ustensils.map(function(utensil) {
            return "<p class= 'utensil'>" + utensil + "</p>";
        }).join("");

        utensils.innerHTML = eachUtensils;

        //Card body
        let cardBody = create("div", {class: "card-body d-flex justify-content-between card-content"});
	
        //combine in card body
	    cardBody.appendChild(ingredients);
        cardBody.appendChild(method);
        cardBody.appendChild(appliances);
        cardBody.appendChild(utensils);

        //card container
        let cardContainer = create("article", {class: "card recipe-card pb-3 mb-5"});

        //to DOM
        cardContainer.appendChild(image);
        cardContainer.appendChild(headerParent);
        cardContainer.appendChild(cardBody);

        let mainSection = document.getElementById("main");

        //into DOM
        mainSection.appendChild(cardContainer);
    }