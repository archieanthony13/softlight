class UI{
    constructor(){
        this.attribute = "dimmer"
        this.attributePage = 0
        let that = this
        this.clear = false
        document.querySelectorAll("#attributes button").forEach(function(n){
            n.onclick = function(e){
                document.querySelectorAll("#attributes button").forEach(function(m){
                    m.classList.remove("selected")
                })
                n.classList.add("selected")
                that.attribute = n.innerHTML.toLowerCase()
                that.attributePage = 0
                that.updateAttributes()
                that.updatePalettesList()
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

        document.querySelector('button#cues-go-button').onclick = function(){
            sequenceManager.go()
        }
        document.querySelector('button#cues-store-button').onclick = function(){
            sequenceManager.toggleCueMenu()
        }
        document.querySelector('button#cues-delete-button').onclick = function(){
            let inputs = document.querySelectorAll("#cues-cuelist input")
            for(let i=0;i<inputs.length;i++){
                if(inputs[i].checked){
                    sequenceManager.deleteCue(undefined, parseFloat(inputs[i].dataset.cueNumber))
                }
            }
        }
        document.querySelector('button#cues-edit-button').onclick = function(){
            if(sequenceManager.selectedCue !== null){
                sequenceManager.toggleEditCueMenu()
            }
        }
        document.querySelector('button#fixtures-clear-button').onclick = function(){
            if(!that.clear){
                Array.from(document.querySelectorAll('#fixtures-list input')).forEach(function(n){
                    n.checked = false
                })
                fixtureManager.updateSelectedFixtures()
                that.clear = true
            } else {
                fixtureManager.clearAllManualFixtureChannels()
                that.clear = false
            }
        }

        document.querySelector('button#cues-section-button').onclick = function(){
            that.cuesSection()
        }
        document.querySelector('button#sequences-section-button').onclick = function(){
            that.sequencesSection()
        }
        document.querySelector('button#palettes-section-button').onclick = function(){
            that.palettesSection()
        }
    }

    cuesSection(){
        document.querySelector('.middle-right-section#cues').style.display = "grid"
        document.querySelector('.middle-right-section#sequences').style.display = "none"
        document.querySelector('.middle-right-section#palettes').style.display = "none"
        document.querySelector('button#cues-section-button').classList.add('selected')
        document.querySelector('button#sequences-section-button').classList.remove('selected')
        document.querySelector('button#palettes-section-button').classList.remove('selected')
        this.updateCueList()
    }

    sequencesSection(){
        document.querySelector('.middle-right-section#cues').style.display = "none"
        document.querySelector('.middle-right-section#sequences').style.display = "grid"
        document.querySelector('.middle-right-section#palettes').style.display = "none"
        document.querySelector('button#cues-section-button').classList.remove('selected')
        document.querySelector('button#sequences-section-button').classList.add('selected')
        document.querySelector('button#palettes-section-button').classList.remove('selected')
        this.updateSequencesList()
    }

    palettesSection(){
        document.querySelector('.middle-right-section#cues').style.display = "none"
        document.querySelector('.middle-right-section#sequences').style.display = "none"
        document.querySelector('.middle-right-section#palettes').style.display = "grid"
        document.querySelector('button#cues-section-button').classList.remove('selected')
        document.querySelector('button#sequences-section-button').classList.remove('selected')
        document.querySelector('button#palettes-section-button').classList.add('selected')
        this.updatePalettesList()
    }

    updateFixtureList(){
        document.getElementById('fixtures-list').innerHTML = ""
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
            document.getElementById('fixtures-list').append(input)
            document.getElementById('fixtures-list').append(label)
        }
        document.getElementById('fixtures-list').style.gridTemplateRows = "repeat(" + fixtureManager.fixtures.length + ", calc(var(--scale)*4))"
    }

    updateCueList(){
        document.getElementById('cues-cuelist').innerHTML = ""
        let sequence = sequenceManager.sequences[sequenceManager.selectedSequence]
        for(let i=0;i<sequence.cuesOrder.length;i++){
            let label = document.createElement('label')
            label.innerHTML = sequence.cues[sequence.cuesOrder[i]].name
            let forAttribute = document.createAttribute('for')
            forAttribute.value = "cue-" + i
            label.attributes.setNamedItem(forAttribute)
            let input = document.createElement('input')
            input.type = "checkbox"
            input.name = "cue-" + i
            input.id = "cue-" + i
            input.hidden = true
            input.dataset.cueNumber = sequence.cuesOrder[i]
            document.getElementById('cues-cuelist').append(input)
            document.getElementById('cues-cuelist').append(label)
        }
        document.getElementById('cues-cuelist').style.gridTemplateRows = "repeat(" + sequence.cuesOrder.length + ", calc(var(--scale)*4))"
        this.scrollCueList()
    }

    updateSequencesList(){
        document.getElementById('sequences-sequencelist').innerHTML = ""
        let keys = Object.keys(sequenceManager.sequences)
        for(let i=0;i<keys.length;i++){
            let label = document.createElement('label')
            label.innerHTML = keys[i]
            if(sequenceManager.selectedSequence == keys[i]){
                label.classList.add("selected")
            }
            label.onclick = function(){
                sequenceManager.selectSequence(keys[i])
            }
            document.getElementById('sequences-sequencelist').append(label)
        }
        document.getElementById('sequences-sequencelist').style.gridTemplateRows = "repeat(" + keys.length + ", calc(var(--scale)*4))"
    }

    updatePalettesList(){
        document.getElementById('palettes-palettelist').innerHTML = ""
        let keys = Object.keys(paletteManager.palettes[this.attribute])
        for(let i=0;i<keys.length;i++){
            let label = document.createElement('label')
            label.innerHTML = keys[i]
            document.getElementById('palettes-palettelist').append(label)
        }
        document.getElementById('palettes-palettelist').style.gridTemplateRows = "repeat(" + keys.length + ", calc(var(--scale)*4))"
    }

    scrollCueList(){
        let cueList = document.querySelectorAll("#cues-cuelist label")
        let name = sequenceManager.selectedSequence
        let j = sequenceManager.sequences[name].cuesOrder.indexOf(sequenceManager.sequences[name].currentCue)
        if(cueList[j]){
            document.getElementById('cues-cuelist').scrollTo({top: cueList[j].scrollHeight * (j-3), behavior: 'smooth'})
        }
    }

    updateAttributes(){
        let attributes = []
        let attributeValues = []
        let manual = []
        let bits = []
        if(fixtureManager.selectedFixtures.length > 0){
            for(let i=0;i<fixtureManager.selectedFixtures.length;i++){
                let fixture = fixtureManager.fixtures[fixtureManager.selectedFixtures[i]]
                dmx.update()
                let fixtureData = dmx.getFixtureData(fixture.name)
                let fixtureDataTypes = dmx.getFixtureDataTypes(fixture.name)
                for(let j=0;j<fixtureData.length;j++){
                    if(fixture.channelTypes[j] == this.attribute){
                        let index = attributes.indexOf(fixture.channelNames[j])
                        if(index == -1){
                            attributes.push(fixture.channelNames[j])
                            attributeValues.push(fixtureData[j])
                            if(fixtureDataTypes[j] == "manual"){
                                manual.push("manual")
                            } else if(fixtureDataTypes[j] == "sequence" && manual[j] != "manual"){
                                manual.push("sequence")
                            } else {
                                manual.push("default")
                            }
                            bits.push(1)
                        } else {
                            if(fixtureDataTypes[j] == "manual"){
                                manual[index] = "manual"
                            } else if(fixtureDataTypes[j] == "sequence" && manual[index] != "manual"){
                                manual[index] = "sequence"
                            } else if(manual[index] != "sequence" && manual[index] != "manual") {
                                manual[index] = "default"
                            }
                            if(fixture.channelNames[j].indexOf("Fine") == -1){
                                if(fixtureData[j] > attributeValues[index] && fixture.channelNames[j+1].indexOf("Fine") == -1){
                                    attributeValues[index] = fixtureData[j]
                                }
                            } else {
                                if((fixtureData[j-1] << 8) + fixtureData[j] > (attributeValues[index-1] << 8) + attributeValues[index]){
                                    attributeValues[index-1] = fixtureData[j-1]
                                    attributeValues[index] = fixtureData[j]
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
        let offset = 0
        let count = 0
        for(let i=0;i<Math.max(attributes.length,5*(this.attributePage+1)) && count<5;i++){
            let j=i+offset
            if(j<attributes.length){
                if(attributes[j].indexOf("Fine") != -1){
                    continue
                }
            }
            let button = document.querySelectorAll('#attribute-values button')[count]
            button.classList.remove("manual-channel")
            button.classList.remove("sequence-channel")
            if(manual[j] == "manual"){
                button.classList.add("manual-channel")
            } else if(manual[j] == "sequence") {
                button.classList.add("sequence-channel")
            }
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