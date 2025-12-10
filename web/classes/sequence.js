class Sequence{
    constructor(name){
        this.name = name
        this.cues = {}
    }

    createEmptyCue(cueNumber){
        this.cues[parseFloat(cueNumber)] = new Cue()
    }

    store(cueNumber){
        let index = Object.keys(this.cues).indexOf(parseFloat(cueNumber))
        if(index != -1){
            this.cues[parseFloat(cueNumber)].store()
            console.log(true)
        }
    }
}