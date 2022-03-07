import { recipes } from "./recipe.js";

//SEARCH algo 1

//F to extract and sort keywords
//Sorting F | if more elements left + more elements right
let quickSort = (array, left, right) => {
	let index;
	if (array.length > 1) {
		index = partition(array, left, right); //take index from partition
		if (left<index-1) { //more elements on the left
			quickSort(array, left, index-1);
		}
		if (index<right) { //more elements on the right
			quickSort(array, index, right);
		}
	}
	return array;
}
//partition code, to make a left and right elements list
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
//function to swap position
let swap = (items, leftIndex, rightIndex) => {
	var temp = items[leftIndex];
	items[leftIndex] = items[rightIndex];
	items[rightIndex] = temp;
}
//filter and extract only id, name, ingredients, and description
let createFilteredArr = (arr) => {
	let filteredArr = [];
	for (let i = 0; i<arr.length; i++) {
		let filtered = (({id, ingredients, name, description}) => ({id, ingredients, name, description}))(arr[i][1]);
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
	this.keyword = quickSort(uniqueValue, 0, uniqueValue.length-1);
}

let extractKeyword = (arr) => {
	let newArr = [];
	for (let i=0; i<arr.length; i++) {
		let keyword = new FilterKeyword(arr[i]);
		newArr.push(keyword);
	}
	return newArr;
}
let filteredKeywordArr = extractKeyword(filteredArr);
console.log(filteredKeywordArr);
//take only the keywords
let allKeywords = [];
filteredKeywordArr.forEach(item => {allKeywords.push(item.keyword)});
let flatKeyword = allKeywords.flat();
let allKeywordsLowerCase = [];
flatKeyword.forEach(word => {allKeywordsLowerCase.push(word.toLowerCase())});
let searchOptionsNotSorted = [...new Set(allKeywordsLowerCase.flat())];

//sort by alphabetical order
let searchOptions = quickSort(searchOptionsNotSorted, 0, searchOptionsNotSorted.length-1);
console.log(searchOptions);

function KeywordObject(item) {
	this.keyword = item;
	let recipeIds = [];
	for (let i=0; i<filteredKeywordArr.length; i++) {
		if (filteredKeywordArr[i].keyword.indexOf(item) >= 0 ) {
			recipeIds.push(filteredKeywordArr[i].id);
		}
	}
	this.ids = recipeIds;
}

let keywordArray = (arr) => {
	let newArr = [];
	for (let i=0; i<arr.length; i++) {
		let keyword = new KeywordObject(arr[i]);
		newArr.push(keyword);
	}
	return newArr;
}

let keywordObjectArray = keywordArray(searchOptions);
console.log(keywordObjectArray);

let searchInput = document.getElementById("search-input");
//implement the function on key press
autocomplete(searchInput, searchOptions, 2);
