import {async} from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config';
import { getJson, sendJSON } from './helpers';
// import { RES_PER_PAGE } from './config';

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,

    },
    bookmarks: [],

};

export const loadRecipe = async function(id){
    try{

        const data= await getJson(`${API_URL}${id}`);

  
        console.log( data);
        const { recipe } = data.data;
        state.recipe = {
          id: recipe.id,
          title: recipe.title,
          publisher: recipe.publisher,
          sourceUrl: recipe.source_url,
          image: recipe.image_url,
          servings: recipe.servings,
          cookingTime: recipe.cooking_time,
          ingredients: recipe.ingredients,
          ...(recipe.key && {key: recipe.key}),
        };

        if(state.bookmarks.some(function(bookmark){
            return bookmark.id = id;
        })
        ){state.recipe.bookmarked = true;}
        else{state.recipe.bookmarked = false;}
        console.log(state.recipe);
    }catch (err){
        console.log(err);
        throw err;
    }
};

export const loadSearchResult = async function(query){
    try{
        state.search.query = query;
        const data = await getJson(`${API_URL}?search=${query}`);
        console.log(data);

        state.search.results = data.data.recipes.map(function(rec){
            return {
          id: rec.id,
          title: rec.title,
          publisher: rec.publisher,
          sourceUrl: rec.source_url,
          image: rec.image_url,
            }
        });
        state.search.page = 1;
// console.log(state.search.results);
    }catch(err){
        console.log(err);
        throw err;
    }
};

// loadSearchResult('pizza');

export const getSearchResultsPage = function(page =state.search.page){
state.search.page = page;
const start = (page-1) * state.search.resultsPerPage;
const end = page * 10;

return state.search.results.slice(start, end);
};

export const updateServings = function(newServings){
    state.recipe.ingredients.forEach(function(ing){
        ing.quantity = (ing.quantity *newServings) /state.recipe.servings;
    });
    state.recipe.servings = newServings;
};


export const addBookmark = function(recipe){
    //add bookmark
    state.bookmarks.push(recipe);

    //mark current recipe as bookmark
    if(recipe.id === state.recipe.id) state.recipe.bookmarked =true;
};

export const deleteBookmark = function(id){

    //delete bookmark
    const index = state.bookmarks.findIndex(function(el){
        return el.id === id
    });
    state.bookmarks.splice(index, 1);
//remove bookmark
    if(state.recipe.id === state.recipe.id) state.recipe.bookmarked =false;
};


export const uploadRecipe = async function(newRecipe){
    try{
    const ingredients = Object.entries(newRecipe).filter(function(entry){
        return entry[0].startsWith('ingredient') && entry[1] !=='';
    }).map(function(ing){

        const ingArr = ing[1].replaceAll(' ', '').split(',');
        // if(ingArr.lenght !== 3)throw new Error('Wrong ingredient format, use the correct one');
        const [quantity, unit, description] = ingArr;


        return {quantity : quantity ? +quantity: null, unit, description};
    });
    const recipe = {
        title: newRecipe.title,
        source_url: newRecipe.sourceUrl,
        image_url: newRecipe.image,
        publisher:newRecipe.publisher,
        cooking_time: +newRecipe.cookingTime,
        servings: newRecipe.servings,
        ingredients,
    };
    // console.log(recipe);
    const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
    console.log(data);
    addBookmark(state.recipe);
}catch(err){
    throw err;
}


}
