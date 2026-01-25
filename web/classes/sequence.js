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

    deleteFixtureByName(fixtureName){
        for(let i=0;i<this.cuesOrder.length;i++){
            this.cues[this.cuesOrder[i]].deleteFixtureByName(fixtureName)
        }
    }

    store(cueNumber, cueName, timings, mode){
        let index = Object.keys(this.cues).indexOf(parseFloat(cueNumber).toString())
        if(index != -1){
            this.cues[parseFloat(cueNumber)].store(timings, mode)
        } else {
            if(cueName === undefined || cueName == ""){
                cueName = "Cue " + cueNumber
            }
            this.createEmptyCue(cueNumber, cueName)
            this.cues[parseFloat(cueNumber)].store(timings, mode)
        }
    }

    go(){
        let index = this.cuesOrder.indexOf(this.currentCue)
        if(index + 1 < this.cuesOrder.length){
            this.currentCue = this.cuesOrder[index+1]
            this.cues[this.currentCue].go()
        } else {
            this.currentCue = this.cuesOrder[0]
            this.trackToCue(this.currentCue)
        }

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

    update(timestamp){
        for(let i=0;i<this.cuesOrder.length;i++){
            this.cues[this.cuesOrder[i]].update(timestamp, this.name)
        }
    }

    trackToCue(cueNumber){
        for(let i=0;i<fixtureManager.fixtures.length;i++){
            fixtureManager.fixtures[0].channels.fill(false)
        }
        let iteration = this.cuesOrder.indexOf(cueNumber)
        for(let i=0;i<iteration;i++){
            this.cues[this.cuesOrder[i]].track()
        }
        this.currentCue = cueNumber
        this.cues[cueNumber].go()
    }
}