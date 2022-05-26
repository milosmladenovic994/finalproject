class SearchView{
_parentEl = document.querySelector('.search');

getQuery(){
    const query = this._parentEl.querySelector('.search__field').value;
    // const src = this._parentEl.querySelector('.search__btn');
    console.log(query.length);
    if(query.length<2){
        // alert('too short');
        document.querySelector('.search__btn').setAttribute('disabled', 'disabled')
    }else if(query.length > 3){
        document.querySelector('.search__btn').removeAttribute('disabled')
    }
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

};

export default new SearchView();