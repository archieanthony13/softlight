class SequenceManager{
    constructor(){
        this.sequences = {}
        this.selectedSequence = "1"
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

    store(name, cueNumber){
        let index = Object.keys(this.sequences).indexOf(name)
        if(index != -1){
            if(cueNumber === undefined){
                cueNumber = Math.floor(this.sequences[name].lastCue) + 1
                this.createEmptyCue(name, cueNumber)
            }
            this.sequences[name].store(cueNumber)
        } else {
            if(cueNumber === undefined){
                cueNumber = Math.floor(this.sequences[this.selectedSequence].lastCue) + 1
                this.createEmptyCue(this.selectedSequence, cueNumber)
            }
            this.sequences[this.selectedSequence].store(cueNumber)
        }
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
}