class UI{
    constructor(){
        // Initialise UI variables
        this.attribute = "dimmer"
        this.attributePage = 0
        // DOM events within the UI
        let that = this
        this.clear = false
        // Loop through attribute buttons and set their onclick functions
        document.querySelectorAll("#attributes button").forEach(function(n){
            // Event for clicking the button
            n.onclick = function(e){
                // Clear selected classes from all buttons
                document.querySelectorAll("#attributes button").forEach(function(m){
                    m.classList.remove("selected")
                })
                // Add selected class back to the pressed button
                n.classList.add("selected")
                // Update the attribute value
                that.attribute = n.innerHTML.toLowerCase()
                // Reset thr attribute list page
                that.attributePage = 0
                // Update accordingly
                that.updateAttributes()
                that.updatePalettesList()
            }
        })

        // Loop through parameter buttons and set onclick functions
        document.querySelectorAll("#attribute-values button").forEach(function(n){
            // Event for clicking the button
            n.onclick = function(e){
                // If the button has text then open the parameter menu
                if(n.innerHTML != ""){
                    // Get the parameter value
                    let paramVal = n.innerHTML.split("<br>")
                    // Set parameter menu variables
                    parameterMenu.parameter = paramVal[0]
                    parameterMenu.value = parseInt(paramVal[1])
                    parameterMenu.bits = parseInt(n.dataset.bits)
                    // Open the parameter menu
                    parameterMenu.toggleParameterMenu()
                }
            }
        })

        // Go up another page on the attribute list
        document.querySelector('#attribute-page-up').onclick = function(){
            that.attributePage++
            that.updateAttributes()
        }
        // Go down a page on the attribute list
        document.querySelector('#attribute-page-down').onclick = function(){
            that.attributePage--
            // Ensure the page number does not go below 0
            if(that.attributePage < 0){
                that.attributePage = 0
            }
            that.updateAttributes()
        }
        // Open the patch menu
        document.querySelector('button#patch-menu-button').onclick = function(){
            patchMenu.togglePatchMenu()
        }
        // Open the settings menu
        document.querySelector('button#settings-menu-button').onclick = function(){
            settingsMenu.toggleSettingsMenu()
        }

        // Activate a cue
        document.querySelector('button#cues-go-button').onclick = function(){
            sequenceManager.go()
        }
        // Store to a cue
        document.querySelector('button#cues-store-button').onclick = function(){
            sequenceManager.toggleCueMenu()
        }
        // Delete a cue
        document.querySelector('button#cues-delete-button').onclick = function(){
            // Loop through HTML cues
            let inputs = document.querySelectorAll("#cues-cuelist input")
            for(let i=0;i<inputs.length;i++){
                // Delete cue if input has been checked meaning it is selected
                if(inputs[i].checked){
                    sequenceManager.deleteCue(undefined, parseFloat(inputs[i].dataset.cueNumber))
                }
            }
        }
        // Edit a cue
        document.querySelector('button#cues-edit-button').onclick = function(){
            // Open the edit menu only if there is a selected cue
            if(sequenceManager.selectedCue !== null){
                sequenceManager.toggleEditCueMenu()
            }
        }
        // Clear manual channel and fixtrues
        document.querySelector('button#fixtures-clear-button').onclick = function(){
            // Clear selected fixtures
            if(!that.clear){
                // Loop through fixture list and deselect them
                Array.from(document.querySelectorAll('#fixtures-list input')).forEach(function(n){
                    n.checked = false
                })
                // Update selected fixtures
                fixtureManager.updateSelectedFixtures()
                that.clear = true
            // Clear manual channels
            } else {
                fixtureManager.clearAllManualFixtureChannels()
                that.clear = false
            }
        }

        // Open the cue tab
        document.querySelector('button#cues-section-button').onclick = function(){
            that.cuesSection()
        }
        // Open the sequence tab
        document.querySelector('button#sequences-section-button').onclick = function(){
            that.sequencesSection()
        }
        // Open the palette tab
        document.querySelector('button#palettes-section-button').onclick = function(){
            that.palettesSection()
        }

        // Open sequence menu to create a sequence
        document.querySelector('button#sequences-create-button').onclick = function(){
            sequenceManager.toggleSequenceMenu()
        }
        // Delete sequence
        document.querySelector('button#sequences-delete-button').onclick = function(){
            sequenceManager.deleteSequence()
        }

        // Open palette menu to create a palette
        document.querySelector('button#palettes-create-button').onclick = function(){
            paletteManager.togglePaletteMenu()
        }
        // Delete palette
        document.querySelector('button#palettes-delete-button').onclick = function(){
            paletteManager.deletePaletteButton()
        }
        // Open palette store menu to store to a palette
        document.querySelector('button#palettes-store-button').onclick = function(){
            paletteManager.togglePaletteStoreMenu()
        }
    }

    // Function to open the cue tab
    cuesSection(){
        document.querySelector('.middle-right-section#cues').style.display = "grid"
        document.querySelector('.middle-right-section#sequences').style.display = "none"
        document.querySelector('.middle-right-section#palettes').style.display = "none"
        document.querySelector('button#cues-section-button').classList.add('selected')
        document.querySelector('button#sequences-section-button').classList.remove('selected')
        document.querySelector('button#palettes-section-button').classList.remove('selected')
        this.updateCueList()
    }

    // Function to open the sequence tab
    sequencesSection(){
        document.querySelector('.middle-right-section#cues').style.display = "none"
        document.querySelector('.middle-right-section#sequences').style.display = "grid"
        document.querySelector('.middle-right-section#palettes').style.display = "none"
        document.querySelector('button#cues-section-button').classList.remove('selected')
        document.querySelector('button#sequences-section-button').classList.add('selected')
        document.querySelector('button#palettes-section-button').classList.remove('selected')
        this.updateSequencesList()
    }

    // Function to open the palette tab
    palettesSection(){
        document.querySelector('.middle-right-section#cues').style.display = "none"
        document.querySelector('.middle-right-section#sequences').style.display = "none"
        document.querySelector('.middle-right-section#palettes').style.display = "grid"
        document.querySelector('button#cues-section-button').classList.remove('selected')
        document.querySelector('button#sequences-section-button').classList.remove('selected')
        document.querySelector('button#palettes-section-button').classList.add('selected')
        this.updatePalettesList()
    }

    // Function to update the fixture list
    updateFixtureList(){
        // Clear fixture list
        document.getElementById('fixtures-list').innerHTML = ""
        // Loop through all fixtures
        for(let i=0;i<fixtureManager.fixtures.length;i++){
            // Create a label element to display fixture name
            let label = document.createElement('label')
            label.innerHTML = fixtureManager.fixtures[i].name
            // Link to an input tag
            let forAttribute = document.createAttribute('for')
            forAttribute.value = "fixture-" + i
            label.attributes.setNamedItem(forAttribute)
            // Create a checkbox input
            let input = document.createElement('input')
            input.type = "checkbox"
            // Link to label tag
            input.name = "fixture-" + i
            input.id = "fixture-" + i
            // Hide input so it is not visible to the user
            input.hidden = true
            // Append both the input and label to the fixture list
            document.getElementById('fixtures-list').append(input)
            document.getElementById('fixtures-list').append(label)
        }
        // Update styling so it allows for all fixtures
        document.getElementById('fixtures-list').style.gridTemplateRows = "repeat(" + fixtureManager.fixtures.length + ", calc(var(--scale)*4))"
    }

    // Function to update the cue list
    updateCueList(){
        // Clear cue list
        document.getElementById('cues-cuelist').innerHTML = ""
        // Loop through the selected sequence cues
        let sequence = sequenceManager.sequences[sequenceManager.selectedSequence]
        for(let i=0;i<sequence.cuesOrder.length;i++){
            // Create a label element to display cue name
            let label = document.createElement('label')
            label.innerHTML = sequence.cues[sequence.cuesOrder[i]].name
            // Link to an input tag
            let forAttribute = document.createAttribute('for')
            forAttribute.value = "cue-" + i
            label.attributes.setNamedItem(forAttribute)
            // Create a checkbox input
            let input = document.createElement('input')
            input.type = "checkbox"
            // Link to label tag
            input.name = "cue-" + i
            input.id = "cue-" + i
            // Hide input so it is not visible to the user
            input.hidden = true
            // Set dataset value so cue number can be read
            input.dataset.cueNumber = sequence.cuesOrder[i]
            // Append both the input and label to the cue list
            document.getElementById('cues-cuelist').append(input)
            document.getElementById('cues-cuelist').append(label)
        }
        // Update styling so it allows for all cues
        document.getElementById('cues-cuelist').style.gridTemplateRows = "repeat(" + sequence.cuesOrder.length + ", calc(var(--scale)*4))"
        // Reset selected cue
        sequenceManager.selectedCue = null
        // Scroll the cue list to the current cue
        this.scrollCueList()
    }

    // Function to update the sequence list
    updateSequencesList(){
        // Clear sequence list
        document.getElementById('sequences-sequencelist').innerHTML = ""
        // Loop through all sequences
        let keys = Object.keys(sequenceManager.sequences)
        for(let i=0;i<keys.length;i++){
            // Create a label element to display sequence name
            let label = document.createElement('label')
            label.innerHTML = keys[i]
            // Add a selected class if it is the selected sequence
            if(sequenceManager.selectedSequence == keys[i]){
                label.classList.add("selected")
            }
            // Select the sequence when it is clicked
            label.onclick = function(){
                sequenceManager.selectSequence(keys[i])
            }
            // Append the label to the cue list
            document.getElementById('sequences-sequencelist').append(label)
        }
        // Update styling so it allows for all sequences
        document.getElementById('sequences-sequencelist').style.gridTemplateRows = "repeat(" + keys.length + ", calc(var(--scale)*4))"
    }

    // Function to update the palette list
    updatePalettesList(){
        // Clear palette list
        document.getElementById('palettes-palettelist').innerHTML = ""
        // Loop through all palettes
        let keys = Object.keys(paletteManager.palettes[this.attribute])
        for(let i=0;i<keys.length;i++){
            // Create a label element to display the palette name
            let label = document.createElement('label')
            label.innerHTML = keys[i]
            let that = this
            // Add a selected class if it is the selected palette
            if(paletteManager.selectedPalette[0] == this.attribute && paletteManager.selectedPalette[1] == keys[i]){
                label.classList.add("selected")
            }
            // Select the palette when it is clicked
            label.onclick = function(){
                paletteManager.selectPalette(that.attribute,keys[i])
            }
            // Append the label to the cue list
            document.getElementById('palettes-palettelist').append(label)
        }
        // Update styling so it allows for all palettes
        document.getElementById('palettes-palettelist').style.gridTemplateRows = "repeat(" + keys.length + ", calc(var(--scale)*4))"
    }

    // Function to scroll the cue list to the current cue
    scrollCueList(){
        // Get the cue list and selected sequence
        let cueList = document.querySelectorAll("#cues-cuelist label")
        let name = sequenceManager.selectedSequence
        // Calculate the position of the cue
        let j = sequenceManager.sequences[name].cuesOrder.indexOf(sequenceManager.sequences[name].currentCue)
        // If cue exists then scroll to the position of that cue
        if(cueList[j]){
            // Offset by 3 so cue appears central
            document.getElementById('cues-cuelist').scrollTo({top: cueList[j].scrollHeight * (j-3), behavior: 'smooth'})
        }
    }

    // Function to update the attributes list
    updateAttributes(){
        // Create temporary arrays to add values into
        let attributes = []
        let attributeValues = []
        let manual = []
        let bits = []
        // Loop through the selected fixtures
        if(fixtureManager.selectedFixtures.length > 0){
            for(let i=0;i<fixtureManager.selectedFixtures.length;i++){
                let fixture = fixtureManager.fixtures[fixtureManager.selectedFixtures[i]]
                // Update the DMX output
                dmx.update()
                // Create temporary variables for fixture data and data types from the DMX output
                let fixtureData = dmx.getFixtureData(fixture.name)
                let fixtureDataTypes = dmx.getFixtureDataTypes(fixture.name)
                // Loop through fixture data
                for(let j=0;j<fixtureData.length;j++){
                    // Only run if the channel has the same attribute we have selected
                    if(fixture.channelTypes[j] == this.attribute){
                        // Get position of channel in the attributes array
                        let index = attributes.indexOf(fixture.channelNames[j])
                        // If channel doesn't exist in the attributes array then add it
                        if(index == -1){
                            // Add channel data
                            attributes.push(fixture.channelNames[j])
                            attributeValues.push(fixtureData[j])
                            // Set data type accordingly
                            if(fixtureDataTypes[j] == "manual"){
                                manual.push("manual")
                            } else if(fixtureDataTypes[j] == "sequence" && manual[j] != "manual"){
                                manual.push("sequence")
                            } else {
                                manual.push("default")
                            }
                            // Set bits to 1 as only one channel is being used
                            bits.push(1)
                        // If channel does already exist we need to compare values
                        } else {
                            // Update data types using the priority
                            if(fixtureDataTypes[j] == "manual"){
                                manual[index] = "manual"
                            } else if(fixtureDataTypes[j] == "sequence" && manual[index] != "manual"){
                                manual[index] = "sequence"
                            } else if(manual[index] != "sequence" && manual[index] != "manual") {
                                manual[index] = "default"
                            }
                            // If there is no fine channel then compare the channel against itself
                            if(fixture.channelNames[j].indexOf("Fine") == -1){
                                // Update channel data to take the largest value
                                if(fixtureData[j] > attributeValues[index] && fixture.channelNames[j+1].indexOf("Fine") == -1){
                                    attributeValues[index] = fixtureData[j]
                                }
                            // If there is a fine channel then these need to be merged for comparison
                            } else {
                                // Merge channels to compare largest and update both channels if it is larger
                                if((fixtureData[j-1] << 8) + fixtureData[j] > (attributeValues[index-1] << 8) + attributeValues[index]){
                                    attributeValues[index-1] = fixtureData[j-1]
                                    attributeValues[index] = fixtureData[j]
                                }
                            }
                        }
                        // Check if a fine channel exists and set channel bits to 2 meaning 2 channels are used for this parameter
                        if(fixture.channelNames[j].indexOf("Fine") != -1){
                            let index = attributes.indexOf(fixture.channelNames[j].replace("Fine ",""))
                            bits[index] = 2
                        }
                    }
                }
            }
        }
        // Initialise temporary variables
        let offset = 0
        let count = 0
        // Loop through the attributes page with an offset for the attribute page
        for(let i=0;i<Math.max(attributes.length,5*(this.attributePage+1)) && count<5;i++){
            // Add in offset
            let j=i+offset
            // Doesn't do anything
            if(j<attributes.length){
                if(attributes[j].indexOf("Fine") != -1){
                    continue
                }
            }
            // Get the next HTML button
            let button = document.querySelectorAll('#attribute-values button')[count]
            // Set button classes based on manual or sequence channels
            button.classList.remove("manual-channel")
            button.classList.remove("sequence-channel")
            if(manual[j] == "manual"){
                button.classList.add("manual-channel")
            } else if(manual[j] == "sequence") {
                button.classList.add("sequence-channel")
            }
            // Store bits value into the button
            button.dataset.bits = bits[j]
            // If bits is 1 then store one channels data into the button
            if(bits[j] == 1){
                if(i >= this.attributePage*5){
                    button.innerHTML = (attributes[j] || "") + ((attributes[j] || "") && "<br>") + ((attributes[j] || "") && (attributeValues[j] || 0))
                    count++
                }
            // If 2 bits are used then merge channels and store the result
            } else {
                if(i >= this.attributePage*5){
                    button.innerHTML = (attributes[j] || "") + ((attributes[j] || "") && "<br>") + ((attributes[j] || "") && ((attributeValues[j] << 8) + attributeValues[j+1] || 0))
                    count++
                }
                // Increase offset so fine channel is skipped
                offset++
            }
        }
    }
}