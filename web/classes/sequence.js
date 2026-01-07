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
        this.cuesOrder.push(parseFloat(cueNumber))
        this.updateVariables()
    }

    store(cueNumber, cueName, timings){
        let index = Object.keys(this.cues).indexOf(parseFloat(cueNumber).toString())
        if(index != -1){
            this.cues[parseFloat(cueNumber)].store(timings)
        } else {
            if(cueName === undefined || cueName == ""){
                cueName = "Cue " + cueNumber
            }
            this.createEmptyCue(cueNumber, cueName)
            this.cues[parseFloat(cueNumber)].store(timings)
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

    deleteCue(cueNumber){
        delete this.cues[cueNumber]
        delete this.cuesOrder.splice(this.cuesOrder.indexOf(cueNumber),1)
        this.updateVariables()
    }

    updateVariables(){
        this.cuesOrder = this.cuesOrder.sort((a,b) => a-b)
        this.lastCue = this.cuesOrder[this.cuesOrder.length - 1]
    }
}