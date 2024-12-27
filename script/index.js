import { CocktailApi } from "./cocktailApi.js";

let api = new CocktailApi();

let errImg = [
  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ffluffyplanet.com%2Fwp-content%2Fuploads%2F2020%2F04%2Fshutterstock_416950756.jpg&f=1&nofb=1&ipt=c2dbb83a1c29c01abbef3715e9bc16e426599687ce0bdd6e19e7fa829718668e&ipo=images",
  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Fpremium-photo%2Flonely-sad-woman-sitting-bar-with-cocktail-feeling-depressed-unhappy-problem-with-alcohol-abuse_266732-34964.jpg%3Fw%3D900&f=1&nofb=1&ipt=131d60218dcd7cc042e0585ec5b80f9e67143dc4207033bbabd370587f34a3cb&ipo=images",
];

let drinkList = await api.getRandom(); //initiailze with list of 3 random drinks

const drinkSection = document.querySelector(".cocktails");
const searchDrinks = document.querySelector(".search");
const searchIngred = document.querySelector(".search__ingredients");
const ranButton = document.querySelector(".search__button");

ranButton.addEventListener("onclick", async function (event) {
  event.preventDefault();
  drinkList = api.getRandom();
  populateDrinks();
});

searchDrinks.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (event.target.search__id.value === "") {
    noDrinks("no drinks found :( \n please enter a query!");
    return;
  }
  let result = await api.searchDrinks(event.target.search__id.value);
  if (!result || result[0] === "no data found") {
    //if null, populate list with no results found?
    noDrinks("no drinks found :(");
    return;
  }

  populateDrinks(result);
});

searchIngred.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (event.target.search__id__ingredients.value === "") {
    noDrinks("no drinks found :( \n please enter a query!");
    return;
  }
  let result = await api.searchIngredients(
    event.target.search__id__ingredients.value
  );
  if (!result || result === "no data fo") {
    //if null, populate list with no results found?
    noDrinks(
      `no drinks found :( \n make sure you're entering the full ingredient name!`
    );
    return;
  }

  let drinksByIngredient = await buildList(result);
  setTimeout(function () {
    populateDrinks(drinksByIngredient);
  }, 500);
});

function noDrinks(err) {
  let message = err;
  drinkSection.innerText = "";
  const ctr = createElementWithClass("div", "cocktail");
  const img = createElementWithClass("img", "cocktail__image");
  img.src = errImg[Math.floor(Math.random() * 2)]; 
  const name = createElementWithClass("h2", "cocktail__name");
  name.innerText = message;

  const content = createElementWithClass("div", "cocktail__content");
  const ingred = createElementWithClass("div", "cocktail__ingredients");
  const ingredHead = document.createElement("h3");
  const ingredText = document.createElement("p");
  ingred.appendChild(ingredHead);
  ingred.appendChild(ingredText);

  const instruct = createElementWithClass("div", "cocktail__instructions");
  const instructHead = document.createElement("h3");
  const instructText = document.createElement("p");
  //console.log(drinkList[i].strInstructions)
  // console.log(formatInstructions(drinkList[i].strInstructions))
  instruct.appendChild(instructHead);
  instruct.appendChild(instructText);

  content.appendChild(name);
  content.appendChild(ingred);
  content.appendChild(instruct);

  ctr.appendChild(img);
  ctr.appendChild(content);

  drinkSection.append(ctr);
}

function populateDrinks(list) {

  drinkSection.innerText = "";
  for (let i = 0; i < list.length && i < 25; i++) {
    const ctr = createElementWithClass("div", "cocktail");
    const img = createElementWithClass("img", "cocktail__image");
    img.src = list[i].strDrinkThumb;
    const name = createElementWithClass("h2", "cocktail__name");
    name.innerText = list[i].strDrink.toLowerCase();

    const content = createElementWithClass("div", "cocktail__content");
    const ingred = createElementWithClass("div", "cocktail__ingredients");
    const ingredHead = document.createElement("h3");
    ingredHead.innerText = "ingredients";
    const ingredText = document.createElement("p");
    ingredText.innerText = gatherIngredients(list[i]);
    ingred.appendChild(ingredHead);
    ingred.appendChild(ingredText);

    const instruct = createElementWithClass("div", "cocktail__instructions");
    const instructHead = document.createElement("h3");
    instructHead.innerText = "instructions";
    const instructText = document.createElement("p");
    instructText.innerText = formatInstructions(
      list[i].strInstructions.toLowerCase()
    );
    //console.log(list[i].strInstructions)
    // console.log(formatInstructions(list[i].strInstructions))
    instruct.appendChild(instructHead);
    instruct.appendChild(instructText);

    content.appendChild(name);
    content.appendChild(ingred);
    content.appendChild(instruct);

    ctr.appendChild(img);
    ctr.appendChild(content);

    drinkSection.append(ctr);
  }
}

populateDrinks(drinkList);

function createElementWithClass(elem, className) {
  const val = document.createElement(elem);
  val.classList.add(className);
  return val;
}

function gatherIngredients(drink) {
  //console.log('drink is')
  //console.log(drink)
  let output = "";
  let idx = 1;
  let ingred = "strIngredient" + idx;
  while (idx < 16) {
    ingred = "strIngredient" + idx;
    if (drink[ingred]) {
      output += drink[ingred] + ", ";
    }
    idx++;
  }
  output = output.slice(0, -2).toLowerCase();
  return output;
}

function formatInstructions(instruct) {
  instruct = instruct.replaceAll("\n", "");
  instruct = instruct.replaceAll(". ", ".\n");
  return instruct;
}

async function buildList(result) {
  let list = [];
  result.forEach(async function (i) {
    let drinkFull = await api.searchById(i.idDrink);

    list.push(drinkFull.drinks[0]);
  });
  return list;
}
