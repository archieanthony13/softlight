class Cue{
    constructor(name){
        // Initialise all variables and data structures required for cues
        this.data = {}
        this.dataTypes = {}
        this.name = name
        this.timings = {"fade":{"dimmer up":0,"dimmer down":0,"color":0,"position":0,"beam":0,"shape":0},"delay":{"dimmer up":0,"dimmer down":0,"color":0,"position":0,"beam":0,"shape":0}}
        this.totalTime = 0
        this.beforeState = {}
        this.percentage = null

        this.active = false
        this.activatedTime = null
    }

    // Function to store manual channel data into the cue
    store(timings, mode){
        if(mode === undefined || mode == "overwrite"){
            // Overwrite mode
            // Copies the fixtures manual channels straight into the cue
            let fixtures = fixtureManager.fixtures
            for(let i=0;i<fixtures.length;i++){
                this.data[fixtures[i].name] = JSON.parse(JSON.stringify(fixtures[i].manualChannels))
                this.dataTypes[fixtures[i].name] = JSON.parse(JSON.stringify(fixtures[i].channelTypes))
            }
            this.timings = timings
        } else if(mode == "merge"){
            // Merge mode
            // Copies the fixtures manual channels into the cue only if there is a value so anything already stored in the cue is kept
            let fixtures = fixtureManager.fixtures
            for(let i=0;i<fixtures.length;i++){
                // If fixture doesn't exist in the data then give it a temporary blank array so code doesn't error
                if(this.data[fixtures[i].name] === undefined){
                    this.data[fixtures[i].name] = []
                }
                // Loop through fixture manual channels
                for(let j=0;j<fixtures[i].manualChannels.length;j++){
                    // If channel has a value then it is stored into the cue data
                    if(fixtures[i].manualChannels[j] !== false){
                        this.data[fixtures[i].name][j] = JSON.parse(JSON.stringify(fixtures[i].manualChannels[j]))
                    // If fixture doesn't have a value then it is set to false
                    } else if(this.data[fixtures[i].name][j] === undefined){
                        this.data[fixtures[i].name][j] = false
                    }
                }
                // Update data types as overwrite mode as these values cannot be merged
                this.dataTypes[fixtures[i].name] = JSON.parse(JSON.stringify(fixtures[i].channelTypes))
            }

            // Merge the timing values in the same way as manual channels
            let timingKeys = Object.keys(this.timings)
            for(let i=0;i<timingKeys.length;i++){
                let fadeDelayKeys = Object.keys(this.timings[timingKeys[i]])
                for(let j=0;j<fadeDelayKeys.length;j++){
                    if(!isNaN(timings[timingKeys[i]][fadeDelayKeys[j]])){
                        this.timings[timingKeys[i]][fadeDelayKeys[j]] = timings[timingKeys[i]][fadeDelayKeys[j]]
                    }
                }
            }
        }
        // If the timings variable is not given then the values are all set to 0
        if(timings === undefined){
            this.timings = {"fade":{"dimmer up":0,"dimmer down":0,"color":0,"position":0,"beam":0,"shape":0},"delay":{"dimmer up":0,"dimmer down":0,"color":0,"position":0,"beam":0,"shape":0}}
        }
        // Update the total time it takes for the cue to run
        this.updateTotalTime()
    }

    // Function to rename the cue
    rename(name){
        this.name = name
        ui.updateCueList()
    }

    // Function to activate the cue
    go(){
        this.active = true
        this.activatedTime = null
        this.percentage = null
        let fixtures = fixtureManager.fixtures
        // Sets the current state of fixture channels before the cue is run to allow for fades
        for(let i=0;i<fixtures.length;i++){
            this.beforeState[fixtures[i].name] = JSON.parse(JSON.stringify(dmx.getFixtureData(fixtures[i].name)))
        }
    }

    // Function to update the total time it takes for the cue to run
    updateTotalTime(){
        let totalTime = [0,0,0,0,0,0]
        let timingKeys = Object.keys(this.timings)
        // Loop through all fades and delays per attribute
        for(let i=0;i<timingKeys.length;i++){
            let timingAttributes = Object.keys(this.timings[timingKeys[i]])
            for(let j=0;j<timingAttributes.length;j++){
                totalTime[j] += (this.timings[timingKeys[i]][timingAttributes[j]] || 0)
            }
        }
        // Find the largest time
        this.totalTime = totalTime.sort((a,b) => b-a)[0]
    }

    // Function to delete a fixture from the cue data given its name
    deleteFixtureByName(fixtureName){
        delete this.data[fixtureName]
    }

    // Update function which runs the fades and delays for the cue
    update(timestamp, sequence, cue){
        // Only runs if the cue has been activated and this cue is equal to or less than the current cue
        if(this.active && sequenceManager.sequences[sequence].currentCue >= cue){
            // On activation set the activatedTime to be the timestamp given by the main update function
            if(this.activatedTime === null){
                this.activatedTime = timestamp
            }
            // Work out how long this cue has been running for
            let activeTime = timestamp - this.activatedTime
            // Calculate percentage for gradient
            this.percentage = (activeTime/(this.totalTime * 60))*100
            // If the cue has finished running then it is deactivated
            if(activeTime >= this.totalTime * 60){
                this.active = false
                this.activatedTime = null
                this.percentage = null
            }
            // Loop through all cue data to update channels
            let keys = Object.keys(this.data)
            for(let i=0;i<keys.length;i++){
                let fixture = keys[i]
                let channels = JSON.parse(JSON.stringify(this.data[fixture]))
                for(let j=0;j<channels.length;j++){
                    let channelType = this.dataTypes[fixture][j]
                    if(channels[j] !== false){
                        // If the channel is holding an array then it is referencing a palette
                        if(channels[j] instanceof Array){
                            // Replace channel data to be the data stored in the palette
                            channels[j] = paletteManager.palettes[channels[j][0]][channels[j][1]].data[fixture][j]
                        }
                        // If the channel type is dimmer then decide whether it is up or down
                        if(channelType == "dimmer"){
                            if(channels[j] > this.beforeState[fixture][j]){
                                channelType = "dimmer up"
                            } else {
                                channelType = "dimmer down"
                            }
                        }
                        // Run fade and delay times by only running if the time is larger than the delay but less than the delay and fade combined
                        if(activeTime >= (this.timings["delay"][channelType] || 0) * 60
                        && activeTime - (this.timings["delay"][channelType] || 0) * 60 <= (this.timings["fade"][channelType] || 0) * 60){
                            // Work out the change in channel data from the initial fixture state
                            let change = (channels[j] - this.beforeState[fixture][j])/((this.timings["fade"][channelType] || 0) * 60)
                            // Update fixture sequence channels
                            if(change !== Infinity && change !== -Infinity && !isNaN(change)){
                                fixtureManager.getFixture(fixture).updateFixtureChannelByIndex(j,this.beforeState[fixture][j] + (change * (activeTime - (this.timings["delay"][channelType] || 0) * 60)), sequence)
                            // If the change variable is Infinity, -Infinity or NaN then there is no fade
                            } else {
                                fixtureManager.getFixture(fixture).updateFixtureChannelByIndex(j,channels[j], sequence)
                            }
                        }
                    }
                }
            }
            // Update the UI attributes section so values update live
            ui.updateAttributes()
        // Deactivate the cue if going back to a previous cue in the cue list
        } else {
            this.active = false
            this.activatedTime = null
            this.percentage = null
        }
    }

    // Function which ignores all fades and delays and snaps instantly to values
    track(name){
        this.active = false
        this.activatedTime = null
        this.percentage = null
        let keys = Object.keys(this.data)
        // Loop through all fixtures
        for(let i=0;i<keys.length;i++){
            let fixture = keys[i]
            let channels = this.data[fixture]
            for(let j=0;j<channels.length;j++){
                if(channels[j] !== false){
                    // Update fixture sequence channels
                    // If the channel is holding an array then it is referencing a palette
                    if(channels[j] instanceof Array){
                        fixtureManager.getFixture(fixture).updateFixtureChannelByIndex(j,paletteManager.palettes[channels[j][0]][channels[j][1]].data[fixture][j],name)
                    } else {
                        fixtureManager.getFixture(fixture).updateFixtureChannelByIndex(j,channels[j],name)
                    }
                }
            }
        }
    }
}