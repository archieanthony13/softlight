class Patch{
    constructor(){
        // Initialise menu elements
        this.patchElement = document.querySelector('.menu#patch-menu')
        this.patchElementBottom = this.patchElement.querySelector(".menu-bottom-bottom-section.fixture-list")
        this.active = false
        this.selectedFixtures = []

        this.manufacturerElement = document.querySelector('select#patch-fixture-manufacturer')
        this.nameElement = document.querySelector('select#patch-fixture-name')
        this.channelElement = document.querySelector('select#patch-fixture-channel')

        // DOM button events within the patch menu
        let that = this
        // Exit patch menu
        this.patchElement.querySelector("button#exit-patch").onclick = function(){
            that.togglePatchMenu()
        }
        // Open the fixture list tab
        this.patchElement.querySelector("button#fixture-list").onclick = function(){
            that.fixtureListMenu()
        }
        // Open the patch fixture tab
        this.patchElement.querySelector("button#patch-fixture").onclick = function(){
            that.patchFixtureMenu()
        }
        // Load a fixture profile from a local file
        this.patchElement.querySelector('button#upload-fixture-profile').onclick = async function(){
            await fixtureManager.loadFixtureProfileFromFile()
            that.updatePatchFixtureMenu()
        }
        // Load the entire fixture library from the cloud
        this.patchElement.querySelector('button#load-fixture-library').onclick = async function(){
            await fixtureManager.loadFixtureLibraryFromCloud()
            that.updatePatchFixtureMenu()
        }
        // Clear the fixture library
        this.patchElement.querySelector('button#clear-fixture-library').onclick = function(){
            fixtureManager.clearFixtureLibrary()
            that.updatePatchFixtureMenu()
        }
        // Patch a fixture
        this.patchElement.querySelector('#patch-fixture-patch').onclick = function(){
            that.patchFixture()
        }
        // Delete selected fixtures
        this.patchElement.querySelector('#delete-fixture').onclick = function(){
            that.deleteFixtures()
        }
        // When selecting a manufacturer, update the fixture names and channel modes
        this.manufacturerElement.onchange = function(){
            that.updateFixtureNameSelect()
            that.updateChannelSelect()
        }
        // When selecting a fixture, update the channel modes
        this.nameElement.onchange = function(){
            that.updateChannelSelect()
        }
    }

    // Function to toggle the patch menu
    togglePatchMenu(){
        // Toggle menu active
        this.active = !this.active
        if(this.active){
            // Show menu
            this.patchElement.style.display = "grid"
            // Set background opacity
            document.querySelector(".container").style.opacity = "0.25"
            // Open the fixture list tab
            this.fixtureListMenu()
        } else {
            // Close menu
            this.patchElement.style.display = "none"
            // Reset background opacity
            document.querySelector(".container").style.opacity = "1"
        }
    }

    // Function to open the fixture list tab
    fixtureListMenu(){
        // Display names of all patched fixtures
        this.patchElementBottom = this.patchElement.querySelector(".menu-bottom-bottom-section.fixture-list")
        // Clear fixture list
        this.patchElementBottom.innerHTML = ""
        // Loop through all fixtures
        for(let i=0;i<fixtureManager.fixtures.length;i++){
            // Create a label element to display fixture name
            let label = document.createElement('label')
            label.innerHTML = fixtureManager.fixtures[i].name
            // Link to an input tag
            let forAttribute = document.createAttribute('for')
            forAttribute.value = "patch-" + i
            label.attributes.setNamedItem(forAttribute)
            // Create a checkbox input
            let input = document.createElement('input')
            input.type = "checkbox"
            // Link to label tag
            input.name = "patch-" + i
            input.id = "patch-" + i
            // Hide input so it is not visible to the user
            input.hidden = true
            // Append both the input and label to the fixture list
            this.patchElementBottom.append(input)
            this.patchElementBottom.append(label)
        }
        // Update menu elements so correct tab is displayed
        this.patchElement.querySelector('.menu-bottom-section.fixture-list').style.display = "grid"
        this.patchElement.querySelector('.menu-bottom-section.patch-fixture').style.display = "none"
        this.patchElement.querySelector("button#fixture-list").classList.add("selected")
        this.patchElement.querySelector("button#patch-fixture").classList.remove("selected")
        this.patchElementBottom.style.gridTemplateRows = "repeat(" + fixtureManager.fixtures.length + ", calc(var(--scale)*4))"
    }

    // Function to open the patch fixture tab
    patchFixtureMenu(){
        this.patchElementBottom = this.patchElement.querySelector(".menu-bottom-bottom-section.patch-fixture")
        // Update inputs
        this.updatePatchFixtureMenu()
        // Update menu elements so correct tab is displayed
        this.patchElementBottom.style.gridTemplateRows = "repeat(7, calc(var(--scale)*4))"
        this.patchElement.querySelector('.menu-bottom-section.fixture-list').style.display = "none"
        this.patchElement.querySelector('.menu-bottom-section.patch-fixture').style.display = "grid"
        this.patchElement.querySelector("button#fixture-list").classList.remove("selected")
        this.patchElement.querySelector("button#patch-fixture").classList.add("selected")
    }

    // Function to update select inputs in the patch fixture tab
    updatePatchFixtureMenu(){
        this.updateManufacturerSelect()
        this.updateFixtureNameSelect()
        this.updateChannelSelect()
    }

    // Function to update the manufacturer select
    updateManufacturerSelect(){
        let manufacturerElement = this.patchElementBottom.querySelector("#patch-fixture-manufacturer")
        let manufacturersList = []
        // Clear select
        manufacturerElement.innerHTML = ""
        // Loop through the fixture library
        for(let i=0;i<fixtureManager.fixtureLibrary.length;i++){
            // Get manufacturer from the fixture profile
            let fixture = fixtureManager.fixtureLibrary[i]
            let manufacturer = fixture.manufacturer
            // If a new manufacturer is found then add it
            if(manufacturersList.indexOf(manufacturer) == -1){
                // Create an option element
                let option = document.createElement('option')
                // Give it manufacturer data
                option.value = manufacturer
                option.innerHTML = manufacturer
                // Add it to the list
                manufacturerElement.append(option)
                manufacturersList.push(manufacturer)
            }
        }
    }

    // Function to update the fixture name select
    updateFixtureNameSelect(){
        // Get manufacturer from previous select
        let manufacturer = this.patchElementBottom.querySelector("#patch-fixture-manufacturer").value
        let nameElement = this.patchElementBottom.querySelector("#patch-fixture-name")
        // Clear select
        nameElement.innerHTML = ""
        // Loop through the fixture library
        for(let i=0;i<fixtureManager.fixtureLibrary.length;i++){
            let fixture = fixtureManager.fixtureLibrary[i]
            // Check if the manufacturer matches the user input
            if(fixture.manufacturer == manufacturer){
                // Create an option element
                let name = fixture.name
                let nameOption = document.createElement('option')
                // Give it fixture name data
                nameOption.value = name
                nameOption.innerHTML = name
                // Add it to the list
                nameElement.append(nameOption)
            }
        }
    }

    // Function to update the channel mode select
    updateChannelSelect(){
        // Get manufacturer and fixture name from previous selects
        let manufacturer = this.patchElementBottom.querySelector("#patch-fixture-manufacturer").value
        let name = this.patchElementBottom.querySelector("#patch-fixture-name").value
        let channelElement = this.patchElementBottom.querySelector("#patch-fixture-channel")
        // Clear select
        channelElement.innerHTML = ""
        // Loop through the fixture library
        for(let i=0;i<fixtureManager.fixtureLibrary.length;i++){
            let fixture = fixtureManager.fixtureLibrary[i]
            // Check if the manufacturer and fixture name matchs the user input
            if(fixture.manufacturer == manufacturer && fixture.name == name){
                // Create an array of available channel modes
                let channelModes = Object.keys(fixture.modes)
                // Loop through channel modes
                for(let i=0;i<channelModes.length;i++){
                    // Create an option element
                    let channel = channelModes[i]
                    let channelOption = document.createElement('option')
                    // Give it channel mode data
                    channelOption.value = channel
                    channelOption.innerHTML = channel
                    // Add it to the list
                    channelElement.append(channelOption)
                }
            }
        }
    }

    // Function to patch a fixture
    patchFixture(){
        // Get user input
        let manufacturer = this.patchElementBottom.querySelector("#patch-fixture-manufacturer").value
        let name = this.patchElementBottom.querySelector("#patch-fixture-name").value
        let channel = this.patchElementBottom.querySelector("#patch-fixture-channel").value
        let fixtureName = this.patchElementBottom.querySelector("#patch-fixture-fixture-name").value
        let fixtureChannel = parseInt(this.patchElementBottom.querySelector("#patch-fixture-fixture-channel").value)
        let universe = parseInt(this.patchElementBottom.querySelector("#patch-fixture-fixture-universe").value)
        // Patch the fixture in the fixture manager
        fixtureManager.patchFixture(universe, fixtureChannel, channel, manufacturer, name, fixtureName)
    }

    // Function to delete selected fixtures
    deleteFixtures(){
        // Get selected fixtures from the fixtures list
        this.updateSelectedFixtures()
        // Loop through selected fixtures and delete them
        for(let i=0;i<this.selectedFixtures.length;i++){
            fixtureManager.deleteFixture(this.selectedFixtures[i] - i) // Make sure to offset indexes as fixtures get deleted as array shrinks
        }
        // Update the fixture list menu
        this.fixtureListMenu()
    }

    // Function to update selected fixtures in the fixtures list
    updateSelectedFixtures(){
        // Get all fixture inputs
        let fixtureSection = document.querySelectorAll('.menu-bottom-bottom-section.fixture-list input')
        this.selectedFixtures = []
        // Loop through all inputs
        for(let i=0;i<fixtureSection.length;i++){
            // If input is checked then fixture is selected
            if(fixtureSection[i].checked){
                this.selectedFixtures.push(i)
            }
        }
        // Update UI attributes
        ui.updateAttributes()
    }
}