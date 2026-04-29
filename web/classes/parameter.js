class Parameter {
    constructor(){
        // Initialise menu elements
        this.parameterElement = document.querySelector('.menu#parameter-menu')
        this.parameterElementBottom = this.parameterElement.querySelector(".menu-bottom-bottom-section.raw-value")
        this.active = false

        // Initialise variables
        this.parameter = ""
        this.value = 0
        this.bits = 1
        this.pixel = 1

        // DOM button events within the parameter menu
        let that = this
        // Exit parameter menu
        this.parameterElement.querySelector("button#exit-parameter").onclick = function(){
            that.toggleParameterMenu()
        }
        // Open the raw value tab
        this.parameterElement.querySelector("button#raw-value").onclick = function(){
            that.rawValueMenu()
        }
        // Open the list values tab
        this.parameterElement.querySelector("button#list-values").onclick = function(){
            that.listValueMenu()
        }
        // Open the pixel values tab
        this.parameterElement.querySelector("button#pixel-values").onclick = function(){
            that.pixelValueMenu()
        }
        // Set the channel data to be the minimum value (0)
        this.parameterElement.querySelector("button#raw-value-min").onclick = function(){
            let input = that.parameterElement.querySelector("input#parameter-raw-value")
            input.value = input.min
            // Updates channels
            input.onkeyup()
        }
        // Set the channel data to be the maximum value (255 or 65535)
        this.parameterElement.querySelector("button#raw-value-max").onclick = function(){
            let input = that.parameterElement.querySelector("input#parameter-raw-value")
            input.value = input.max
            // Updates channels
            input.onkeyup()
        }
        // Set the channel data to be the middle value (128 or 32768)
        this.parameterElement.querySelector("button#raw-value-half").onclick = function(){
            let input = that.parameterElement.querySelector("input#parameter-raw-value")
            input.value = Math.ceil((input.max - input.min)/2)
            // Updates channels
            input.onkeyup()
        }
        // Update fixture manual channels based on input
        this.parameterElement.querySelector("input#parameter-raw-value").onkeyup = function(){
            // Ensure value is within the mix and max
            let value = parseInt(this.value)
            let min = parseInt(this.min)
            let max = parseInt(this.max)
            if(value < min) {
                value = min
            } else if(value > max){
                value = max
            }
            // Set menu variables as well as input value to the constrained value
            that.value = value
            this.value = value
            // Update fixture manual channels
            fixtureManager.updateSelectedFixtureManualChannel(that.parameter, that.value, that.bits)
            ui.updateAttributes()
        }
        // Update channels when input is changed
        this.parameterElement.querySelector("input#parameter-raw-value").onchange = function(){
            this.onkeyup()
        }
    }

    // Function to toggle the paramaterm menu
    toggleParameterMenu(){
        // Toggle menu active
        this.active = !this.active
        if(this.active){
            // Show menu
            this.parameterElement.style.display = "grid"
            // Set background opacity
            document.querySelector(".container").style.opacity = "0.25"
            // Open the raw value tab
            this.rawValueMenu()
        } else {
            // Close menu
            this.parameterElement.style.display = "none"
            // Reset background opacity
            document.querySelector(".container").style.opacity = "1"
        }
    }

    // Function to open the raw value tab
    rawValueMenu(){
        // Update menu elements so correct tab is displayed
        this.parameterElementBottom = this.parameterElement.querySelector(".menu-bottom-section.raw-value")
        this.parameterElement.querySelector('.menu-bottom-section.raw-value').style.display = "grid"
        this.parameterElement.querySelector('.menu-bottom-section.list-values').style.display = "none"
        this.parameterElement.querySelector('.menu-bottom-section.pixel-values').style.display = "none"
        this.parameterElement.querySelector("button#raw-value").classList.add("selected")
        this.parameterElement.querySelector("button#list-values").classList.remove("selected")
        this.parameterElement.querySelector("button#pixel-values").classList.remove("selected")
        
        // Get the input within the tab
        let input = this.parameterElementBottom.querySelector("input#parameter-raw-value")
        // Set max value based on how many channels are required for that attribute
        if(this.bits == 1){
            input.max = 255
            this.parameterElementBottom.querySelector("p#parameter-range").innerHTML = "Min: 0, Max: 255"
        } else {
            input.max = 65535
            this.parameterElementBottom.querySelector("p#parameter-range").innerHTML = "Min: 0, Max: 65535"
        }
        // Set the input value to be the value in the paramater object
        input.value = this.value
        // Highlight the input so user can type straight away
        this.parameterElement.querySelector("input#parameter-raw-value").select()
    }

    // Function to open the list value tab
    listValueMenu(){
        // Update menu elements so correct tab is displayed
        this.parameterElementBottom = this.parameterElement.querySelector(".menu-bottom-section.list-values")
        this.parameterElement.querySelector('.menu-bottom-section.raw-value').style.display = "none"
        this.parameterElement.querySelector('.menu-bottom-section.list-values').style.display = "grid"
        this.parameterElement.querySelector('.menu-bottom-section.pixel-values').style.display = "none"
        this.parameterElement.querySelector("button#raw-value").classList.remove("selected")
        this.parameterElement.querySelector("button#list-values").classList.add("selected")
        this.parameterElement.querySelector("button#pixel-values").classList.remove("selected")

        // Create temporary arrays to store list values and fixture types
        let listValues = []
        let fixtures = []
        // Loop through all selected fixtures
        for(let i=0;i<fixtureManager.selectedFixtures.length;i++){
            let fixture = fixtureManager.fixtures[fixtureManager.selectedFixtures[i]]
            // If the fixture type is not in the fixtures array then it hasn't added list values yet
            // This check prevents fixtures of the same fixture type having multiple list values
            if(fixtures.indexOf(fixture.fixtureProfile.manufacturer + fixture.fixtureProfile.name)){
                // Add the list values from the fixture profile parameter to a temp array
                let fixtureList = fixture.fixtureProfile.channels[this.parameter].listValues
                // If this exists then add it to the array
                if(fixtureList){
                    listValues = listValues.concat(fixtureList)
                }
                // Add the fixture type to the array so it does not get searched again
                fixtures.push(fixture.fixtureProfile.manufacturer + fixture.fixtureProfile.name)
            }
        }
        // Get the select element within the tab and reset its values
        let selectElement = this.parameterElementBottom.querySelector("select")
        selectElement.innerHTML = ""
        // Loop through the list values found
        for(let i=0;i<listValues.length;i++){
            // Create an option element
            let option = document.createElement("option")
            // Get values from the list value to calculate the middle value
            let min = listValues[i].startValue
            let max = listValues[i].endValue
            let middle = Math.round(min + (max - min)/2)
            // Set the option value to the middle value
            option.value = middle
            // Give the option text to be the description
            option.innerHTML = listValues[i].description
            // Add the option element to the select
            selectElement.append(option)
            // Set the select element value based on which list value the current channel is set to
            if(this.value >= min && this.value <= max){
                selectElement.value = middle
            }
        }
        // Add an update function to the select element
        let that = this
        selectElement.onchange = function(){
            // Get the value from the select element
            let value = parseInt(this.value)
            // Set parameter menu value to this so it can be updated in the raw value menu
            that.value = value
            // Update fixture manual channels to this value
            fixtureManager.updateSelectedFixtureManualChannel(that.parameter,this.value,that.bits)
            // Update UI attributes so values update live
            ui.updateAttributes()
        }
    }

    // Function to open the pixel value tab
    pixelValueMenu(){
        // Update menu elements so correct tab is displayed
        this.parameterElementBottom = this.parameterElement.querySelector(".menu-bottom-bottom-section.raw-value")
        this.parameterElement.querySelector('.menu-bottom-section.raw-value').style.display = "none"
        this.parameterElement.querySelector('.menu-bottom-section.list-values').style.display = "none"
        this.parameterElement.querySelector('.menu-bottom-section.pixel-values').style.display = "grid"
        this.parameterElement.querySelector("button#raw-value").classList.remove("selected")
        this.parameterElement.querySelector("button#list-values").classList.remove("selected")
        this.parameterElement.querySelector("button#pixel-values").classList.add("selected")
    }
}