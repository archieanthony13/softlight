class SequenceManager{
    constructor(){
        this.sequences = {}
        this.selectedSequence = "1"
    }

    createSequence(name){
        this.sequences[name] = new Sequence(name)
    }

    createEmptyCue(name, cueNumber){
        let index = Object.keys(this.sequences).indexOf(name)
        if(index != -1){
            this.sequences[name].createEmptyCue(cueNumber)
        }
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
        if(index != -1){
            this.sequences[name].go()
        } else {
            this.sequences[this.selectedSequence].go()
        }
    }
}