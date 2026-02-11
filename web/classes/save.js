class Save{
    constructor(){
        this.data = {"fixtures":{},"sequences":{},"palettes":{"dimmer":{},"color":{},"position":{},"beam":{},"shape":{}},"data":{}}

        // window.onbeforeunload = function(e){
        //     e.preventDefault()
        // }
    }

    generateSaveData(){
        this.data = {"fixtures":{},"sequences":{},"palettes":{"dimmer":{},"color":{},"position":{},"beam":{},"shape":{}},"data":{}}
        let fixtures = fixtureManager.fixtures
        for(let i=0;i<fixtures.length;i++){
            let fixture = fixtures[i]
            this.data.fixtures[fixture.name] = {
                "channel":fixture.channel,
                "mode":fixture.mode,
                "fixtureProfile":fixture.fixtureProfile
            }
        }
        let sequences = sequenceManager.sequences
        let keys = Object.keys(sequences)
        for(let i=0;i<keys.length;i++){
            let sequence = sequences[keys[i]]
            this.data.sequences[sequence.name] = {}
            let cues = sequence.cues
            let cueKeys = Object.keys(cues)
            for(let j=0;j<cueKeys.length;j++){
                let cue = cues[cueKeys[j]]
                this.data.sequences[sequence.name][cueKeys[j]] = {
                    "data":cue.data,
                    "dataTypes":cue.dataTypes,
                    "name":cue.name,
                    "timings":cue.timings
                }
            }
        }
        let palettes = paletteManager.palettes
        keys = Object.keys(palettes)
        for(let i=0;i<keys.length;i++){
            let attribute = keys[i]
            this.data.palettes[attribute] = {}
            let palKeys = Object.keys(palettes[attribute])
            for(let j=0;j<palKeys.length;j++){
                this.data.palettes[attribute][palKeys[j]] = palettes[attribute][palKeys[j]].data
            }
        }
        this.data.data.selectedSequence = sequenceManager.selectedSequence
        this.data.data.artnet = {
            "ip":artnet.ip,
            "websocket":artnet.websocket
        }
        this.data.data.fileName = settingsMenu.settingsElement.querySelector('input#save-file-name').value
    }

    saveToFile(){
        this.generateSaveData()
        let element = document.createElement('a')
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.data)))
        let name = ""
        if(this.data.data.fileName){
            name = this.data.data.fileName + " " + new Date().toLocaleString().replaceAll("/","-").replaceAll(":","-") + ".json"
        } else {
            name = "softlight " + new Date().toLocaleString().replaceAll("/","-").replaceAll(":","-") + ".json"
        }
        element.setAttribute('download', name)
        element.style.display = 'none'
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
    }

    saveToBrowser(){
        this.generateSaveData()
        localStorage.setItem("softlight-showfile",JSON.stringify(this.data))
    }

    clearData(){
        fixtureManager.fixtures = []
        fixtureManager.selectedFixtures = []
        sequenceManager.sequences = {}
        paletteManager.palettes = {"dimmer":{},"color":{},"position":{},"beam":{},"shape":{}}
    }

    load(){
        let fixtures = this.data.fixtures
        let keys = Object.keys(fixtures)
        for(let i=0;i<keys.length;i++){
            fixtureManager.fixtures.push(new Fixture(fixtures[keys[i]].channel,fixtures[keys[i]].mode,fixtures[keys[i]].fixtureProfile,keys[i]))
        }
        let sequences = this.data.sequences
        keys = Object.keys(sequences)
        for(let i=0;i<keys.length;i++){
            sequenceManager.sequences[keys[i]] = new Sequence(keys[i])
            let cues = sequences[keys[i]]
            let cueKeys = Object.keys(cues)
            for(let j=0;j<cueKeys.length;j++){
                let cue = cues[cueKeys[j]]
                sequenceManager.sequences[keys[i]].cues[cueKeys[j]] = new Cue(cue.name)
                sequenceManager.sequences[keys[i]].cuesOrder.push(parseFloat(cueKeys[j]))
                sequenceManager.sequences[keys[i]].cues[cueKeys[j]].data = cue.data
                sequenceManager.sequences[keys[i]].cues[cueKeys[j]].dataTypes = cue.dataTypes
                sequenceManager.sequences[keys[i]].cues[cueKeys[j]].timings = cue.timings
                sequenceManager.sequences[keys[i]].cues[cueKeys[j]].updateTotalTime()
            }
            sequenceManager.sequences[keys[i]].updateVariables()
        }
        sequenceManager.selectedSequence = this.data.data.selectedSequence
        let palettes = this.data.palettes
        keys = Object.keys(palettes)
        for(let i=0;i<keys.length;i++){
            let attribute = keys[i]
            let palKeys = Object.keys(palettes[attribute])
            for(let j=0;j<palKeys.length;j++){
                paletteManager.createPalette(attribute,palKeys[j])
                paletteManager.palettes[attribute][palKeys[j]].data = palettes[attribute][palKeys[j]]
            }
        }
        artnet.changeIp(this.data.data.artnet.ip)
        artnet.changeWebsocket(this.data.data.artnet.websocket)
        settingsMenu.settingsElement.querySelector('input#save-file-name').value = this.data.data.fileName
        this.loaded()
    }

    loadFromFile(){
        this.clearData()
        let element = document.createElement('input')
        element.type = "file"
        let that = this
        element.onchange = function(){
            let filereader = new FileReader()
            filereader.onload = async function(){
                that.data = JSON.parse(filereader.result)
                that.load()
            }
            filereader.readAsText(element.files[0])
        }
        element.click()
    }

    loadFromBrowser(){
        this.clearData()
        this.data = JSON.parse(localStorage.getItem("softlight-showfile"))
        this.load()
    }

    loaded(){
        ui.updateFixtureList()
        ui.updateAttributes()
        ui.updateCueList()
    }
}