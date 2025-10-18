class UI{
    constructor(){

    }

    updateFixtureList(){
        document.getElementById('fixtures').innerHTML = ""
        for(let i=0;i<fixtureManager.fixtures.length;i++){
            let label = document.createElement('label')
            label.innerHTML = fixtureManager.fixtures[i].name
            let forAttribute = document.createAttribute('for')
            forAttribute.value = "fixture-" + i
            label.attributes.setNamedItem(forAttribute)
            let input = document.createElement('input')
            input.type = "checkbox"
            input.name = "fixture-" + i
            document.getElementById('fixtures').append(input)
            document.getElementById('fixtures').append(label)
        }
    }
}