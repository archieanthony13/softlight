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
            this.sequences[name].store(cueNumber)
        }
    }

    go(name){
        let index = Object.keys(this.sequences).indexOf(name)
        if(index != -1){
            this.sequences[name].go()
        }
    }
}