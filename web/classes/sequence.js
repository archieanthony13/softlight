class Sequence{
    constructor(name){
        this.name = name
        this.cues = {}
        this.lastCue = 0
        this.currentCue = 0
        this.cuesOrder = []
    }

    createEmptyCue(cueNumber, cueName){
        this.cues[parseFloat(cueNumber)] = new Cue(cueName)
        this.lastCue = Math.max(parseFloat(cueNumber), this.lastCue)
        this.cuesOrder.push(parseFloat(cueNumber))
        this.cuesOrder = this.cuesOrder.sort()
    }

    store(cueNumber){
        let index = Object.keys(this.cues).indexOf(parseFloat(cueNumber).toString())
        if(index != -1){
            this.cues[parseFloat(cueNumber)].store()
        }
    }

    go(){
        let index = this.cuesOrder.indexOf(this.currentCue)
        if(index + 1 < this.cuesOrder.length){
            this.currentCue = this.cuesOrder[index+1]
        } else {
            this.currentCue = this.cuesOrder[0]
        }

        this.cues[this.currentCue].go()
    }
}