class SequenceManager{
    constructor(){
        this.sequences = {}
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

    store(name, cueNumber){
        let index = Object.keys(this.sequences).indexOf(name)
        if(index != -1){
            this.sequences[name].store(cueNumber)
        }
    }
}