class Sequence{
    constructor(name){
        this.name = name
        this.cues = {}
        this.lastCue = 0
        this.currentCue = 0
    }

    createEmptyCue(cueNumber){
        this.cues[parseFloat(cueNumber)] = new Cue()
        this.lastCue = Math.max(parseFloat(cueNumber), this.lastCue)
    }

    store(cueNumber){
        let index = Object.keys(this.cues).indexOf(parseFloat(cueNumber).toString())
        if(index != -1){
            this.cues[parseFloat(cueNumber)].store()
        }
    }
}