class Cue{
    constructor(){
        this.data = {}
        this.fadeTimes = {"dimmer up":0,"dimmer down":0,"color":0,"position":0,"beam":0,"shape":0}
    }

    store(){
        let fixtures = fixtureManager.fixtures
        for(let i=0;i<fixtures.length;i++){
            this.data[fixtures[i].name] = fixtures[i].manualChannels
        }
    }
}