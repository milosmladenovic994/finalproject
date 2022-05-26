class SearchView{
_parentEl = document.querySelector('.search');

getQuery(){
    const query = this._parentEl.querySelector('.search__field').value;
    // const src = this._parentEl.querySelector('.search__btn');

    // if(query<2){
    //     // alert('too short');
    //     src.setAttribute('disabled', 'disabled')
    // }else{
    //     src.removeAttribute('disabled')
    // }
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