class Save{
    constructor(){
        this.data = {"fixtures":{},"sequences":{}}

        // window.onbeforeunload = function(e){
        //     e.preventDefault()
        // }
    }

    generateSaveData(){
        this.data = {"fixtures":{},"sequences":{}}
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
    }

    saveToFile(){
        this.generateSaveData()
        let element = document.createElement('a')
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.data)))
        element.setAttribute('download', "softlight " + new Date().toString() + ".json")
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
                console.log(cue)
                sequenceManager.sequences[keys[i]].cues[cueKeys[j]] = new Cue(cue.name)
                sequenceManager.sequences[keys[i]].cuesOrder.push(parseFloat(cueKeys[j]))
                sequenceManager.sequences[keys[i]].cues[cueKeys[j]].data = cue.data
                sequenceManager.sequences[keys[i]].cues[cueKeys[j]].dataTypes = cue.dataTypes
                sequenceManager.sequences[keys[i]].cues[cueKeys[j]].timings = cue.timings
                sequenceManager.sequences[keys[i]].cues[cueKeys[j]].updateTotalTime()
            }
            sequenceManager.sequences[keys[i]].updateVariables()
        }
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