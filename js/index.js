import {recipes} from './recipe.js';

let recipesArray = Object.entries(recipes);

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
    let image = create("div", {
        class: "card-img-top card-img-placeholder",
        alt: "card-image"
    });

    //Title
    let title = create("h2", {
        class: "card-title w-50 card-content-title"
    });
    title.textContent = recipe[1].name;

    let timeParent = create("div", {
        class: "d-flex font-weight-bold"
    });
    timeParent.innerHTML = "<span class='far fa-clock mt-2' style='font-size:1.5rem'></span>" +
        "<p class='ml-2' style='font-size:1.5rem'>" + recipe[1].time + " min</p>"

    //Header elements
    let headerParent = create("div", {
        class: "d-flex justify-content-between mt-3 px-3"
    });
    headerParent.appendChild(title);
    headerParent.appendChild(timeParent);

    //Ingredients list
    let ingredients = create("div", {
        class: "ingredient-container"
    });

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

    //cook instruction / method
    let method = create("p", {
        class: "description w-50"
    });
    method.textContent = recipe[1].description;

    //Device section
    let appliances = create("p", {
        class: "sr-only appliance"
    });
    appliances.textContent = recipe[1].appliance;
    //utensils section
    let utensils = create("div", {
        class: "sr-only"
    });
    let eachUtensils = recipe[1].ustensils.map(function(utensil) {
        return "<p class='utensil'>" + utensil + "</p>";
    }).join("");
    utensils.innerHTML = eachUtensils;


    //Card body
    let cardBody = create("div", {
        class: "card-body d-flex justify-content-between card-content"
    });

    //Put in card body
    cardBody.appendChild(ingredients);
    cardBody.appendChild(method);
    cardBody.appendChild(appliances);
    cardBody.appendChild(utensils);

    //Card container
    let cardContainer = create("article", {
        class: "card recipe-card pb-3 mb-5"
    });

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
//Create selected tag button
let createTag = (target) => {
    let selectedTag = create("button", {
        class: "btn selected-tag-btn"
    });
    selectedTag.innerHTML = target.textContent + "<span class='far fa-times-circle ml-2'></i>";
    let computedStyle = getComputedStyle(target.parentNode.parentElement);
    selectedTag.style.backgroundColor = computedStyle.getPropertyValue("background-color");
    //Put to DOM
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

//F when user click on a tag option
document.addEventListener("click", function(e) {
    if (e.target.matches(".dropdown-item")) { //selecting tag filter
        createTag(e.target);
        filterByTag(e.target);
        closeAllDropdowns();
    } else if (e.target.matches(".fa-times-circle")) { //delete the selected tag by click close icon
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

//Add items for dropdown options
let addItem = (array, parentElm) => {
    array.forEach(item => {
        let option = create("li", {
            class: "dropdown-item"
        });
        option.textContent = item.charAt(0).toUpperCase() + item.slice(1);
        parentElm.appendChild(option);
    })
}

//Search on tag buttons
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


//Open dropdown
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

//Close Dropdown
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

//Dropdown close on click icon
Array.from(document.getElementsByClassName("fa-chevron-up")).forEach(item => {
    item.addEventListener("click", function() {
        closeAllDropdowns();
    });
});

//Ingredient tag
document.getElementById("ingredients-tag-btn").addEventListener("click", function(e) {
    openDropdown(e.target, ".ingredient", "ingredients-dropdown", "ingredients-tag-input", "#ingredients-dropdown .dropdown-item")
});
//Appliances tag
document.getElementById("appliances-tag-btn").addEventListener("click", function(e) {
    openDropdown(e.target, ".appliance", "appliances-dropdown", "appliances-tag-input", "#appliances-dropdown .dropdown-item")
});
//Utensils tag
document.getElementById("utensils-tag-btn").addEventListener("click", function(e) {
    openDropdown(e.target, ".utensil", "utensils-dropdown", "utensils-tag-input", "#utensils-dropdown .dropdown-item")
});

//Ingredients dropdown
tagSearch(document.getElementById("appliances-tag-input"), Array.from(document.querySelectorAll("#ingradients-dropdown .dropdown-item")));
tagSearch(document.getElementById("appliances-tag-input"), Array.from(document.querySelectorAll("#appliances-dropdown .dropdown-item")));
tagSearch(document.getElementById("utensils-tag-input"), Array.from(document.querySelectorAll("#utensils-dropdown .dropdown-item")));



//Search algo
//F to extract and sort all keywords
//sorting functions
let quickSort = (array, left, right) => {
    let index;
    if (array.length > 1) {
        index = partition(array, left, right); //take index from partition
        if (left < index - 1) { //more elements on the left
            quickSort(array, left, index - 1);
        }
        if (index < right) { //more elements on the right
            quickSort(array, index, right);
        }
    }
    return array;
}

//Partition code, to make a left and right elements list
let partition = (array, left, right) => {
    let pivot = array[Math.floor((right + left) / 2)]; //middle element

    while (left <= right) {
        while (array[left].localeCompare(pivot) < 0) {
            left++;
        }
        while (array[right].localeCompare(pivot) > 0) {
            right--;
        }
        if (left <= right) {
            swap(array, left, right);
            left++;
            right--;
        }
    }
    return left;
}

//F to swap position
let swap = (items, leftIndex, rightIndex) => {
    var temp = items[leftIndex];
    items[leftIndex] = items[rightIndex];
    items[rightIndex] = temp;
}

//Filter and extract only id, name, ingredients, and description
let createFilteredArr = (arr) => {
    let filteredArr = [];
    for (let i = 0; i < arr.length; i++) {
        let filtered = (({
            id,
            ingredients,
            name,
            description
        }) => ({
            id,
            ingredients,
            name,
            description
        }))(arr[i][1]);
        filteredArr.push(filtered);
    }
    return filteredArr;
}
let filteredArr = createFilteredArr(recipesArray);

function FilterKeyword(item) {
    this.id = item.id;
    let thisIngre = item.ingredients.map(b => b.ingredient.toLowerCase()).flat();
    let keywordString = item.name + " " + thisIngre + " " + item.description;
    let uniqueValue = [...new Set(keywordString.split(/[\s,().]+/))];
    this.keyword = quickSort(uniqueValue, 0, uniqueValue.length - 1);
}

let extractKeyword = (arr) => {
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
        let keyword = new FilterKeyword(arr[i]);
        newArr.push(keyword);
    }
    return newArr;
}
let filteredKeywordArr = extractKeyword(filteredArr);


//Take only the keywords
let allKeywords = [];
filteredKeywordArr.forEach(item => {
    allKeywords.push(item.keyword)
});
let flatKeyword = allKeywords.flat();
let allKeywordsLowerCase = [];
flatKeyword.forEach(word => {
    allKeywordsLowerCase.push(word.toLowerCase())
});
let searchOptionsNotSorted = [...new Set(allKeywordsLowerCase.flat())];

//Sort by alphabetical order
let searchOptions = quickSort(searchOptionsNotSorted, 0, searchOptionsNotSorted.length - 1);


function KeywordObject(item) {
    this.keyword = item;
    let recipeIds = [];
    for (let i = 0; i < filteredKeywordArr.length; i++) {
        if (filteredKeywordArr[i].keyword.indexOf(item) >= 0) {
            recipeIds.push(filteredKeywordArr[i].id);
        }
    }
    this.ids = recipeIds;
}

let keywordArray = (arr) => {
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
        let keyword = new KeywordObject(arr[i]);
        newArr.push(keyword);
    }
    return newArr;
}

let keywordObjectArray = keywordArray(searchOptions);

//Search binary for 1st result
let binarySearch = (array, target) => {
    let start = 0;
    let end = array.length - 1;
    if (start > end) {
        return -1;
    }
    while (start <= end) {
        let middleIndex = Math.floor((start + end) / 2);
        if (array[middleIndex].keyword.toLowerCase().includes(target.toLowerCase())) {
            return middleIndex;
        } else if (target.toLowerCase().localeCompare(array[middleIndex].keyword.toLowerCase()) < 0) {
            end = middleIndex - 1;
        } else if (target.toLowerCase().localeCompare(array[middleIndex].keyword.toLowerCase()) > 0) {
            start = middleIndex + 1;
        } else {
            return -1;
        }
    }
}

//Binary search for filter and get the point result
let binarySearchMultiple = (array, target) => {
    let firstMatch = binarySearch(array, target);
    let resultArr = [-1, -1];
    if (firstMatch == -1) {
        return resultArr;
    }

    let leftMost = firstMatch;
    let rightMost = firstMatch;

    if (firstMatch >= 0) {
        while (leftMost > 0 && array[leftMost - 1].keyword.includes(target)) {
            leftMost--;
        }
        while (rightMost < array.length - 1 && array[rightMost + 1].keyword.includes(target)) {
            rightMost++;
        }
    }

    resultArr[0] = leftMost;
    resultArr[1] = rightMost;

    let allSelectedIndex = [];
    for (let i = resultArr[0]; i <= resultArr[1]; i++) {
        allSelectedIndex.push(i);
    }

    let selectedIds = [];
    allSelectedIndex.forEach(index => {
        selectedIds.push(array[index].ids);
    });

    return [...new Set(selectedIds.flat())].sort(function(a, b) {
        return a - b
    });
}



let searchInput = document.getElementById("search-input");

//Searching function
let launchSearch = (e) => {

    let mainSection = document.getElementById("main");
    if (searchInput.value.length > 2) {
        mainSection.innerHTML = "";
        let input = e.target.value.toLowerCase().trim();
        let selectedArr = binarySearchMultiple(keywordObjectArray, input);

        if (selectedArr.length > 0) {
            selectedArr.forEach(recipeId => {
                createCard(recipesArray[recipeId - 1]);
            });
        } else {
            mainSection.innerHTML = "<p id='noresult-msg'>Aucune recette ne correspond à votre critère... vous pouvez chercher << tarte aux pommes >>, << poisson >>, etc.</p>";
        }
    } else {
        mainSection.innerHTML = "";
        recipesArray.forEach(recipe => createCard(recipe));
    }
}
searchInput.addEventListener("keyup", function(e) {
    launchSearch(e)
});