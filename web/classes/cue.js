class Cue{
    constructor(name){
        this.data = {}
        this.dataTypes = {}
        this.name = name
        this.timings = {"fade":{"dimmer up":0,"dimmer down":0,"color":0,"position":0,"beam":0,"shape":0},"delay":{"dimmer up":0,"dimmer down":0,"color":0,"position":0,"beam":0,"shape":0}}

        this.active = false
        this.activatedTime = null
    }

    store(timings, mode){
        if(mode === undefined || mode == "overwrite"){
            let fixtures = fixtureManager.fixtures
            for(let i=0;i<fixtures.length;i++){
                this.data[fixtures[i].name] = JSON.parse(JSON.stringify(fixtures[i].manualChannels))
                this.dataTypes[fixtures[i].name] = JSON.parse(JSON.stringify(fixtures[i].channelTypes))
            }
            this.timings = timings
        } else if(mode == "merge"){
            let fixtures = fixtureManager.fixtures
            for(let i=0;i<fixtures.length;i++){
                if(this.data[fixtures[i].name] === undefined){
                    this.data[fixtures[i].name] = []
                }
                for(let j=0;j<fixtures[i].manualChannels.length;j++){
                    if(fixtures[i].manualChannels[j] !== false){
                        this.data[fixtures[i].name][j] = JSON.parse(JSON.stringify(fixtures[i].manualChannels[j]))
                    } else {
                        this.data[fixtures[i].name][j] = (this.data[fixtures[i].name][j] || false)
                    }
                }
                this.dataTypes[fixtures[i].name] = JSON.parse(JSON.stringify(fixtures[i].channelTypes))
            }

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
    }

    go(){
        this.active = true
        let keys = Object.keys(this.data)
        for(let i=0;i<keys.length;i++){
            let fixture = keys[i]
            let channels = this.data[fixture]
            for(let j=0;j<channels.length;j++){
                if(channels[j] !== false){
                    fixtureManager.getFixture(keys[i]).updateFixtureChannelByIndex(j,channels[j])
                }
            }
        }
    }

    update(timestamp){
        if(this.activatedTime === null && this.active == true){
            this.activatedTime = timestamp
        }
    }
}