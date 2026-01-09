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
            let timings = {
                "fade":{
                    "dimmer up":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-fade-dimmer-up").value)),
                    "dimmer down":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-fade-dimmer-down").value)),
                    "color":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-fade-color").value)),
                    "position":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-fade-position").value)),
                    "beam":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-fade-beam").value)),
                    "shape":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-fade-shape").value))
                },
                "delay":{
                    "dimmer up":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-delay-dimmer-up").value)),
                    "dimmer down":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-delay-dimmer-down").value)),
                    "color":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-delay-color").value)),
                    "position":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-delay-position").value)),
                    "beam":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-delay-beam").value)),
                    "shape":(parseFloat(that.cueMenuElement.querySelector("input#cue-timings-delay-shape").value))
                }
            }
            let mode = that.cueMenuElement.querySelector("select#cue-settings-store-mode").value
            that.store(cueNumber, undefined, cueName, timings, mode)
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
        } else {
            this.sequences[this.selectedSequence].createEmptyCue(cueNumber, cueName)
        }
        ui.updateCueList()
    }

    deleteCue(name, cueNumber){
        let index = Object.keys(this.sequences).indexOf(name)
        if(index != -1){
            this.sequences[name].deleteCue(cueNumber)
        } else {
            this.sequences[this.selectedSequence].deleteCue(cueNumber)
        }
        ui.updateCueList()
    }

    selectSequence(name){
        this.selectedSequence = name
    }

    store(cueNumber, name, cueName, timings, mode){
        let index = Object.keys(this.sequences).indexOf(name)
        if(index != -1){
            if(cueNumber === undefined || isNaN(cueNumber)){
                cueNumber = Math.floor(this.sequences[name].lastCue) + 1
                if(cueName === undefined || cueName == ""){
                    cueName = "Cue " + cueNumber
                }
                this.createEmptyCue(name, cueNumber, cueName)
            }
            this.sequences[name].store(cueNumber, cueName, timings, mode)
        } else {
            if(cueNumber === undefined || isNaN(cueNumber)){
                cueNumber = Math.floor(this.sequences[this.selectedSequence].lastCue) + 1
                if(cueName === undefined || cueName == ""){
                    cueName = "Cue " + cueNumber
                }
                this.createEmptyCue(this.selectedSequence, cueNumber, cueName)
            }
            this.sequences[this.selectedSequence].store(cueNumber, cueName, timings, mode)
        }

        ui.updateCueList()
    }

    go(name){
        let index = Object.keys(this.sequences).indexOf(name)
        if(index == -1){
            name = this.selectedSequence
        }
        this.sequences[name].go()
    }

    toggleCueMenu(){
        this.menuActive = !this.menuActive
        if(this.menuActive){
            this.cueMenuElement.style.display = "grid"
            let inputs = this.cueMenuElement.querySelectorAll("input")
            for(let i=0;i<inputs.length;i++){
                inputs[i].value = ""
            }
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

    update(timestamp){
        let cueList = document.querySelectorAll("#sequences-cuelist label")
        let sequenceKeys = Object.keys(this.sequences)
        for(let i=0;i<sequenceKeys.length;i++){
            this.sequences[sequenceKeys[i]].update(timestamp)
            if(this.sequences[sequenceKeys[i]].name == this.selectedSequence){
                for(let j=0;j<cueList.length;j++){
                    cueList[j].classList.remove("current-cue")
                    cueList[j].classList.remove("active-cue")
                    if(this.sequences[this.selectedSequence].cues[this.sequences[this.selectedSequence].cuesOrder[j]].active){
                        cueList[j].classList.add("active-cue")
                    }
                    if(this.sequences[this.selectedSequence].cuesOrder[j] == this.sequences[this.selectedSequence].currentCue){
                        cueList[j].classList.add("current-cue")
                    }
                }
            }
        }
    }
}