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
    }
}