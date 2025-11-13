class Settings{
    constructor(){
        this.settingsElement = document.querySelector('.menu#settings-menu')
        this.settingsElementBottom = this.settingsElement.querySelector(".menu-bottom-bottom-section.fixture-list")
        this.active = false

        let that = this
        this.settingsElement.querySelector("button#exit-settings").onclick = function(){
            that.toggleSettingsMenu()
        }
        this.settingsElement.querySelector("button#save-page").onclick = function(){
            that.saveMenu()
        }
        this.settingsElement.querySelector("button#network-page").onclick = function(){
            that.networkMenu()
        }
        this.settingsElement.querySelector("#network-save-preferences").onclick = function(){
            that.updateNetworkPreferences()
        }
        this.settingsElement.querySelector('#network-reset').onclick = function(){
            that.resetNetworkPreferences()
        }
    }

    toggleSettingsMenu(){
        this.active = !this.active
        if(this.active){
            this.settingsElement.style.display = "grid"
            this.saveMenu()
        } else {
            this.settingsElement.style.display = "none"
        }
    }

    saveMenu(){
        this.settingsElementBottom = this.settingsElement.querySelector(".menu-bottom-bottom-section.save-page")
        this.settingsElement.querySelector('.menu-bottom-section.save-page').style.display = "grid"
        this.settingsElement.querySelector('.menu-bottom-section.network-page').style.display = "none"
    }

    networkMenu(){
        this.settingsElementBottom = this.settingsElement.querySelector(".menu-bottom-bottom-section.network-page")
        this.settingsElement.querySelector('.menu-bottom-section.save-page').style.display = "none"
        this.settingsElement.querySelector('.menu-bottom-section.network-page').style.display = "grid"
        let ip = this.settingsElementBottom.querySelector('#settings-network-ip-address')
        let websocket = this.settingsElementBottom.querySelector('#settings-network-websocket-address')
        ip.value = artnet.ip
        websocket.value = artnet.websocket
    }

    updateNetworkPreferences(){
        let ip = this.settingsElementBottom.querySelector('#settings-network-ip-address').value
        let websocket = this.settingsElementBottom.querySelector('#settings-network-websocket-address').value
        artnet.changeIp(ip)
        artnet.changeWebsocket(websocket)
    }

    resetNetworkPreferences(){
        let ip = this.settingsElementBottom.querySelector('#settings-network-ip-address')
        let websocket = this.settingsElementBottom.querySelector('#settings-network-websocket-address')
        ip.value = "0.0.0.0"
        websocket.value = "ws://localhost:8765"
        artnet.changeIp(ip.value)
        artnet.changeWebsocket(websocket.value)
    }
}