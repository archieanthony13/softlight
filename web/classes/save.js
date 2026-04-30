class Save{
    constructor(){
        // Initialise data variable
        this.data = {}

        // Function to create dialog box checking if the user wants to save when they try and close the software
        window.onbeforeunload = function(e){
            e.preventDefault()
        }
    }

    // Function to generate the save data
    generateSaveData(){
        // Create blank data dictionary
        this.data = {"fixtures":{},"sequences":{},"palettes":{"dimmer":{},"color":{},"position":{},"beam":{},"shape":{}},"data":{}}
        // Get all fixtures
        let fixtures = fixtureManager.fixtures
        // Loop through all the fixtures
        for(let i=0;i<fixtures.length;i++){
            let fixture = fixtures[i]
            // Add fixture data to the save data
            this.data.fixtures[fixture.name] = {
                "universe":fixture.universe,
                "channel":fixture.channel,
                "mode":fixture.mode,
                "fixtureProfile":fixture.fixtureProfile
            }
        }
        // Get all sequences
        let sequences = sequenceManager.sequences
        // Loop through all the sequences
        let keys = Object.keys(sequences)
        for(let i=0;i<keys.length;i++){
            let sequence = sequences[keys[i]]
            // Create a blank dictionary for the cues
            this.data.sequences[sequence.name] = {}
            // Get all cues
            let cues = sequence.cues
            // Loop through all the cues
            let cueKeys = Object.keys(cues)
            for(let j=0;j<cueKeys.length;j++){
                let cue = cues[cueKeys[j]]
                // Add cue data to the sequence within the save data
                this.data.sequences[sequence.name][cueKeys[j]] = {
                    "data":cue.data,
                    "dataTypes":cue.dataTypes,
                    "name":cue.name,
                    "timings":cue.timings
                }
            }
        }
        // Get all palettes
        let palettes = paletteManager.palettes
        // Loop through all the palette attributes
        keys = Object.keys(palettes)
        for(let i=0;i<keys.length;i++){
            let attribute = keys[i]
            // Create a blank dictionary for the palettes
            this.data.palettes[attribute] = {}
            // Loop through all the palettes
            let palKeys = Object.keys(palettes[attribute])
            for(let j=0;j<palKeys.length;j++){
                // Add palette data to the palette within the save data
                this.data.palettes[attribute][palKeys[j]] = palettes[attribute][palKeys[j]].data
            }
        }
        // Get additional data and add it into the save file
        this.data.data.selectedSequence = sequenceManager.selectedSequence
        this.data.data.artnet = {
            "ip":artnet.ip,
            "websocket":artnet.websocket
        }
        this.data.data.fileName = settingsMenu.settingsElement.querySelector('input#save-file-name').value
    }

    // Function to download the save data to a file
    saveToFile(){
        // Generate save data
        this.generateSaveData()
        // Create an element which will download the file
        let element = document.createElement('a')
        // Encode the save data into the file
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.data)))
        // Create file name
        let name = ""
        // If file name is given then save it with the date and time
        if(this.data.data.fileName){
            name = this.data.data.fileName + " " + new Date().toLocaleString().replaceAll("/","-").replaceAll(":","-") + ".json"
        // If file name is not given then save it as softlight with the date and time
        } else {
            name = "softlight " + new Date().toLocaleString().replaceAll("/","-").replaceAll(":","-") + ".json"
        }
        element.setAttribute('download', name)
        element.style.display = 'none'
        document.body.appendChild(element)
        // Download the file
        element.click()
        // Delete temporary element
        document.body.removeChild(element)
    }

    // Function to save data to local storage
    saveToBrowser(){
        // Generate save data
        this.generateSaveData()
        // Save it to the local storage
        localStorage.setItem("softlight-showfile",JSON.stringify(this.data))
    }

    // Function to clear save data
    clearData(){
        // Reset all fixtures, sequences and palettes
        fixtureManager.fixtures = []
        fixtureManager.selectedFixtures = []
        sequenceManager.sequences = {}
        paletteManager.palettes = {"dimmer":{},"color":{},"position":{},"beam":{},"shape":{}}
    }

    // Function to load the save data
    load(){
        // Get all fixtures from the save data
        let fixtures = this.data.fixtures
        // Loop through fixtures
        let keys = Object.keys(fixtures)
        for(let i=0;i<keys.length;i++){
            // Patch the fixture with save data
            fixtureManager.fixtures.push(new Fixture(fixtures[keys[i]].universe,fixtures[keys[i]].channel,fixtures[keys[i]].mode,fixtures[keys[i]].fixtureProfile,keys[i]))
        }
        // Get all sequences from the save data
        let sequences = this.data.sequences
        // Loop through all sequences
        keys = Object.keys(sequences)
        for(let i=0;i<keys.length;i++){
            // Create a new sequence with save data
            sequenceManager.sequences[keys[i]] = new Sequence(keys[i])
            // Get all cues from the save data
            let cues = sequences[keys[i]]
            // Loop through all cues
            let cueKeys = Object.keys(cues)
            for(let j=0;j<cueKeys.length;j++){
                // Add the cue to the sequence with all save data
                let cue = cues[cueKeys[j]]
                sequenceManager.sequences[keys[i]].cues[cueKeys[j]] = new Cue(cue.name)
                sequenceManager.sequences[keys[i]].cuesOrder.push(parseFloat(cueKeys[j]))
                sequenceManager.sequences[keys[i]].cues[cueKeys[j]].data = cue.data
                sequenceManager.sequences[keys[i]].cues[cueKeys[j]].dataTypes = cue.dataTypes
                sequenceManager.sequences[keys[i]].cues[cueKeys[j]].timings = cue.timings
                sequenceManager.sequences[keys[i]].cues[cueKeys[j]].updateTotalTime()
            }
            // Update necessary cue variables
            sequenceManager.sequences[keys[i]].updateVariables()
        }
        // Load additional sequence data
        sequenceManager.selectedSequence = this.data.data.selectedSequence
        // Get all palettes from the save data
        let palettes = this.data.palettes
        // Loop through all palette attributes
        keys = Object.keys(palettes)
        for(let i=0;i<keys.length;i++){
            // Get palettes for the attribute
            let attribute = keys[i]
            let palKeys = Object.keys(palettes[attribute])
            // Loop through all palettes
            for(let j=0;j<palKeys.length;j++){
                // Create the palette in the palette manager
                paletteManager.createPalette(attribute,palKeys[j])
                paletteManager.palettes[attribute][palKeys[j]].data = palettes[attribute][palKeys[j]]
            }
        }
        // Load additional data
        artnet.changeIp(this.data.data.artnet.ip)
        artnet.changeWebsocket(this.data.data.artnet.websocket)
        settingsMenu.settingsElement.querySelector('input#save-file-name').value = this.data.data.fileName
        // Run final loaded update function
        this.loaded()
    }

    // Function to load save data from a file
    loadFromFile(){
        // Clear all data
        this.clearData()
        // Create a temporary input element
        let element = document.createElement('input')
        element.type = "file"
        // Load the file
        let that = this
        element.onchange = function(){
            let filereader = new FileReader()
            filereader.onload = async function(){
                // Set the save data from the file and load it
                that.data = JSON.parse(filereader.result)
                that.load()
            }
            filereader.readAsText(element.files[0])
        }
        // Open the input dialog
        element.click()
    }

    // Function to load save data from local storage
    loadFromBrowser(){
        // If local storage exists then load data
        if(localStorage.getItem("softlight-showfile") !== null){
            // Clear all data
            this.clearData()
            // Load from local storage
            this.data = JSON.parse(localStorage.getItem("softlight-showfile"))
            this.load()
        // If no local storage then create a blank show file to prevent errors
        } else {
            this.newShowfile()
        }
    }

    // Function to run update functions once loaded
    loaded(){
        ui.updateFixtureList()
        ui.updateAttributes()
        ui.updateSequencesList()
        ui.updatePalettesList()
        ui.updateCueList()
    }

    // Function to create a blank show file
    newShowfile(){
        // Clear all data
        this.clearData()
        // Create blank save data and load it
        this.data = {"fixtures":{},"sequences":{},"palettes":{"dimmer":{},"color":{},"position":{},"beam":{},"shape":{}},"data":{"selectedSequence":"","artnet":{"ip":"0.0.0.0","websocket":"ws://localhost:8765"},"fileName":""}}
        this.load()
    }
}