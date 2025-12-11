class Cue{
    constructor(){
        this.data = {}
        this.timings = {"fade":{"dimmer up":0,"dimmer down":0,"color":0,"position":0,"beam":0,"shape":0},"delay":{"dimmer up":0,"dimmer down":0,"color":0,"position":0,"beam":0,"shape":0}}
    }

    store(){
        let fixtures = fixtureManager.fixtures
        for(let i=0;i<fixtures.length;i++){
            this.data[fixtures[i].name] = JSON.parse(JSON.stringify(fixtures[i].manualChannels))
        }
    }

    go(){
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
}