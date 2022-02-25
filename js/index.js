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
    }