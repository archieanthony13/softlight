class UI{
    constructor(){
        this.attribute = "dimmer"
        this.attributePage = 0
        let that = this
        document.querySelectorAll("#attributes button").forEach(function(n){
            n.onclick = function(e){
                that.attribute = n.innerHTML.toLowerCase()
                that.updateAttributes()
            }
        })

        Array.from(document.querySelectorAll('#attribute-values input')).forEach(function(n){
            n.onchange = function(){
                let label = document.querySelector("#attribute-values label#" + n.id + "-label")
                let input = n
                if(label.innerHTML != ""){
                    fixtureManager.updateSelectedFixtureChannel(label.innerHTML, parseInt(input.value))
                }
            }
        })

        document.querySelector('#attribute-page-up').onclick = function(){
            that.attributePage++
            that.updateAttributes()
        }
        document.querySelector('#attribute-page-down').onclick = function(){
            that.attributePage--
            that.updateAttributes()
        }
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
            input.hidden = true
            document.getElementById('fixtures').append(input)
            document.getElementById('fixtures').append(label)
        }
        document.getElementById('fixtures').style.gridTemplateRows = "repeat(" + fixtureManager.fixtures.length + ", calc(var(--scale)*4))"
    }

    updateAttributes(){
        let attributes = []
        let attributeValues = []
        if(fixtureManager.selectedFixtures.length > 0){
            for(let i=0;i<fixtureManager.selectedFixtures.length;i++){
                let fixture = fixtureManager.fixtures[fixtureManager.selectedFixtures[i]]
                for(let j=0;j<fixture.channelNames.length;j++){
                    if(fixture.fixtureProfile.channels[fixture.channelNames[j]].type == this.attribute){
                        let index = attributes.indexOf(fixture.channelNames[j])
                        if(index == -1){
                            attributes.push(fixture.channelNames[j])
                            attributeValues.push(fixture.channels[j])
                        } else {
                            if(fixture.channels[j] > attributeValues[index]){
                                attributeValues[index] = fixture.channels[j]
                            }
                        }
                    }
                }
            }
        }
        for(let i=0;i<5;i++){
            let j=i+this.attributePage*5
            document.querySelectorAll('#attribute-values label')[i].innerHTML = (attributes[j] || "")
            document.querySelectorAll('#attribute-values input')[i].value = (attributeValues[j] || 0)
        }
    }
}