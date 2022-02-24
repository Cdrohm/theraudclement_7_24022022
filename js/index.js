import {recipes} from './recipe.js';

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