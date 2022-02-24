import {recipes} from "./recipe.js";

console.log(recipes);
//Array
let recipesArray = Object.entries(recipes);

//F create recipe block
const create = (elm, attributes) => {
    const element = document.createElement(elm);
    for(let key in attributes) {
        element.setAttribute(key, attributes[key])
    }
    return element;
}

let img = create("div", {class: "card-img-top card-img-placeholder", alt: "card-image"});
let title = create("h2", {class: "card-title w-50 card-content-title"});