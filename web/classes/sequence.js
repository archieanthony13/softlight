class Sequence{
    constructor(name){
        this.name = name
        this.cues = {}
    }

    createEmptyCue(cueNumber){
        this.cues[parseFloat(cueNumber)] = new Cue()
    }

    store(cueNumber){
        let index = Object.keys(this.cues).indexOf(cueNumber)
        if(index != -1){
            this.cues[cueNumber].store(cueNumber)
        }
    }
}