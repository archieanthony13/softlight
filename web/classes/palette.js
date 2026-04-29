class Palette{
    constructor(dataType){
        // Initialise dictionaries to store palette data
        this.data = {}
        this.dataType = dataType
    }

    // Function to store manual channel data into the palette
    store(mode){
        if(mode === undefined || mode == "overwrite"){
            // Overwrite mode
            // Copies the fixtures manual channels straight into the palette
            let fixtures = fixtureManager.fixtures
            for(let i=0;i<fixtures.length;i++){
                this.data[fixtures[i].name] = JSON.parse(JSON.stringify(fixtures[i].manualChannels))
            }
            this.timings = timings
        } else if(mode == "merge"){
            // Merge mode
            // Copies the fixtures manual channels into the palette only if there is a value so anything already stored in the palette is kept
            let fixtures = fixtureManager.fixtures
            for(let i=0;i<fixtures.length;i++){
                // If fixture doesn't exist in the data then give it a temporary blank array so code doesn't error
                if(this.data[fixtures[i].name] === undefined){
                    this.data[fixtures[i].name] = []
                }
                // Loop through fixture manual channels
                for(let j=0;j<fixtures[i].manualChannels.length;j++){
                    // Check if channel matches the attribute the palette belongs to
                    if(fixtures[i].channelTypes[j] == this.dataType){
                        // If channel has a value then it is stored into the cue data
                        if(fixtures[i].manualChannels[j] !== false){
                            this.data[fixtures[i].name][j] = JSON.parse(JSON.stringify(fixtures[i].manualChannels[j]))
                        // If fixture doesn't have a value then it is set to false
                        } else if(this.data[fixtures[i].name][j] === undefined){
                            this.data[fixtures[i].name][j] = false
                        }
                    // If channel type doesn't match then set values to false
                    } else {
                        this.data[fixtures[i].name][j] = false
                    }
                }
            }
        }
    }
}