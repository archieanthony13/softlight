class Cue{
    constructor(name){
        this.data = {}
        this.dataTypes = {}
        this.name = name
        this.timings = {"fade":{"dimmer up":0,"dimmer down":0,"color":0,"position":0,"beam":0,"shape":0},"delay":{"dimmer up":0,"dimmer down":0,"color":0,"position":0,"beam":0,"shape":0}}
        this.totalTime = 0
        this.beforeState = {}

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
        if(timings === undefined){
            this.timings = {"fade":{"dimmer up":0,"dimmer down":0,"color":0,"position":0,"beam":0,"shape":0},"delay":{"dimmer up":0,"dimmer down":0,"color":0,"position":0,"beam":0,"shape":0}}
        }
        this.updateTotalTime()
    }

    go(){
        this.active = true
        let fixtures = fixtureManager.fixtures
        for(let i=0;i<fixtures.length;i++){
            this.beforeState[fixtures[i].name] = JSON.parse(JSON.stringify(dmx.getFixtureData(fixtures[i].name)))
        }
    }

    updateTotalTime(){
        let totalTime = [0,0,0,0,0,0]
        let timingKeys = Object.keys(this.timings)
        for(let i=0;i<timingKeys.length;i++){
            let timingAttributes = Object.keys(this.timings[timingKeys[i]])
            for(let j=0;j<timingAttributes.length;j++){
                totalTime[j] += (this.timings[timingKeys[i]][timingAttributes[j]] || 0)
            }
        }
        this.totalTime = totalTime.sort((a,b) => b-a)[0]
    }

    deleteFixtureByName(fixtureName){
        delete this.data[fixtureName]
    }

    update(timestamp){
        if(this.active){
            if(this.activatedTime === null){
                this.activatedTime = timestamp
            }
            let activeTime = timestamp - this.activatedTime
            if(activeTime >= this.totalTime * 60){
                this.active = false
                this.activatedTime = null
            }
            let keys = Object.keys(this.data)
            for(let i=0;i<keys.length;i++){
                let fixture = keys[i]
                let channels = this.data[fixture]
                for(let j=0;j<channels.length;j++){
                    let channelType = this.dataTypes[fixture][j]
                    if(channels[j] !== false){
                        if(channelType == "dimmer"){
                            if(channels[j] > this.beforeState[fixture][j]){
                                channelType = "dimmer up"
                            } else {
                                channelType = "dimmer down"
                            }
                        }
                        if(activeTime >= (this.timings["delay"][channelType] || 0) * 60
                        && activeTime - (this.timings["delay"][channelType] || 0) * 60 <= (this.timings["fade"][channelType] || 0) * 60){
                            let change = (channels[j] - this.beforeState[fixture][j])/((this.timings["fade"][channelType] || 0) * 60)
                            if(change !== Infinity && change !== -Infinity && !isNaN(change)){
                                fixtureManager.getFixture(fixture).updateFixtureChannelByIndex(j,this.beforeState[fixture][j] + (change * (activeTime - (this.timings["delay"][channelType] || 0) * 60)))
                            } else {
                                fixtureManager.getFixture(fixture).updateFixtureChannelByIndex(j,channels[j])
                            }
                        }
                    }
                }
            }
        }
    }

    track(){
        this.active = false
        this.activatedTime = null
        let keys = Object.keys(this.data)
        for(let i=0;i<keys.length;i++){
            let fixture = keys[i]
            let channels = this.data[fixture]
            for(let j=0;j<channels.length;j++){
                if(channels[j] !== false){
                    fixtureManager.getFixture(fixture).updateFixtureChannelByIndex(j,channels[j])
                }
            }
        }
    }
}