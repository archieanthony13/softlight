class UI{
    constructor(){

    }

    updateFixtureList(){
        document.getElementById('fixtures').innerHTML = ""
        for(let i=0;i<fixtureManager.fixtures.length;i++){
            let element = document.createElement('p')
            element.innerHTML = fixtureManager.fixtures[i].name
            document.getElementById('fixtures').append(element)
        }
    }
}