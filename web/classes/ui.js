class UI{
    constructor(){
        this.attribute = "dimmer"
        let that = this
        document.querySelectorAll("#attributes button").forEach(function(n){
            n.onclick = function(e){
                that.attribute = n.innerHTML.toLowerCase()
                that.updateAttributes()
            }
        })
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
            input.id = "fixture-" + i
            document.getElementById('fixtures').append(input)
            document.getElementById('fixtures').append(label)
        }
    }

    updateAttributes(){
        
    }
}