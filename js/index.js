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
    title.textContent = recipes[1].name;
let time = create("div", {class: "d-flex font-weight-bold"});
    time.innerHTML = "<span class= 'far fa-clock mt-2' style='font-size: 1.5rem'></span>"