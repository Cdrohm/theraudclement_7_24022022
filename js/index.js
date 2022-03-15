import {
    recipes
} from './recipe.js';


let recipesArray = Object.entries(recipes);


//F create element
const create = (elm, attributes) => {
    const element = document.createElement(elm);
    for (let key in attributes) {
        element.setAttribute(key, attributes[key])
    }
    return element;
}

let createCard = (recipe) => {
    //Img
    let image = create("div", {
        class: "card-img-top card-img-placeholder",
        alt: "card-image"
    });
    //Title
    let title = create("h2", {
        class: "card-title w-50 card-content-title"
    });
    title.textContent = recipe[1].name;

    //Time
    let timeParent = create("div", {
        class: "d-flex font-weight-bold"
    });
    timeParent.innerHTML = "<span class='far fa-clock mt-2' style='font-size:1.5rem'></span>" +
        "<p class='ml-2' style='font-size:1.5rem'>" + recipe[1].time + " min</p>"

    //Card header
    let headerParent = create("div", {
        class: "d-flex justify-content-between mt-3 px-3"
    });
    headerParent.appendChild(title);
    headerParent.appendChild(timeParent);

    //Ingredients list
    let ingredients = create("div");

    let eachIngredient = recipe[1].ingredients.map(function(ingredients) {
        if (Object.prototype.hasOwnProperty.call(ingredients, "quantity") && Object.prototype.hasOwnProperty.call(ingredients, "unit")) {
            return "<p class='mb-0'><span class='font-weight-bold ingredient'>" + ingredients.ingredient + "</span>: " + ingredients.quantity + ingredients.unit + "</p>";
        } else if (Object.prototype.hasOwnProperty.call(ingredients, "quantity") && !Object.prototype.hasOwnProperty.call(ingredients, "unit")) {
            return "<p class='mb-0'><span class='font-weight-bold ingredient'>" + ingredients.ingredient + "</span>: " + ingredients.quantity + "</p>";
        } else if (!Object.prototype.hasOwnProperty.call(ingredients, "quantity") && !Object.prototype.hasOwnProperty.call(ingredients, "unit")) {
            return "<p class='mb-0'><span class='font-weight-bold ingredient'>" + ingredients.ingredient + "</span></p>";
        }
    }).join("");

    ingredients.innerHTML = eachIngredient;

    //Method
    let method = create("p", {
        class: "w-50"
    });
    method.textContent = recipe[1].description;

    //appliance
    let appliances = create("p", {
        class: "sr-only appliance"
    });
    appliances.textContent = recipe[1].appliance;
    //utensils
    let utensils = create("div", {
        class: "sr-only"
    });
    let eachUtensils = recipe[1].ustensils.map(function(utensil) {
        return "<p class='utensil'>" + utensil + "</p>";
    }).join("");
    utensils.innerHTML = eachUtensils;


    //card body
    let cardBody = create("div", {
        class: "card-body d-flex justify-content-between card-content"
    });
    //combine in card body
    cardBody.appendChild(ingredients);
    cardBody.appendChild(method);
    cardBody.appendChild(appliances);
    cardBody.appendChild(utensils);

    //card container
    let cardContainer = create("article", {
        class: "card recipe-card pb-3 mb-5"
    });

    //combine to DOM
    cardContainer.appendChild(image);
    cardContainer.appendChild(headerParent);
    cardContainer.appendChild(cardBody);

    let mainSection = document.getElementById("main");
    //put into DOM
    mainSection.appendChild(cardContainer);
}

recipesArray.forEach(recipe => createCard(recipe));
//F to split
let splitString = (array) => {
    let newArr = [];
    for (let i = 0; i < array.length; i++) {
        newArr.push(array[i].split(" "));
    }
    return newArr;
}
//extract all ingredients into array
let ingredientsOptions = [...new Set(recipesArray.map(a => a[1].ingredients.map(b => b.ingredient.toLowerCase())).flat())];
//words ingredients options
let ingredientsWords = [...new Set(splitString(ingredientsOptions).flat())];
//get list of words from recipe name 
let recipeName = [...new Set(recipesArray.map(a => a[1].name.toLowerCase()))];
let recipeNameWords = [...new Set(splitString(recipeName).flat())];
//get list of words from descriptions
let recipeDesc = [...new Set(recipesArray.map(a => a[1].description.toLowerCase().replace(/[^\w\s+è+ç+é+ï+à+ù+û+ô+ê+î]/gi, "")))];
let recipeDescWords = splitString(recipeDesc).flat();
//combine all options into one array for the main search


//Take search bar
let searchInput = document.getElementById("search-input");




//search function
let launchSearch = (e) => {
    let mainSection = document.getElementById("main");
    if (searchInput.value.length > 2) {
        let input = e.target.value.toLowerCase();
        let selectedArr = [];
        mainSection.innerHTML = "";
        for (let i = 0; i < recipesArray.length; i++) {
            if (recipesArray[i][1].name.toLowerCase().includes(input) ||
                recipesArray[i][1].description.toLowerCase().includes(input) ||
                Object.values(recipesArray[i][1].ingredients).indexOf(input) > -1) {
                selectedArr.push(recipesArray[i]);
            }
        }
        if (selectedArr.length > 0) {
            selectedArr.forEach(recipe => {
                createCard(recipe);
            })
        } else {
            mainSection.innerHTML = "<p id='noresult-msg'>Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.</p>";
        }
    } else {
        mainSection.innerHTML = "";
        recipesArray.forEach(recipe => createCard(recipe));
    }
}
//implement on the main search bar
searchInput.addEventListener("keyup", function(e) {
    launchSearch(e)
});

//tag filter
//F to add items for dropdown options
let addItem = (array, parentElm) => {
    array.forEach(item => {
        let option = create("li", {
            class: "dropdown-item"
        });
        option.textContent = item.charAt(0).toUpperCase() + item.slice(1);
        parentElm.appendChild(option);
    })
}
//search function on tag button
let tagSearch = (input, options) => {
    input.addEventListener("input", function(e) {
        for (let i = 0; i < options.length; i++) {
            if (!options[i].textContent.toLowerCase().includes(e.target.value.toLowerCase())) {
                options[i].style.display = "none";
            } else {
                options[i].removeAttribute("style");
            }
        }
    })
}

let openDropdown = (btn, className, parentElm, inputId, optionsArray) => {
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
//implement the function
//ingredient tag
document.getElementById("ingredients-tag-btn").addEventListener("click", function(e) {
    openDropdown(e.target, ".ingredient", "ingredients-dropdown", "ingredients-tag-input", "#ingredients-dropdown .dropdown-item")
});
//appliances tag
document.getElementById("appliances-tag-btn").addEventListener("click", function(e) {
    openDropdown(e.target, ".appliance", "appliances-dropdown", "appliances-tag-input", "#appliances-dropdown .dropdown-item")
});
//utensils tag
document.getElementById("utensils-tag-btn").addEventListener("click", function(e) {
    openDropdown(e.target, ".utensil", "utensils-dropdown", "utensils-tag-input", "#utensils-dropdown .dropdown-item")
});

//ingredients dropdown
tagSearch(document.getElementById("ingredients-tag-input"), Array.from(document.querySelectorAll("#ingredients-dropdown .dropdown-item")));
tagSearch(document.getElementById("appliances-tag-input"), Array.from(document.querySelectorAll("#appliances-dropdown .dropdown-item")));
tagSearch(document.getElementById("utensils-tag-input"), Array.from(document.querySelectorAll("#utensils-dropdown .dropdown-item")));
//create selected tag button
let createTag = (target) => {
    let selectedTag = create("button", {
        class: "btn selected-tag-btn"
    });
    selectedTag.innerHTML = target.textContent + "<span class='far fa-times-circle ml-2'></i>";
    let computedStyle = getComputedStyle(target.parentNode.parentElement);
    selectedTag.style.backgroundColor = computedStyle.getPropertyValue("background-color");
    //put to DOM
    document.getElementById("selected-tags").appendChild(selectedTag);
}
//F to filter by tag
let filterByTag = (tag) => {
    let recipeCards = Array.from(document.getElementsByClassName("recipe-card"));
    let input = tag.textContent.toLowerCase();
    for (let i = 0; i < recipeCards.length; i++) {
        if (!recipeCards[i].hasAttribute("style")) {
            if (!recipeCards[i].innerHTML.toLowerCase().includes(input)) {
                recipeCards[i].style.display = "none";
            } else {
                recipeCards[i].removeAttribute("style");
            }
        }
    }
}
//F to unfilter
let unfilterTag = (tag) => {
    let recipeCards = Array.from(document.getElementsByClassName("recipe-card"));
    let input = tag.textContent.toLowerCase();
    for (let i = 0; i < recipeCards.length; i++) {
        if (recipeCards[i].hasAttribute("style") && !recipeCards[i].innerHTML.toLowerCase().includes(input)) {
            recipeCards[i].removeAttribute("style");
        }
    }
}
//F when user click on a tag
document.addEventListener("click", function(e) {
    if (e.target.matches(".dropdown-item")) { //selecting tag filter
        createTag(e.target);
        filterByTag(e.target);
        closeAllDropdowns();
    } else if (e.target.matches(".fa-times-circle")) { //delete the selected tag
        document.getElementById("selected-tags").removeChild(e.target.parentElement);
        unfilterTag(e.target.parentElement);
    } else if (e.target.matches(".tag-search-input")) { //prevent event bubble from clicking on input field
        e.stopPropagation();
        e.preventDefault();
    } else if (e.target.matches(".fa-chevron-down")) { //prevent event bubble from clicking on down arrow
        e.target.parentElement.click();
    } else if (!e.target.matches(".tag-btn")) { //close dropdowns when click wherever
        closeAllDropdowns();
    }
})

//F to close all dropdowns
let closeAllDropdowns = () => {
    Array.from(document.getElementsByClassName("tag-btn")).forEach(btn => {
        btn.removeAttribute("style")
    });
    Array.from(document.getElementsByClassName("tag-search")).forEach(item => {
        item.classList.remove("show")
    });
    Array.from(document.getElementsByClassName("container-tag-options")).forEach(item => {
        item.classList.remove("show-opts")
    });
    Array.from(document.getElementsByClassName("opened-btn-container")).forEach(item => {
        item.classList.remove("show")
    });
    Array.from(document.getElementsByClassName("fa-chevron-down")).forEach(item => {
        item.removeAttribute("style")
    });
}
//close by click on arrow up
Array.from(document.getElementsByClassName("fa-chevron-up")).forEach(item => {
    item.addEventListener("click", function() {
        closeAllDropdowns();
    });
})