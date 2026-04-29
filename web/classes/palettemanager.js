class PaletteManager{
    constructor(){
        // Initialise menu elements
        this.menuActive = false
        this.paletteMenuElement = document.querySelector('.menu#palette-menu')
        this.paletteMenuElementBottom = this.paletteMenuElement.querySelector(".menu-bottom-section")

        this.paletteStoreMenuElement = document.querySelector('.menu#palette-store-menu')
        this.paletteStoreMenuElementBottom = this.paletteStoreMenuElement.querySelector(".menu-bottom-section")

        // Initialise variables to store palettes
        this.palettes = {"dimmer":{},"color":{},"position":{},"beam":{},"shape":{}}
        this.selectedPalette = []

        // DOM button events within the palette menu
        let that = this
        // Exit palette menu
        this.paletteMenuElement.querySelector("button#exit-palette").onclick = function(){
            that.togglePaletteMenu()
        }
        // Create a new palette
        this.paletteMenuElement.querySelector("button#palette-create-palette").onclick = function(){
            // Get user input and create palette
            let name = that.paletteMenuElementBottom.querySelector("input").value
            that.createPalette(null,name)
            // Close the palette menu
            that.togglePaletteMenu()
        }
        // Exit palette store menu
        this.paletteStoreMenuElement.querySelector("button#exit-palette-store").onclick = function(){
            that.togglePaletteStoreMenu()
        }
        // Store data to the palette
        this.paletteStoreMenuElement.querySelector("button#palette-store-palette").onclick = function(){
            // Get user input for palette name and store mode
            let name = that.paletteStoreMenuElementBottom.querySelector("input").value
            let mode = that.paletteStoreMenuElementBottom.querySelector("select").value
            // Store into the palette
            that.store(name, mode)
            // Close the palette store menu
            that.togglePaletteStoreMenu()
        }
    }

    // Function to create a new palette
    createPalette(attribute,name){
        // If attribute is not given then use the selected attribute from the UI
        if(attribute){
            this.palettes[attribute][name] = new Palette(attribute)
        } else {
            this.palettes[ui.attribute][name] = new Palette(ui.attribute)
        }
        ui.updatePalettesList()
    }

    // Function to delete a palette
    deletePalette(attribute,name){
        // If attribute is not given then use the selected attribute from the UI
        if(attribute){
            delete this.palettes[attribute][name]
        } else {
            delete this.palettes[ui.attribute][name]
        }
        ui.updatePalettesList()
    }

    // Function to delete the selected palette when the UI button is pressed
    deletePaletteButton(){
        this.deletePalette(this.selectedPalette[0],this.selectedPalette[1])
    }

    // Function to toggle the palette menu
    togglePaletteMenu(){
        // Toggle menu active
        this.menuActive = !this.menuActive
        if(this.menuActive){
            // Show menu
            this.paletteMenuElement.style.display = "grid"
            // Clear inputs
            let inputs = this.paletteMenuElement.querySelectorAll("input")
            for(let i=0;i<inputs.length;i++){
                inputs[i].value = ""
            }
            // Set background opacity
            document.querySelector(".container").style.opacity = "0.25"
        } else {
            // Close menu
            this.paletteMenuElement.style.display = "none"
            // Reset background opacity
            document.querySelector(".container").style.opacity = "1"
        }
    }

    // Function to toggle the palette store menu
    togglePaletteStoreMenu(){
        // Toggle menu active
        this.menuActive = !this.menuActive
        // Check if menu should be active or not
        if(this.menuActive){
            // Show menu
            this.paletteStoreMenuElement.style.display = "grid"
            // Clear inputs
            let inputs = this.paletteStoreMenuElement.querySelectorAll("input")
            for(let i=0;i<inputs.length;i++){
                inputs[i].value = ""
            }
            // Set background opacity
            document.querySelector(".container").style.opacity = "0.25"
        } else {
            // Close menu
            this.paletteStoreMenuElement.style.display = "none"
            // Reset background opacity
            document.querySelector(".container").style.opacity = "1"
        }
    }

    // Function to store data into palettes
    store(name, mode){
        // Check if palette exists
        let index = Object.keys(this.palettes[ui.attribute]).indexOf(name)
        // If palette exists then store into it
        if(index != -1){
            this.palettes[ui.attribute][name].store(mode)
        // If palette doesn't exist then create a new palette with the name
        } else {
            this.createPalette(null,name)
            this.palettes[ui.attribute][name].store(mode)
        }
    }

    // Function to select a palette
    selectPalette(attribute, name){
        let keys = Object.keys(this.palettes[attribute][name].data)
        // If there are no fixtures selected then the palette gets highlighted
        if(fixtureManager.selectedFixtures.length == 0){
            if(this.selectedPalette[0] == attribute && this.selectedPalette[1] == name){
                this.selectedPalette = []
            } else {
                this.selectedPalette = [attribute,name]
            }
        // If there are selected fixtures then palette data gets sent to the manual channels
        } else {
            // Loop through palette data
            for(let i=0;i<keys.length;i++){
                // If selected fixture is in the palette data then set manual channels
                if(fixtureManager.selectedFixtures.includes(fixtureManager.getFixtureIndex(keys[i])) || fixtureManager.selectedFixtures.length == 0){
                    let fixture = fixtureManager.getFixture(keys[i])
                    let fixtureData = this.palettes[attribute][name].data[keys[i]]
                    // Loop through palette data and merge with manual channels
                    for(let j=0;j<fixtureData.length;j++){
                        if(fixtureData[j] !== false){
                            fixture.manualChannels[j] = [attribute,name]
                        }
                    }
                }
            }
        }
        // Update UI attributes so values update and reset palettes list so palettes can be highlighted
        ui.updateAttributes()
        ui.updatePalettesList()
    }
}