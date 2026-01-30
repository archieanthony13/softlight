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
        this.generateSaveData()
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

    loadFromFile(){

    }

    loadFromBrowser(){
        this.clearData()
        this.data = JSON.parse(localStorage.getItem("softlight-showfile"))
        let fixtures = this.data.fixtures
        let keys = Object.keys(fixtures)
        for(let i=0;i<keys.length;i++){
            fixtureManager.fixtures.push(new Fixture(fixtures[keys[i]].channel,fixtures[keys[i]].mode,fixtures[keys[i]].fixtureProfile,keys[i]))
        }
        this.loaded()
    }

    loaded(){
        ui.updateFixtureList()
        ui.updateAttributes()
        ui.updateCueList()
    }
}