class FixtureManager{
    constructor(){
        this.fixtureLibrary = []
        this.fixtures = []
        this.selectedFixtures = []

        let that = this
        document.getElementById('fixtures').onchange = function(){
            that.updateSelectedFixtures()
        }
    }

    loadFixtureLibrary(){
        if(localStorage.getItem("softlight-fixture-library")){
            this.fixtureLibrary = JSON.parse(localStorage.getItem("softlight-fixture-library"))
        } else {
            this.fixtureLibrary = []
        }
    }

    clearFixtureLibrary(){
        localStorage.removeItem("softlight-fixture-library")
    }

    loadFixtureProfileFromFile(){
        let object = document.createElement('input')
        object.type = "file"
        object.accept = ".json"
        object.click()
        let that = this
        object.onchange = function(){
            let filereader = new FileReader()
            filereader.onload = async function(){
                that.fixtureLibrary.push(JSON.parse(filereader.result))
                localStorage.setItem("softlight-fixture-library", JSON.stringify(that.fixtureLibrary))
            }
            filereader.readAsText(object.files[0])
        }
    }

    getFixtureProfile(manufacturer, name){
        for(let i=0;i<this.fixtureLibrary.length;i++){
            if(this.fixtureLibrary[i].manufacturer == manufacturer && this.fixtureLibrary[i].name == name){
                return this.fixtureLibrary[i]
            }
        }
        return -1
    }

    patchFixture(channel, mode, manufacturer, fixtureName, name){
        let fixtureProfile = this.getFixtureProfile(manufacturer, fixtureName)
        if(fixtureProfile == -1){
            console.error("Unable to create fixture. Please upload a fixture profile for this")
        } else {
            this.fixtures.push(new Fixture(channel, mode, fixtureProfile, name))
        }

        ui.updateFixtureList()
    }

    deleteFixture(id){
        this.fixtures.splice(id,1)
        ui.updateFixtureList()
    }

    getFixture(name){
        for(let i=0;i<this.fixtures.length;i++){
            if(this.fixtures[i].name == name){
                return this.fixtures[i]
            }
        }
        return -1
    }

    updateSelectedFixtureChannel(channel, value){
        for(let i=0;i<this.selectedFixtures.length;i++){
            this.fixtures[this.selectedFixtures[i]].updateFixtureChannel(channel, value)
        }
    }

    updateSelectedFixtures(){
        let fixtureSection = document.querySelectorAll('#fixtures input')
        this.selectedFixtures = []
        for(let i=0;i<fixtureSection.length;i++){
            if(fixtureSection[i].checked){
                this.selectedFixtures.push(i)
            }
        }
        ui.updateAttributes()
    }
}