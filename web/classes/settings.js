class Settings{
    constructor(){
        // Initialise menu elements
        this.settingsElement = document.querySelector('.menu#settings-menu')
        this.settingsElementBottom = this.settingsElement.querySelector(".menu-bottom-bottom-section.fixture-list")
        this.active = false

        // DOM button events within the settings menu
        let that = this
        // Exit the settings menu
        this.settingsElement.querySelector("button#exit-settings").onclick = function(){
            that.toggleSettingsMenu()
        }
        // Open the save tab
        this.settingsElement.querySelector("button#save-page").onclick = function(){
            that.saveMenu()
        }
        // Open the network tab
        this.settingsElement.querySelector("button#network-page").onclick = function(){
            that.networkMenu()
        }
        // Save network preferences
        this.settingsElement.querySelector("#network-save-preferences").onclick = function(){
            that.updateNetworkPreferences()
        }
        // Reset network preferences
        this.settingsElement.querySelector('#network-reset').onclick = function(){
            that.resetNetworkPreferences()
        }
        // Save showfile to file
        this.settingsElement.querySelector('button#save-to-file').onclick = function(){
            save.saveToFile()
        }
        // Save showfile to the local storage
        this.settingsElement.querySelector('button#save-to-browser').onclick = function(){
            save.saveToBrowser()
        }
        // Load showfile from a file
        this.settingsElement.querySelector('button#load-from-file').onclick = function(){
            save.loadFromFile()
        }
        // Load showfile from the local storage
        this.settingsElement.querySelector('button#load-from-browser').onclick = function(){
            save.loadFromBrowser()
        }
        // Load a blank showfile
        this.settingsElement.querySelector('button#new-showfile').onclick = function(){
            save.newShowfile()
        }
    }

    // Function to toggle the settings menu
    toggleSettingsMenu(){
        // Toggle menu active
        this.active = !this.active
        if(this.active){
            // Show menu
            this.settingsElement.style.display = "grid"
            // Set background opacity
            document.querySelector(".container").style.opacity = "0.25"
            // Open the save tab
            this.saveMenu()
        } else {
            // Close the menu
            this.settingsElement.style.display = "none"
            // Reset background opacity
            document.querySelector(".container").style.opacity = "1"
        }
    }

    // Function to open the save tab
    saveMenu(){
        this.settingsElementBottom = this.settingsElement.querySelector(".menu-bottom-bottom-section.save-page")
        this.settingsElement.querySelector('.menu-bottom-section.save-page').style.display = "grid"
        this.settingsElement.querySelector('.menu-bottom-section.network-page').style.display = "none"
        this.settingsElement.querySelector("button#save-page").classList.add("selected")
        this.settingsElement.querySelector("button#network-page").classList.remove("selected")
    }

    // Function to open the network tab
    networkMenu(){
        this.settingsElementBottom = this.settingsElement.querySelector(".menu-bottom-bottom-section.network-page")
        this.settingsElement.querySelector('.menu-bottom-section.save-page').style.display = "none"
        this.settingsElement.querySelector('.menu-bottom-section.network-page').style.display = "grid"
        this.settingsElement.querySelector("button#save-page").classList.remove("selected")
        this.settingsElement.querySelector("button#network-page").classList.add("selected")
        // Fill inputs with network information
        let ip = this.settingsElementBottom.querySelector('#settings-network-ip-address')
        let websocket = this.settingsElementBottom.querySelector('#settings-network-websocket-address')
        ip.value = artnet.ip
        websocket.value = artnet.websocket
    }

    // Function to update the network preferences
    updateNetworkPreferences(){
        // Get user input
        let ip = this.settingsElementBottom.querySelector('#settings-network-ip-address').value
        let websocket = this.settingsElementBottom.querySelector('#settings-network-websocket-address').value
        // Update in the Art-Net class
        artnet.changeIp(ip)
        artnet.changeWebsocket(websocket)
    }

    // Function to reset the network preferences
    resetNetworkPreferences(){
        // Get inputs
        let ip = this.settingsElementBottom.querySelector('#settings-network-ip-address')
        let websocket = this.settingsElementBottom.querySelector('#settings-network-websocket-address')
        // Reset input values
        ip.value = "0.0.0.0"
        websocket.value = "ws://localhost:8765"
        // Update in the Art-Net class
        artnet.changeIp(ip.value)
        artnet.changeWebsocket(websocket.value)
    }
}