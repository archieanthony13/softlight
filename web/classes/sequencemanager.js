class SequenceManager{
    constructor(){
        this.cueMenuElement = document.querySelector('.menu#cue-menu')
        this.cueMenuElementBottom = this.cueMenuElement.querySelector(".menu-bottom-section.cue-settings")
        this.menuActive = false
        this.sequences = {}
        this.selectedSequence = "1"

        let that = this
        this.cueMenuElement.querySelector("button#exit-cue").onclick = function(){
            that.toggleCueMenu()
            let cueNumber = parseFloat(that.cueMenuElement.querySelector("input#cue-settings-cue-number").value)
            let cueName = that.cueMenuElement.querySelector("input#cue-settings-cue-name").value
            that.store(cueNumber, undefined, cueName)
            console.log(cueNumber, cueName)
        }
        this.cueMenuElement.querySelector("button#cue-settings").onclick = function(){
            that.cueSettingsMenu()
        }
        this.cueMenuElement.querySelector("button#cue-timings").onclick = function(){
            that.cueTimingsMenu()
        }
    }

    createSequence(name){
        this.sequences[name] = new Sequence(name)
    }

    createEmptyCue(name, cueNumber, cueName){
        let index = Object.keys(this.sequences).indexOf(name)
        if(index != -1){
            this.sequences[name].createEmptyCue(cueNumber, cueName)
        }
        ui.updateCueList()
    }

    selectSequence(name){
        this.selectedSequence = name
    }

    store(cueNumber, name, cueName){
        let index = Object.keys(this.sequences).indexOf(name)
        if(index != -1){
            if(cueNumber === undefined){
                cueNumber = Math.floor(this.sequences[name].lastCue) + 1
                this.createEmptyCue(name, cueNumber)
            }
            this.sequences[name].store(cueNumber, cueName)
        } else {
            if(cueNumber === undefined){
                cueNumber = Math.floor(this.sequences[this.selectedSequence].lastCue) + 1
                this.createEmptyCue(this.selectedSequence, cueNumber)
            }
            this.sequences[this.selectedSequence].store(cueNumber, cueName)
        }

        ui.updateCueList()
    }

    go(name){
        let index = Object.keys(this.sequences).indexOf(name)
        if(index == -1){
            name = this.selectedSequence
        }
        this.sequences[name].go()
        if(name = this.selectedSequence){
            let cueList = document.querySelectorAll("#sequences-cuelist label")
            for(let i=0;i<cueList.length;i++){
                cueList[i].classList.remove("active-cue")
                if(this.sequences[name].cuesOrder[i] == this.sequences[name].currentCue){
                    cueList[i].classList.add("active-cue")
                }
            }
            console.log(cueList)
        }
    }

    toggleCueMenu(){
        this.menuActive = !this.menuActive
        if(this.menuActive){
            this.cueMenuElement.style.display = "grid"
            this.cueSettingsMenu()
        } else {
            this.cueMenuElement.style.display = "none"
        }
    }

    cueSettingsMenu(){
        this.cueMenuElementBottom = this.cueMenuElement.querySelector(".menu-bottom-section.cue-settings")
        this.cueMenuElement.querySelector('.menu-bottom-section.cue-settings').style.display = "grid"
        this.cueMenuElement.querySelector('.menu-bottom-section.cue-timings').style.display = "none"
        this.cueMenuElement.querySelector("button#cue-settings").classList.add("selected")
        this.cueMenuElement.querySelector("button#cue-timings").classList.remove("selected")
    }

    cueTimingsMenu(){
        this.cueMenuElementBottom = this.cueMenuElement.querySelector(".menu-bottom-section.cue-timings")
        this.cueMenuElement.querySelector('.menu-bottom-section.cue-settings').style.display = "none"
        this.cueMenuElement.querySelector('.menu-bottom-section.cue-timings').style.display = "grid"
        this.cueMenuElement.querySelector("button#cue-settings").classList.remove("selected")
        this.cueMenuElement.querySelector("button#cue-timings").classList.add("selected")
    }
}