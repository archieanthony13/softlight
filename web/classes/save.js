class Save{
    constructor(){
        this.data = {"fixtures":{},"sequences":{}}
    }

    generateSaveData(){
        let fixtures = fixtureManager.fixtures
        for(let i=0;i<fixtures.length;i++){
            let fixture = fixtures[i]
            this.data.fixtures[fixture.name] = {
                "channel":fixture.channel,
                "mode":fixture.mode,
                "fixtureProfile":fixture.fixtureProfile
            }
        }
    }

    saveToFile(){

    }

    saveToBrowser(){

    }

    loadFromFile(){

    }

    loadFromBrowser(){

    }
}