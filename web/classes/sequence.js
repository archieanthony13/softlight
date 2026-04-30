class Sequence{
    constructor(name){
        // Initialise sequence data variables
        this.name = name
        this.cues = {}
        this.lastCue = 0
        this.currentCue = 0
        this.cuesOrder = []
    }

    // Function to create an empty cue
    createEmptyCue(cueNumber, cueName){
        // Create a new cue at the cue number given
        this.cues[parseFloat(cueNumber)] = new Cue(cueName)
        // Add this cue number to the cues order array
        this.cuesOrder.push(parseFloat(cueNumber))
        // Update necessary cue variables
        this.updateVariables()
    }

    // Function to delete a fixture from cue data by name
    deleteFixtureByName(fixtureName){
        // Loop through all cues and delete the fixture from the cue data
        for(let i=0;i<this.cuesOrder.length;i++){
            this.cues[this.cuesOrder[i]].deleteFixtureByName(fixtureName)
        }
    }

    // Function to store data into a cue
    store(cueNumber, cueName, timings, mode){
        // Check if cue exists
        let index = Object.keys(this.cues).indexOf(parseFloat(cueNumber).toString())
        // If cue exists then store data into it
        if(index != -1){
            this.cues[parseFloat(cueNumber)].store(timings, mode)
        // If cue doesn't exist then create a new cue and store
        } else {
            // Generate a cue name if it is not specified
            if(cueName === undefined || cueName == ""){
                cueName = "Cue " + cueNumber
            }
            // Create an empty cue
            this.createEmptyCue(cueNumber, cueName)
            // Store data into it
            this.cues[parseFloat(cueNumber)].store(timings, mode)
        }
    }

    // Function to activate a cue
    go(){
        // Get position of cue in the cue list
        let index = this.cuesOrder.indexOf(this.currentCue)
        // Check if the next cue is within the cue list
        if(index + 1 < this.cuesOrder.length){
            // Activate the next cue
            this.currentCue = this.cuesOrder[index+1]
            this.cues[this.currentCue].go()
        // If cue goes above the cue list then go back to cue 0
        } else {
            // Activate cue 0
            this.currentCue = this.cuesOrder[0]
            this.trackToCue(this.currentCue)
        }

    }

    // Function to delete a cue
    deleteCue(cueNumber){
        // Delete cue from dictionary
        delete this.cues[cueNumber]
        // Remove the cue number from the ordered cue list
        delete this.cuesOrder.splice(this.cuesOrder.indexOf(cueNumber),1)
        // Update necessary cue variables
        this.updateVariables()
    }

    // Function to move a cue
    moveCue(cueNumber, newNumber){
        // Ensure cue numbers are different
        if(cueNumber != newNumber){
            // Get current cue
            let cue = this.cues[cueNumber]
            // Save it to the new cue position
            this.cues[newNumber] = cue
            // Ensure new cue number doesn't exist
            if(this.cuesOrder.indexOf(newNumber) == -1){
                // Add new cue number to the ordered cue list
                this.cuesOrder.push(newNumber)
            }
            // If the original cue is the current cue then set the new cue number to the current cue
            if(this.currentCue == cueNumber){
                this.currentCue = newNumber
            }
            // Delete the original cue
            this.deleteCue(cueNumber)
        }
    }

    // Function to update necessary cue variables
    updateVariables(){
        // Update ordered cue list
        this.cuesOrder = this.cuesOrder.sort((a,b) => a-b)
        // Get the last cue number
        this.lastCue = this.cuesOrder[this.cuesOrder.length - 1]
    }

    // Function to update cues
    update(timestamp){
        // Loop through all cues and run their update function with the timestamp, sequence name and their cue position
        for(let i=0;i<this.cuesOrder.length;i++){
            this.cues[this.cuesOrder[i]].update(timestamp, this.name, this.cuesOrder[i])
        }
    }

    // Function to track to a specific cue
    trackToCue(cueNumber){
        // Loop through all fixtures and clear their sequence channels
        for(let i=0;i<fixtureManager.fixtures.length;i++){
            fixtureManager.fixtures[i].clearSequenceChannels(this.name)
        }
        // Loop through the cue list until the desired cue
        let iteration = this.cuesOrder.indexOf(cueNumber)
        for(let i=0;i<iteration;i++){
            this.cues[this.cuesOrder[i]].track(this.name)
        }
        // Run the desired cue
        this.currentCue = cueNumber
        this.cues[cueNumber].go()
        // Update the cue list
        ui.updateCueList()
    }
}