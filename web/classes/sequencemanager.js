class SequenceManager{
    constructor(){
        this.cueMenuElement = document.querySelector('.menu#cue-menu')
        this.cueMenuElementBottom = this.cueMenuElement.querySelector(".menu-bottom-section.cue-settings")
        this.sequenceMenuElement = document.querySelector('.menu#sequence-menu')
        this.sequenceMenuElementBottom = this.sequenceMenuElement.querySelector(".menu-bottom-section")
        this.menuActive = false
        this.sequences = {}
        this.selectedSequence = "1"
        this.selectedCue = null

        let that = this
        document.getElementById('cues-cuelist').onchange = function(){
            that.updateSelectedCue()
        }
        this.cueMenuElement.querySelector("button#exit-cue").onclick = function(){
            that.toggleCueMenu()
        }
        this.cueMenuElement.querySelector("button#exit-edit-cue").onclick = function(){
            that.toggleCueMenu()
        }
        this.cueMenuElement.querySelector("button#cue-store").onclick = function(){
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
        this.cueMenuElement.querySelector("button#cue-edit-save").onclick = function(){
            that.toggleCueMenu()
            let cueNumber = parseFloat(that.cueMenuElement.querySelector("input#cue-edit-settings-cue-number").value)
            let cueName = that.cueMenuElement.querySelector("input#cue-edit-settings-cue-name").value
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
            that.sequences[that.selectedSequence].cues[that.selectedCue].timings = timings
            that.sequences[that.selectedSequence].cues[that.selectedCue].updateTotalTime()
            that.sequences[that.selectedSequence].cues[that.selectedCue].name = cueName
            that.moveCue(that.selectedSequence,that.selectedCue,cueNumber)
            that.updateSelectedCue()
        }
        this.cueMenuElement.querySelector("button#cue-settings").onclick = function(){
            that.cueSettingsMenu()
        }
        this.cueMenuElement.querySelector("button#cue-timings").onclick = function(){
            that.cueTimingsMenu()
        }
        this.cueMenuElement.querySelector("button#cue-edit-settings").onclick = function(){
            that.cueEditSettingsMenu()
        }
        this.cueMenuElement.querySelector("button#cue-edit-timings").onclick = function(){
            that.cueTimingsMenu()
        }

        this.sequenceMenuElement.querySelector("button#exit-sequence").onclick = function(){
            that.toggleSequenceMenu()
        }
        this.sequenceMenuElement.querySelector("button#sequence-create-sequence").onclick = function(){
            let name = that.sequenceMenuElementBottom.querySelector("input").value
            that.createSequence(name)
            that.toggleSequenceMenu()
        }
    }

    createSequence(name){
        this.sequences[name] = new Sequence(name)
        this.createEmptyCue(name,0,"Cue 0")
        ui.updateSequencesList()
    }

    deleteFixtureByName(fixtureName){
        let keys = Object.keys(this.sequences)
        for(let i=0;i<keys.length;i++){
            this.sequences[keys[i]].deleteFixtureByName(fixtureName)
        }
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

    moveCue(name, cueNumber, newNumber){
        let index = Object.keys(this.sequences).indexOf(name)
        if(index != -1){
            this.sequences[name].moveCue(cueNumber, newNumber)
        } else {
            this.sequences[this.selectedSequence].moveCue(cueNumber, newNumber)
        }
        ui.updateCueList()
    }

    deleteSequence(name){
        let index = Object.keys(this.sequences).indexOf(name)
        if(index == -1){
            name = this.selectedSequence
        }
        delete this.sequences[name]
        for(let i=0;i<fixtureManager.fixtures.length;i++){
            delete fixtureManager.fixtures[i].sequenceChannels[name]
        }
        ui.updateSequencesList()
        ui.updateCueList()
    }

    selectSequence(name){
        this.selectedSequence = name
        ui.updateCueList()
        ui.updateSequencesList()
    }

    store(cueNumber, name, cueName, timings, mode){
        let index = Object.keys(this.sequences).indexOf(name)
        if(index != -1){
            if(cueNumber === undefined || isNaN(cueNumber)){
                cueNumber = (Math.floor(this.sequences[name].lastCue) + 1 || 0)
                if(cueName === undefined || cueName == ""){
                    cueName = "Cue " + cueNumber
                }
                this.createEmptyCue(name, cueNumber, cueName)
            }
            this.sequences[name].store(cueNumber, cueName, timings, mode)
        } else {
            if(cueNumber === undefined || isNaN(cueNumber)){
                cueNumber = (Math.floor(this.sequences[this.selectedSequence].lastCue) + 1 || 0)
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
        if(name == this.selectedSequence){
            ui.scrollCueList()
        }
    }

    toggleCueMenu(){
        this.menuActive = !this.menuActive
        if(this.menuActive){
            this.cueMenuElement.style.display = "grid"
            document.querySelector(".container").style.opacity = "0.25"
            let inputs = this.cueMenuElement.querySelectorAll("input")
            for(let i=0;i<inputs.length;i++){
                inputs[i].value = ""
            }
            document.getElementById('cue-store-section').style.display = "grid"
            document.getElementById('cue-edit-section').style.display = "none"
            this.cueSettingsMenu()
        } else {
            this.cueMenuElement.style.display = "none"
            document.querySelector(".container").style.opacity = "1"
        }
    }

    toggleEditCueMenu(){
        this.menuActive = !this.menuActive
        if(this.menuActive){
            this.cueMenuElement.style.display = "grid"
            document.querySelector(".container").style.opacity = "0.25"
            let inputs = this.cueMenuElement.querySelectorAll(".cue-edit-settings input")
            inputs[0].value = this.selectedCue
            inputs[1].value = sequenceManager.sequences[this.selectedSequence].cues[this.selectedCue].name
            inputs = this.cueMenuElement.querySelectorAll(".cue-timings input")
            inputs[0].value = sequenceManager.sequences[this.selectedSequence].cues[this.selectedCue].timings.fade["dimmer up"]
            inputs[1].value = sequenceManager.sequences[this.selectedSequence].cues[this.selectedCue].timings.fade["dimmer down"]
            inputs[2].value = sequenceManager.sequences[this.selectedSequence].cues[this.selectedCue].timings.fade["color"]
            inputs[3].value = sequenceManager.sequences[this.selectedSequence].cues[this.selectedCue].timings.fade["position"]
            inputs[4].value = sequenceManager.sequences[this.selectedSequence].cues[this.selectedCue].timings.fade["beam"]
            inputs[5].value = sequenceManager.sequences[this.selectedSequence].cues[this.selectedCue].timings.fade["shape"]
            inputs[6].value = sequenceManager.sequences[this.selectedSequence].cues[this.selectedCue].timings.delay["dimmer up"]
            inputs[7].value = sequenceManager.sequences[this.selectedSequence].cues[this.selectedCue].timings.delay["dimmer down"]
            inputs[8].value = sequenceManager.sequences[this.selectedSequence].cues[this.selectedCue].timings.delay["color"]
            inputs[9].value = sequenceManager.sequences[this.selectedSequence].cues[this.selectedCue].timings.delay["position"]
            inputs[10].value = sequenceManager.sequences[this.selectedSequence].cues[this.selectedCue].timings.delay["beam"]
            inputs[11].value = sequenceManager.sequences[this.selectedSequence].cues[this.selectedCue].timings.delay["shape"]
            document.getElementById('cue-store-section').style.display = "none"
            document.getElementById('cue-edit-section').style.display = "grid"
            this.cueEditSettingsMenu()
        } else {
            this.cueMenuElement.style.display = "none"
            document.querySelector(".container").style.opacity = "1"
        }
    }

    cueSettingsMenu(){
        this.cueMenuElementBottom = this.cueMenuElement.querySelector(".menu-bottom-section.cue-settings")
        this.cueMenuElement.querySelector('.menu-bottom-section.cue-settings').style.display = "grid"
        this.cueMenuElement.querySelector('.menu-bottom-section.cue-edit-settings').style.display = "none"
        this.cueMenuElement.querySelector('.menu-bottom-section.cue-timings').style.display = "none"
        this.cueMenuElement.querySelector("button#cue-settings").classList.add("selected")
        this.cueMenuElement.querySelector("button#cue-edit-settings").classList.remove("selected")
        this.cueMenuElement.querySelector("button#cue-timings").classList.remove("selected")
        this.cueMenuElement.querySelector("button#cue-edit-timings").classList.remove("selected")
    }

    cueEditSettingsMenu(){
        this.cueMenuElementBottom = this.cueMenuElement.querySelector(".menu-bottom-section.cue-edit-settings")
        this.cueMenuElement.querySelector('.menu-bottom-section.cue-settings').style.display = "none"
        this.cueMenuElement.querySelector('.menu-bottom-section.cue-edit-settings').style.display = "grid"
        this.cueMenuElement.querySelector('.menu-bottom-section.cue-timings').style.display = "none"
        this.cueMenuElement.querySelector("button#cue-settings").classList.remove("selected")
        this.cueMenuElement.querySelector("button#cue-edit-settings").classList.add("selected")
        this.cueMenuElement.querySelector("button#cue-timings").classList.remove("selected")
        this.cueMenuElement.querySelector("button#cue-edit-timings").classList.remove("selected")
    }

    cueTimingsMenu(){
        this.cueMenuElementBottom = this.cueMenuElement.querySelector(".menu-bottom-section.cue-timings")
        this.cueMenuElement.querySelector('.menu-bottom-section.cue-settings').style.display = "none"
        this.cueMenuElement.querySelector('.menu-bottom-section.cue-edit-settings').style.display = "none"
        this.cueMenuElement.querySelector('.menu-bottom-section.cue-timings').style.display = "grid"
        this.cueMenuElement.querySelector("button#cue-settings").classList.remove("selected")
        this.cueMenuElement.querySelector("button#cue-edit-settings").classList.remove("selected")
        this.cueMenuElement.querySelector("button#cue-timings").classList.add("selected")
        this.cueMenuElement.querySelector("button#cue-edit-timings").classList.add("selected")
    }

    toggleSequenceMenu(){
        this.menuActive = !this.menuActive
        if(this.menuActive){
            this.sequenceMenuElement.style.display = "grid"
            document.querySelector(".container").style.opacity = "0.25"
        } else {
            this.sequenceMenuElement.style.display = "none"
            document.querySelector(".container").style.opacity = "1"
        }
    }

    updateSelectedCue(){
        let selectedCues = document.querySelectorAll('#cues-cuelist input:checked')
        if(selectedCues.length == 0){
            this.selectedCue = null
        }
        else if(selectedCues.length == 1){
            this.selectedCue = parseFloat(selectedCues[0].dataset.cueNumber)
        } else {
            for(let i=0;i<selectedCues.length-1;i++){
                selectedCues[i].checked = false
            }
            this.selectedCue = parseFloat(selectedCues[selectedCues.length-1].dataset.cueNumber)
        }
    }

    update(timestamp){
        let cueList = document.querySelectorAll("#cues-cuelist label")
        let sequenceKeys = Object.keys(this.sequences)
        for(let i=0;i<sequenceKeys.length;i++){
            this.sequences[sequenceKeys[i]].update(timestamp)
            if(this.sequences[sequenceKeys[i]].name == this.selectedSequence){
                for(let j=0;j<cueList.length;j++){
                    cueList[j].classList.remove("current-cue")
                    cueList[j].classList.remove("active-cue")
                    if(this.sequences[this.selectedSequence].cues[this.sequences[this.selectedSequence].cuesOrder[j]].active){
                        cueList[j].classList.add("active-cue")
                        cueList[j].style.setProperty("--percentage",this.sequences[this.selectedSequence].cues[this.sequences[this.selectedSequence].cuesOrder[j]].percentage + "%")
                    }
                    if(this.sequences[this.selectedSequence].cuesOrder[j] == this.sequences[this.selectedSequence].currentCue){
                        cueList[j].classList.add("current-cue")
                    }
                }
            }
        }
    }
}