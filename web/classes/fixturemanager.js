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

    async patchFixture(channel, mode, manufacturer, fixtureName, name){
        let fixtureProfile = this.getFixtureProfile(manufacturer, fixtureName)
        if(fixtureProfile == -1){
            await this.loadFixtureProfileFromCloud(manufacturer, fixtureName)
            fixtureProfile = this.getFixtureProfile(manufacturer, fixtureName)
        }
        this.fixtures.push(new Fixture(channel, mode, fixtureProfile, name))

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

    async loadFixtureProfileFromCloud(manufacturer, name){
        let data = JSON.parse(await fetch("https://raw.githubusercontent.com/RetroCoder13/softlight-fixture-library/refs/heads/main/"+manufacturer+"/"+name+".json").then(text => text.text()))
        this.fixtureLibrary.push(data)
        localStorage.setItem("softlight-fixture-library", JSON.stringify(this.fixtureLibrary))
    }

    async getFixtureLibraryFromCloud(url){
        let fixturesList = []
        if(url){
            let contents = JSON.parse(await fetch(url).then(text => text.text()))
            for(let i=0;i<contents.length;i++){
                if(contents[i].size == 0){
                    fixturesList = fixturesList.concat(await this.getFixtureLibraryFromCloud(contents[i].url))
                } else {
                    if(contents[i].name != "README.md"){
                        fixturesList.push(contents[i].path.replace(".json",""))
                    }
                }
            }
        } else {
            fixturesList = fixturesList.concat(await this.getFixtureLibraryFromCloud("https://api.github.com/repos/RetroCoder13/softlight-fixture-library/contents"))
        }
        return fixturesList
    }

    async loadFixtureLibraryFromCloud(){
        let fixturesList = await this.getFixtureLibraryFromCloud()
        for(let i=0;i<fixturesList.length;i++){
            this.fixtureLibrary.push(JSON.parse(await fetch("https://raw.githubusercontent.com/RetroCoder13/softlight-fixture-library/main/" + fixturesList[i] + ".json").then(text => text.text())))
        }
        localStorage.setItem("softlight-fixture-library", JSON.stringify(this.fixtureLibrary))
    }
}