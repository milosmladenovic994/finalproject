class SearchView{
_parentEl = document.querySelector('.search');
input = document.getElementById('inputField');

getQuery(){
    const query = this._parentEl.querySelector('.search__field').value;
    // const src = this._parentEl.querySelector('.search__btn');
    console.log(query.length);
    
    this._clearInput();
    return query;
    
}

_clearInput(){
    this._parentEl.querySelector('.search__field').value = '';
}

addHandlerSearch(handler){
    this._parentEl.addEventListener('submit', function(e){
e.preventDefault();
handler();
    })
    
}

disableInput(){
this.input.addEventListener('input', (e) => {
    e.preventDefault();
    console.log(this.input)
    this.input.value.length < 2
        ? document.querySelector('.search__btn').disabled = true
        : document.querySelector('.search__btn').removeAttribute('disabled');
    
})
}

};



export default new SearchView();