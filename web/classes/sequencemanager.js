class SequenceManager{
    constructor(){
        this.sequences = []
    }

    createSequence(name){
        this.sequences.push(new Sequence(name))
    }

    creatEmptyCue(name, cueNumber){
        let index = this.sequences.indexOf(name)
        if(index != -1){
            this.sequences[index].createEmptyCue(cueNumber)
        }
    }

    store(name, cueNumber){
        let index = this.sequences.indexOf(name)
        if(index != -1){
            this.sequences[index].store(cueNumber)
        }
    }
}