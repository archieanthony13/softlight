class SequenceManager{
    constructor(){
        // Initialise menu elements
        this.cueMenuElement = document.querySelector('.menu#cue-menu')
        this.cueMenuElementBottom = this.cueMenuElement.querySelector(".menu-bottom-section.cue-settings")
        this.sequenceMenuElement = document.querySelector('.menu#sequence-menu')
        this.sequenceMenuElementBottom = this.sequenceMenuElement.querySelector(".menu-bottom-section")
        this.menuActive = false
        // Initialise sequence variables
        this.sequences = {}
        this.selectedSequence = "1"
        this.selectedCue = null

        // DOM button events within the cue menus
        let that = this
        // Updates selected cue when a cue is clicked on
        document.getElementById('cues-cuelist').onchange = function(){
            that.updateSelectedCue()
        }
        // Exit the cue menu
        this.cueMenuElement.querySelector("button#exit-cue").onclick = function(){
            that.toggleCueMenu()
        }
        // Edit the selected cue
        this.cueMenuElement.querySelector("button#exit-edit-cue").onclick = function(){
            that.toggleCueMenu()
        }
        // Store to a cue
        this.cueMenuElement.querySelector("button#cue-store").onclick = function(){
            // Close the menu
            that.toggleCueMenu()
            // Get user input
            let cueNumber = parseFloat(that.cueMenuElement.querySelector("input#cue-settings-cue-number").value)
            let cueName = that.cueMenuElement.querySelector("input#cue-settings-cue-name").value
            let timings = {
                "fade":{
                    "dimmer up":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-fade-dimmer-up").value)),
                    "dimmer down":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-fade-dimmer-down").value)),
                    "color":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-fade-color").value)),
                    "position":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-fade-position").value)),
                    "beam":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-fade-beam").value)),
                    "shape":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-fade-shape").value))
                },
                "delay":{
                    "dimmer up":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-delay-dimmer-up").value)),
                    "dimmer down":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-delay-dimmer-down").value)),
                    "color":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-delay-color").value)),
                    "position":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-delay-position").value)),
                    "beam":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-delay-beam").value)),
                    "shape":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-delay-shape").value))
                }
            }
            let mode = that.cueMenuElement.querySelector("select#cue-settings-store-mode").value
            // Store into the cue
            that.store(cueNumber, undefined, cueName, timings, mode)
        }
        // Store edits to a cue
        this.cueMenuElement.querySelector("button#cue-edit-save").onclick = function(){
            // Close the menu
            that.toggleCueMenu()
            // Get user input
            let cueNumber = parseFloat(that.cueMenuElement.querySelector("input#cue-edit-settings-cue-number").value)
            let cueName = that.cueMenuElement.querySelector("input#cue-edit-settings-cue-name").value
            let timings = {
                "fade":{
                    "dimmer up":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-fade-dimmer-up").value)),
                    "dimmer down":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-fade-dimmer-down").value)),
                    "color":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-fade-color").value)),
                    "position":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-fade-position").value)),
                    "beam":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-fade-beam").value)),
                    "shape":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-fade-shape").value))
                },
                "delay":{
                    "dimmer up":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-delay-dimmer-up").value)),
                    "dimmer down":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-delay-dimmer-down").value)),
                    "color":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-delay-color").value)),
                    "position":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-delay-position").value)),
                    "beam":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-delay-beam").value)),
                    "shape":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-delay-shape").value))
                }
            }
            // Update changes
            that.sequences[that.selectedSequence].cues[that.selectedCue].timings = timings
            that.sequences[that.selectedSequence].cues[that.selectedCue].updateTotalTime()
            that.sequences[that.selectedSequence].cues[that.selectedCue].name = cueName
            that.moveCue(that.selectedSequence,that.selectedCue,cueNumber)
            that.updateSelectedCue()
        }
        // Open to the cue settings tab
        this.cueMenuElement.querySelector("button#cue-settings").onclick = function(){
            that.cueSettingsMenu()
        }
        // Open the cue timings tab
        this.cueMenuElement.querySelector("button#cue-timings").onclick = function(){
            that.cueTimingsMenu()
        }
        // Open the cue settings tab in the edit menu
        this.cueMenuElement.querySelector("button#cue-edit-settings").onclick = function(){
            that.cueEditSettingsMenu()
        }
        // Open the cue timings tab in the edit menu
        this.cueMenuElement.querySelector("button#cue-edit-timings").onclick = function(){
            that.cueTimingsMenu()
        }

        // Exit the sequence menu
        this.sequenceMenuElement.querySelector("button#exit-sequence").onclick = function(){
            that.toggleSequenceMenu()
        }
        // Create a sequence
        this.sequenceMenuElement.querySelector("button#sequence-create-sequence").onclick = function(){
            // get user input
            let name = that.sequenceMenuElementBottom.querySelector("input").value
            // Create sequence
            that.createSequence(name)
            // Close menu
            that.toggleSequenceMenu()
        }
    }

    // Function to create a sequence
    createSequence(name){
        // Create sequence object
        this.sequences[name] = new Sequence(name)
        // Select the sequence
        this.selectedSequence = name
        // Update the sequence list
        ui.updateSequencesList()
        // Create an empty Cue 0
        this.createEmptyCue(name,0,"Cue 0")
    }

    // Function to delete a fixture by name
    deleteFixtureByName(fixtureName){
        // Loop through all sequences
        let keys = Object.keys(this.sequences)
        for(let i=0;i<keys.length;i++){
            // Delete the fixture from the sequence
            this.sequences[keys[i]].deleteFixtureByName(fixtureName)
        }
    }

    // Function to create a new empty cue
    createEmptyCue(name, cueNumber, cueName){
        // Check if sequence name exists
        let index = Object.keys(this.sequences).indexOf(name)
        // If sequence name exists then create an empty cue in it
        if(index != -1){
            this.sequences[name].createEmptyCue(cueNumber, cueName)
        // If sequence doesn't exist then create an empty cue in the selected sequence
        } else {
            this.sequences[this.selectedSequence].createEmptyCue(cueNumber, cueName)
        }
        // Update the cue list
        ui.updateCueList()
    }

    // Function to delete a cue
    deleteCue(name, cueNumber){
        // Check if sequence name exists
        let index = Object.keys(this.sequences).indexOf(name)
        // If sequence name exists then delete the cue from it
        if(index != -1){
            this.sequences[name].deleteCue(cueNumber)
        // If sequence doesn't exist then delete the cue from the selected sequence
        } else {
            this.sequences[this.selectedSequence].deleteCue(cueNumber)
        }
        // Update the cue list
        ui.updateCueList()
    }

    // Function to move a cue
    moveCue(name, cueNumber, newNumber){
        // Check if sequence name exists
        let index = Object.keys(this.sequences).indexOf(name)
        // If sequence name exists then move the cue to the new cue position
        if(index != -1){
            this.sequences[name].moveCue(cueNumber, newNumber)
        // If sequence doesn't exist then move the cue to the new cue position in the selected sequence
        } else {
            this.sequences[this.selectedSequence].moveCue(cueNumber, newNumber)
        }
        // Update the cue list
        ui.updateCueList()
    }

    // Function to delete a sequence
    deleteSequence(name){
        // Check if sequence name exists
        let index = Object.keys(this.sequences).indexOf(name)
        // If sequence doesn't exist then take the selected sequence
        if(index == -1){
            name = this.selectedSequence
        }
        // Delete the sequence
        delete this.sequences[name]
        // Loop through all fixtures and remove the sequence channels
        for(let i=0;i<fixtureManager.fixtures.length;i++){
            delete fixtureManager.fixtures[i].sequenceChannels[name]
        }
        // Update accordingly
        ui.updateSequencesList()
        ui.updateCueList()
    }

    // Function to select a sequence
    selectSequence(name){
        // Select the sequence
        this.selectedSequence = name
        // Update accordingly
        ui.updateCueList()
        ui.updateSequencesList()
    }

    // Function to store into a sequence
    store(cueNumber, name, cueName, timings, mode){
        // Check if sequence name exists
        let index = Object.keys(this.sequences).indexOf(name)
        // If sequence name exists then store into the cue
        if(index != -1){
            // If cue doesn't exist then create a new cue
            if(cueNumber === undefined || isNaN(cueNumber)){
                // Generate a cue number by going up to the next whole number
                cueNumber = (Math.floor(this.sequences[name].lastCue) + 1 || 0)
                // If a cue name is not given then generate one
                if(cueName === undefined || cueName == ""){
                    cueName = "Cue " + cueNumber
                }
                // Create the empty cue
                this.createEmptyCue(name, cueNumber, cueName)
            }
            // Store into the cue
            this.sequences[name].store(cueNumber, cueName, timings, mode)
        // If sequence name doesn't exist then store into the selected sequence
        } else {
            // If cue doesn't exist then create a new cue
            if(cueNumber === undefined || isNaN(cueNumber)){
                // Generate a cue number by going up to the next whole number
                cueNumber = (Math.floor(this.sequences[this.selectedSequence].lastCue) + 1 || 0)
                // If a cue name is not given then generate one
                if(cueName === undefined || cueName == ""){
                    cueName = "Cue " + cueNumber
                }
                this.createEmptyCue(this.selectedSequence, cueNumber, cueName)
            }
            // Store into the cue
            this.sequences[this.selectedSequence].store(cueNumber, cueName, timings, mode)
        }
        // Update the cue list
        ui.updateCueList()
    }

    // Function to activate a cue
    go(name){
        // Check if sequence name exists
        let index = Object.keys(this.sequences).indexOf(name)
        // If sequence doesn't exist then take the selected sequence
        if(index == -1){
            name = this.selectedSequence
        }
        // If there is a selected cue then track to it
        if(this.selectedCue !== null){
            this.sequences[name].trackToCue(this.selectedCue)
        // Go to the next cue
        } else {
            this.sequences[name].go()
        }
        // If the activated cue is in the selected sequence then scroll the cue list
        if(name == this.selectedSequence){
            ui.scrollCueList()
        }
    }

    // Function to toggle the cue menu
    toggleCueMenu(){
        // Toggle menu active
        this.menuActive = !this.menuActive
        if(this.menuActive){
            // Show menu
            this.cueMenuElement.style.display = "grid"
            // Set background opacity
            document.querySelector(".container").style.opacity = "0.25"
            // Clear inputs
            let inputs = this.cueMenuElement.querySelectorAll("input")
            for(let i=0;i<inputs.length;i++){
                inputs[i].value = ""
            }
            // Ensure the edit menu is not being displayed
            document.getElementById('cue-store-section').style.display = "grid"
            document.getElementById('cue-edit-section').style.display = "none"
            // Open the cue settings tab
            this.cueSettingsMenu()
        } else {
            // Close menu
            this.cueMenuElement.style.display = "none"
            // Reset background opacity
            document.querySelector(".container").style.opacity = "1"
        }
    }

    // Function to toggle the cue edit menu
    toggleEditCueMenu(){
        // Toggle menu active
        this.menuActive = !this.menuActive
        if(this.menuActive){
            // Show menu
            this.cueMenuElement.style.display = "grid"
            // Set background opacity
            document.querySelector(".container").style.opacity = "0.25"
            // Fill inputs with cue data
            let inputs = this.cueMenuElement.querySelectorAll(".cue-edit-settings input")
            inputs[0].value = this.selectedCue
            inputs[1].value = sequenceManager.sequences[this.selectedSequence].cues[this.selectedCue].name
            inputs = this.cueMenuElement.querySelectorAll(".cue-timings input")
            inputs[0].value = sequenceManager.sequences[this.selectedSequence].cues[this.selectedCue].timings.fade["dimmer up"]
            inputs[1].value = sequenceManager.sequences[this.selectedSequence].cues[this.selectedCue].timings.fade["dimmer down"]
            inputs[2].value = sequenceManager.sequences[this.selectedSequence].cues[this.selectedCue].timings.fade["color"]
            inputs[3].value = sequenceManager.sequences[this.selectedSequence].cues[this.selectedCue].timings.fade["position"]
            inputs[4].value = sequenceManager.sequences[this.selectedSequence].cues[this.selectedCue].timings.fade["beam"]
            inputs[5].value = sequenceManager.sequences[this.selectedSequence].cues[this.selectedCue].timings.fade["shape"]
            inputs[6].value = sequenceManager.sequences[this.selectedSequence].cues[this.selectedCue].timings.delay["dimmer up"]
            inputs[7].value = sequenceManager.sequences[this.selectedSequence].cues[this.selectedCue].timings.delay["dimmer down"]
            inputs[8].value = sequenceManager.sequences[this.selectedSequence].cues[this.selectedCue].timings.delay["color"]
            inputs[9].value = sequenceManager.sequences[this.selectedSequence].cues[this.selectedCue].timings.delay["position"]
            inputs[10].value = sequenceManager.sequences[this.selectedSequence].cues[this.selectedCue].timings.delay["beam"]
            inputs[11].value = sequenceManager.sequences[this.selectedSequence].cues[this.selectedCue].timings.delay["shape"]
            // Ensure the store menu is not being displayed
            document.getElementById('cue-store-section').style.display = "none"
            document.getElementById('cue-edit-section').style.display = "grid"
            // Open the cue edit settings tab
            this.cueEditSettingsMenu()
        } else {
            // Close menu
            this.cueMenuElement.style.display = "none"
            // Reset background opacity
            document.querySelector(".container").style.opacity = "1"
        }
    }

    // Function to open the cue settings tab
    cueSettingsMenu(){
        this.cueMenuElementBottom = this.cueMenuElement.querySelector(".menu-bottom-section.cue-settings")
        this.cueMenuElement.querySelector('.menu-bottom-section.cue-settings').style.display = "grid"
        this.cueMenuElement.querySelector('.menu-bottom-section.cue-edit-settings').style.display = "none"
        this.cueMenuElement.querySelector('.menu-bottom-section.cue-timings').style.display = "none"
        this.cueMenuElement.querySelector("button#cue-settings").classList.add("selected")
        this.cueMenuElement.querySelector("button#cue-edit-settings").classList.remove("selected")
        this.cueMenuElement.querySelector("button#cue-timings").classList.remove("selected")
        this.cueMenuElement.querySelector("button#cue-edit-timings").classList.remove("selected")
    }

    // Function to open the cue edit settings tab
    cueEditSettingsMenu(){
        this.cueMenuElementBottom = this.cueMenuElement.querySelector(".menu-bottom-section.cue-edit-settings")
        this.cueMenuElement.querySelector('.menu-bottom-section.cue-settings').style.display = "none"
        this.cueMenuElement.querySelector('.menu-bottom-section.cue-edit-settings').style.display = "grid"
        this.cueMenuElement.querySelector('.menu-bottom-section.cue-timings').style.display = "none"
        this.cueMenuElement.querySelector("button#cue-settings").classList.remove("selected")
        this.cueMenuElement.querySelector("button#cue-edit-settings").classList.add("selected")
        this.cueMenuElement.querySelector("button#cue-timings").classList.remove("selected")
        this.cueMenuElement.querySelector("button#cue-edit-timings").classList.remove("selected")
    }

    // Function to open the cue timings tab
    cueTimingsMenu(){
        this.cueMenuElementBottom = this.cueMenuElement.querySelector(".menu-bottom-section.cue-timings")
        this.cueMenuElement.querySelector('.menu-bottom-section.cue-settings').style.display = "none"
        this.cueMenuElement.querySelector('.menu-bottom-section.cue-edit-settings').style.display = "none"
        this.cueMenuElement.querySelector('.menu-bottom-section.cue-timings').style.display = "grid"
        this.cueMenuElement.querySelector("button#cue-settings").classList.remove("selected")
        this.cueMenuElement.querySelector("button#cue-edit-settings").classList.remove("selected")
        this.cueMenuElement.querySelector("button#cue-timings").classList.add("selected")
        this.cueMenuElement.querySelector("button#cue-edit-timings").classList.add("selected")
    }

    // Function to toggle the sequence menu
    toggleSequenceMenu(){
        // Toggle menu active
        this.menuActive = !this.menuActive
        if(this.menuActive){
            // Show menu
            this.sequenceMenuElement.style.display = "grid"
            // Set background opacity
            document.querySelector(".container").style.opacity = "0.25"
        } else {
            // Close menu
            this.sequenceMenuElement.style.display = "none"
            // Reset background opacity
            document.querySelector(".container").style.opacity = "1"
        }
    }

    // Function to update the selected cue
    updateSelectedCue(){
        // Get all selected cues
        // This can be an array between 0 or 2 items
        let selectedCues = document.querySelectorAll('#cues-cuelist input:checked')
        let newCue = null
        // If there are no selected cues then the variable is set to null
        if(selectedCues.length == 0){
            this.selectedCue = null
        }
        // If there is one selected cue then the variable is set to that cue
        else if(selectedCues.length == 1){
            this.selectedCue = parseFloat(selectedCues[0].dataset.cueNumber)
        // If there are two selected cues then we select the one that isn't already selected
        } else {
            // Loop through all selected cues
            for(let i=0;i<selectedCues.length;i++){
                // If cue is not the same as the current selected cue then it becomes the selected cue
                if(selectedCues[i].dataset.cueNumber != this.selectedCue){
                    newCue = parseFloat(selectedCues[i].dataset.cueNumber)
                // Uncheck the input so only one cue is selected
                } else {
                    selectedCues[i].checked = false
                }
            }
            // Update the selected cue
            this.selectedCue = newCue
        }
    }

    // Function to update sequences
    update(timestamp){
        // Get the HTML cue list
        let cueList = document.querySelectorAll("#cues-cuelist label")
        // Loop through all sequences
        let sequenceKeys = Object.keys(this.sequences)
        for(let i=0;i<sequenceKeys.length;i++){
            // Update the sequence
            this.sequences[sequenceKeys[i]].update(timestamp)
            // If it is the selected sequence then update the classes for cue rendering
            if(this.sequences[sequenceKeys[i]].name == this.selectedSequence){
                // Loop through all cues in the HTML cue list
                for(let j=0;j<cueList.length;j++){
                    // Remove all classes
                    cueList[j].classList.remove("current-cue")
                    cueList[j].classList.remove("active-cue")
                    // Add the active cue class if the cue is running
                    if(this.sequences[this.selectedSequence].cues[this.sequences[this.selectedSequence].cuesOrder[j]].active){
                        cueList[j].classList.add("active-cue")
                        // Give it a percentage for rendering gradient
                        cueList[j].style.setProperty("--percentage",this.sequences[this.selectedSequence].cues[this.sequences[this.selectedSequence].cuesOrder[j]].percentage + "%")
                    }
                    // Add the current cue class if it is the current cue
                    if(this.sequences[this.selectedSequence].cuesOrder[j] == this.sequences[this.selectedSequence].currentCue){
                        cueList[j].classList.add("current-cue")
                    }
                }
            }
        }
    }
}