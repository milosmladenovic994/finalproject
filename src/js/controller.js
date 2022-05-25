import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './recipeView.js';
import SearchView from './searchView.js';
import ResultsView from './resultsView.js';
import paginationView from './paginationView.js';
import bookmarksView from './bookmarksView.js';
import addRecipeView from './addRecipeView.js';



import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';
import resultsView from './resultsView.js';
// console.log(icons);

if(module.hot){
  module.hot.accept();
}


const recipeContainer = document.querySelector('.recipe');



// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////


const showRecipe = async function(){
  try{
    const id = window.location.hash.slice(1);
    // console.log(id);

    if(!id)return;
    
    recipeView.renderSpinner();

    //update result view to mark selected search reults

    resultsView.update(model.getSearchResultsPage());

    bookmarksView.update(model.state.bookmarks);

    //loading recipe
    await model.loadRecipe(id);
    // const {recipe} = model.state;

    
    //rendering recipe
    recipeView.render(model.state.recipe);
    

      
  }catch(err){
    console.log(err);
    recipeView.renderError();
  }
};


const controlSearchResults = async function(){
try {
  

  const query = SearchView.getQuery();
  if(!query)recipeView.renderError();
  ResultsView.renderSpinner();
  
  
  console.log(ResultsView);
  await model.loadSearchResult(query);
  // console.log(model.state.search.results);

  resultsView.render(model.getSearchResultsPage(1));

  paginationView.render(model.state.search);

} catch (err) {
  console.log(err);
  recipeView.renderError();
  
}
};

// controlSearchResults();

const controlPagination = function(goToPage){

  //render new results
  resultsView.render(model.getSearchResultsPage(goToPage));
//render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function(newServings){
  //update servings in the state
model.updateServings(newServings);
//update recipe view
// recipeView.render(model.state.recipe);
recipeView.update(model.state.recipe);



};

const controlAddBookmark = function(){
  //add or remove bookmark
  if(!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe)
  }else {
    model.deleteBookmark(model.state.recipe)
  };
  // model.addBookmark(model.state.recipe);
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
  console.log(localStorage)
  
  
};

const controlAddRecipe = async function(newRecipe){
  // console.log(newRecipe);
  try{
  await model.uploadRecipe(newRecipe);
  //render recipe
  recipeView.render(model.state.recipe);

  //success message
  addRecipeView.renderMessage('Thank you for uploading recipe');


  //render bookmark view

  bookmarksView.render(model.state.bookmarks);

  //change id in url

  window.history.pushState(null, '', `#${model.state.recipe.id}`);
  

  //close form window
  setTimeout(function(){
    addRecipeView.toggleWindow()
  }, MODAL_CLOSE_SEC*1000);

  }catch(err){
    console.error('Private error', err);
    addRecipeView.renderError('First select type of meal, and then upload recipe to a desired section!');
  }
}

const init = function(){
recipeView.addHandlerender(showRecipe);
recipeView.addHandlerUpdateServings(controlServings);
recipeView.addHandlerAddBookmark(controlAddBookmark);
SearchView.addHandlerSearch(controlSearchResults);
paginationView.addHandlerClick(controlPagination);
addRecipeView.addHandlerUpload(controlAddRecipe);

};
init();