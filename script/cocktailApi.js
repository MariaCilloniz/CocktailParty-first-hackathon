//API documentation: https://www.thecocktaildb.com/api.php

export class CocktailApi {
  constructor() {
    this.url = "https://www.thecocktaildb.com/api/json/v1/1/";
  }

  async getRandom() {
    try {
      //let randomList = await axios.get(this.url + "randomselection.php"); oops this is premium
      let randomLetterIdx = Number.parseInt(Math.random() * 26 + 1); //get a number between 0-26 to pick a letter
      let randomLetter = String.fromCharCode(randomLetterIdx + 97); //+97 to reach the base for lower-case ASCII characters, then converted to the random letter
      let req = await axios.get(this.url + "search.php?f=" + randomLetter);
      let list = req.data.drinks;
      list.sort((a, b) => a.idDrink - b.idDrink);
      return list.slice(0, 3);
    } catch (error) {
      console.log("Error retrieving initial list: " + error);
    }
  }

  async searchDrinks(query) {
    try {
      let searchRes = await axios.get(this.url + "search.php?s=" + query);

      return searchRes.data.drinks;
    } catch (error) {
      console.log("Error retrieving drink search results: " + error);
    }
  }

  async searchIngredients(query) {
    try {
      let searchRes = await axios.get(this.url + "filter.php?i=" + query);

      return searchRes.data.drinks.slice(0, 10);
    } catch (error) {
      console.log("Error retrieving ingredient search results: " + error);
    }
  }

  async searchById(query) {
    try {
      let searchRes = await axios.get(this.url + "lookup.php?i=" + query);

      return searchRes.data;
    } catch (error) {
      console.log("Error retrieving ID search results: " + error);
    }
  }
}
