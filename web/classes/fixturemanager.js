class FixtureManager{
    constructor(){
        // Initialise variables to store the fixture library and fixtures
        this.fixtureLibrary = []
        this.fixtures = []
        this.selectedFixtures = []

        // DOM update to update selected fixtures when the fixture list is changed
        let that = this
        document.getElementById('fixtures-list').onchange = function(){
            ui.clear = false
            that.updateSelectedFixtures()
        }
    }

    // Function to update the fixture library based on data stored in the local storage
    loadFixtureLibrary(){
        // If local storage exists then set fixture library
        if(localStorage.getItem("softlight-fixture-library")){
            this.fixtureLibrary = JSON.parse(localStorage.getItem("softlight-fixture-library"))
        // If local storage doesn't exist then fixture library should be reset to blank
        } else {
            this.fixtureLibrary = []
        }
    }

    // Function to clear the fixture library from local storage
    clearFixtureLibrary(){
        localStorage.removeItem("softlight-fixture-library")
    }

    // Function to load a fixture profile from a file input
    loadFixtureProfileFromFile(){
        // Create a temporary input element which allows for JSON files
        let object = document.createElement('input')
        object.type = "file"
        object.accept = ".json"
        // Open the input dialog
        object.click()
        // Load the file
        let that = this
        object.onchange = function(){
            let filereader = new FileReader()
            filereader.onload = async function(){
                // Store the loaded file into the fixture library and update the local storage
                that.fixtureLibrary.push(JSON.parse(filereader.result))
                localStorage.setItem("softlight-fixture-library", JSON.stringify(that.fixtureLibrary))
            }
            filereader.readAsText(object.files[0])
        }
    }

    // Get a fixture profile from the fixture library given a manufacturer and fixture name
    getFixtureProfile(manufacturer, name){
        // Loop through the fixture library until a fixture profile is found
        for(let i=0;i<this.fixtureLibrary.length;i++){
            if(this.fixtureLibrary[i].manufacturer == manufacturer && this.fixtureLibrary[i].name == name){
                return this.fixtureLibrary[i]
            }
        }
        // Return -1 if it is not found
        return -1
    }

    // Asynchronous function to patch a fixture into the software
    async patchFixture(universe, channel, mode, manufacturer, fixtureName, name){
        // Get the fixture profile from the fixture library
        let fixtureProfile = this.getFixtureProfile(manufacturer, fixtureName)
        // If a fixture profile is not found then it is attempted to load it from the cloud
        if(fixtureProfile == -1){
            await this.loadFixtureProfileFromCloud(manufacturer, fixtureName)
            fixtureProfile = this.getFixtureProfile(manufacturer, fixtureName)
        }
        // Add the fixture to the fixtures array
        this.fixtures.push(new Fixture(universe, channel, mode, fixtureProfile, name))

        // Update everything accordingly
        dmx.updateUniverses()
        ui.updateFixtureList()
        this.updateSelectedFixtures()
        ui.updateAttributes()
    }

    // Function to delete a fixture
    deleteFixture(id){
        let name = this.fixtures[id].name
        this.fixtures.splice(id,1)
        // Update everything accordingly
        ui.updateFixtureList()
        this.updateSelectedFixtures()
        ui.updateAttributes()
        // Ensure fixture is removed from all cues
        sequenceManager.deleteFixtureByName(name)
    }

    // Function to delete a fixture by name
    deleteFixtureByName(name){
        // Find the fixture index and run deleteFunction()
        for(let i=0;i<this.fixtures.length;i++){
            if(this.fixtures[i].name == name){
                this.deleteFixture(i)
            }
        }
    }

    // Function which returns a fixture object associated with the given name
    getFixture(name){
        for(let i=0;i<this.fixtures.length;i++){
            if(this.fixtures[i].name == name){
                return this.fixtures[i]
            }
        }
        // Return -1 if fixture is not found
        return -1
    }

    // Function to update channels for selected fixtures
    updateSelectedFixtureChannel(channel, value, bits){
        // Loop through selected fixtures array
        for(let i=0;i<this.selectedFixtures.length;i++){
            // If there is only one channel then update value directly
            if(bits == 1){
                this.fixtures[this.selectedFixtures[i]].updateFixtureChannel(channel, value)
            // If there are two channels (coarse and fine) then they must be split
            } else {
                // Split into coarse and fine channels
                let coarse = value >> 8
                let fine = value & 255
                // Update both coarse and fine channels
                this.fixtures[this.selectedFixtures[i]].updateFixtureChannel(channel, coarse)
                this.fixtures[this.selectedFixtures[i]].updateFixtureChannel("Fine " + channel, fine)
            }
        }
    }

    // Function to update manual channels for selected fixtures
    updateSelectedFixtureManualChannel(channel, value, bits){
        // Loop through selected fixtures array
        for(let i=0;i<this.selectedFixtures.length;i++){
            // If there is only one channel then update value directly
            if(bits == 1){
                this.fixtures[this.selectedFixtures[i]].updateFixtureManualChannel(channel, value)
            // If there are two channels (coarse and fine) then they must be split
            } else {
                // Split into coarse and fine channels
                let coarse = value >> 8
                let fine = value & 255
                // Update both coarse and fine channels
                this.fixtures[this.selectedFixtures[i]].updateFixtureManualChannel(channel, coarse)
                this.fixtures[this.selectedFixtures[i]].updateFixtureManualChannel("Fine " + channel, fine)
            }
        }
    }

    // Function to clear manual channels for a specific fixture
    clearManualFixtureChannels(fixture){
        this.getFixture(fixture).manualChannels.fill(false)
    }

    // Function to clear manual channels for all fixtures
    clearAllManualFixtureChannels(){
        for(let i=0;i<this.fixtures.length;i++){
            this.fixtures[i].manualChannels.fill(false)
        }
    }

    // Function which updates the selected fixtures
    updateSelectedFixtures(){
        // Get all HTML fixtures
        let fixtureSection = document.querySelectorAll('#fixtures-list input')
        // Reset selected fixtures
        this.selectedFixtures = []
        // Loop through HTML inputs
        for(let i=0;i<fixtureSection.length;i++){
            // If the input is checked then add the fixture to the selected fixtures
            if(fixtureSection[i].checked){
                this.selectedFixtures.push(i)
            }
        }
        // Update UI attributes so values for selected fixtures can be displayed
        ui.updateAttributes()
    }

    async loadFixtureProfileFromCloud(manufacturer, name){
        let data = JSON.parse(await fetch("https://raw.githubusercontent.com/archieanthony13/softlight-fixture-library/refs/heads/main/"+manufacturer+"/"+name+".json").then(text => text.text()))
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
            fixturesList = fixturesList.concat(await this.getFixtureLibraryFromCloud("https://api.github.com/repos/archieanthony13/softlight-fixture-library/contents"))
        }
        return fixturesList
    }

    async loadFixtureLibraryFromCloud(){
        let fixturesList = await this.getFixtureLibraryFromCloud()
        for(let i=0;i<fixturesList.length;i++){
            this.fixtureLibrary.push(JSON.parse(await fetch("https://raw.githubusercontent.com/archieanthony13/softlight-fixture-library/main/" + fixturesList[i] + ".json").then(text => text.text())))
        }
        localStorage.setItem("softlight-fixture-library", JSON.stringify(this.fixtureLibrary))
    }

    clearFixtureLibrary(){
        this.fixtureLibrary = []
        localStorage.removeItem("softlight-fixture-library")
    }

    getFixtureIndex(name){
        for(let i=0;i<this.fixtures.length;i++){
            if(this.fixtures[i].name == name){
                return i
            }
        }
    }

    changeUniverse(fixture, universe){
        this.getFixture(fixture).universe = universe
        dmx.updateUniverses()
    }
}