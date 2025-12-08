class UI{
    constructor(){
        this.attribute = "dimmer"
        this.attributePage = 0
        let that = this
        document.querySelectorAll("#attributes button").forEach(function(n){
            n.onclick = function(e){
                document.querySelectorAll("#attributes button").forEach(function(m){
                    m.classList.remove("selected")
                })
                n.classList.add("selected")
                that.attribute = n.innerHTML.toLowerCase()
                that.attributePage = 0
                that.updateAttributes()
            }
        })

        document.querySelectorAll("#attribute-values button").forEach(function(n){
            n.onclick = function(e){
                if(n.innerHTML != ""){
                    let paramVal = n.innerHTML.split("<br>")
                    parameterMenu.parameter = paramVal[0]
                    parameterMenu.value = parseInt(paramVal[1])
                    parameterMenu.bits = parseInt(n.dataset.bits)
                    parameterMenu.toggleParameterMenu()
                }
            }
        })

        document.querySelector('#attribute-page-up').onclick = function(){
            that.attributePage++
            that.updateAttributes()
        }
        document.querySelector('#attribute-page-down').onclick = function(){
            that.attributePage--
            if(that.attributePage < 0){
                that.attributePage = 0
            }
            that.updateAttributes()
        }
        document.querySelector('button#patch-menu-button').onclick = function(){
            patchMenu.togglePatchMenu()
        }
        document.querySelector('button#settings-menu-button').onclick = function(){
            settingsMenu.toggleSettingsMenu()
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
        let bits = []
        if(fixtureManager.selectedFixtures.length > 0){
            for(let i=0;i<fixtureManager.selectedFixtures.length;i++){
                let fixture = fixtureManager.fixtures[fixtureManager.selectedFixtures[i]]
                for(let j=0;j<fixture.channelNames.length;j++){
                    if(fixture.manualChannels[j] === false){
                        if(fixture.fixtureProfile.channels[fixture.channelNames[j]].type == this.attribute){
                            let index = attributes.indexOf(fixture.channelNames[j])
                            if(index == -1){
                                attributes.push(fixture.channelNames[j])
                                attributeValues.push(fixture.channels[j])
                                bits.push(1)
                            } else {
                                if(fixture.channelNames[j].indexOf("Fine") == -1){
                                    if(fixture.channels[j] > attributeValues[index] && fixture.channelNames[j+1].indexOf("Fine") == -1){
                                        attributeValues[index] = fixture.channels[j]
                                    }
                                } else {
                                    if((fixture.channels[j-1] << 8) + fixture.channels[j] > (attributeValues[index-1] << 8) + attributeValues[index]){
                                        attributeValues[index-1] = fixture.channels[j-1]
                                        attributeValues[index] = fixture.channels[j]
                                    }
                                }
                            }
                            if(fixture.channelNames[j].indexOf("Fine") != -1){
                                let index = attributes.indexOf(fixture.channelNames[j].replace("Fine ",""))
                                bits[index] = 2
                            }
                        }
                    } else {
                        if(fixture.fixtureProfile.channels[fixture.channelNames[j]].type == this.attribute){
                            let index = attributes.indexOf(fixture.channelNames[j])
                            if(index == -1){
                                attributes.push(fixture.channelNames[j])
                                attributeValues.push(fixture.manualChannels[j])
                                bits.push(1)
                            } else {
                                if(fixture.channelNames[j].indexOf("Fine") == -1){
                                    if(fixture.manualChannels[j] > attributeValues[index] && fixture.channelNames[j+1].indexOf("Fine") == -1){
                                        attributeValues[index] = fixture.manualChannels[j]
                                    }
                                } else {
                                    if((fixture.manualChannels[j-1] << 8) + fixture.manualChannels[j] > (attributeValues[index-1] << 8) + attributeValues[index]){
                                        attributeValues[index-1] = fixture.manualChannels[j-1]
                                        attributeValues[index] = fixture.manualChannels[j]
                                    }
                                }
                            }
                            if(fixture.channelNames[j].indexOf("Fine") != -1){
                                let index = attributes.indexOf(fixture.channelNames[j].replace("Fine ",""))
                                bits[index] = 2
                            }
                        }
                    }
                }
            }
        }
        let offset = 0
        let count = 0
        for(let i=0;i<Math.max(attributes.length,5*(this.attributePage+1)) || count<5;i++){
            let j=i+offset
            if(j<attributes.length){
                if(attributes[j].indexOf("Fine") != -1){
                    continue
                }
            }
            let button = document.querySelectorAll('#attribute-values button')[count]
            button.dataset.bits = bits[j]
            if(bits[j] == 1){
                if(i >= this.attributePage*5){
                    button.innerHTML = (attributes[j] || "") + ((attributes[j] || "") && "<br>") + ((attributes[j] || "") && (attributeValues[j] || 0))
                    count++
                }
            } else {
                if(i >= this.attributePage*5){
                    button.innerHTML = (attributes[j] || "") + ((attributes[j] || "") && "<br>") + ((attributes[j] || "") && ((attributeValues[j] << 8) + attributeValues[j+1] || 0))
                    count++
                }
                offset++
            }
        }
    }
}