class Palette{
    constructor(dataType){
        this.data = {}
        this.dataType = dataType
    }

    store(mode){
        if(mode === undefined || mode == "overwrite"){
            let fixtures = fixtureManager.fixtures
            for(let i=0;i<fixtures.length;i++){
                this.data[fixtures[i].name] = JSON.parse(JSON.stringify(fixtures[i].manualChannels))
            }
            this.timings = timings
        } else if(mode == "merge"){
            let fixtures = fixtureManager.fixtures
            for(let i=0;i<fixtures.length;i++){
                if(this.data[fixtures[i].name] === undefined){
                    this.data[fixtures[i].name] = []
                }
                for(let j=0;j<fixtures[i].manualChannels.length;j++){
                    if(fixtures[i].channelTypes[j] == this.dataType){
                        if(fixtures[i].manualChannels[j] !== false){
                            this.data[fixtures[i].name][j] = JSON.parse(JSON.stringify(fixtures[i].manualChannels[j]))
                        } else if(this.data[fixtures[i].name][j] === undefined){
                            this.data[fixtures[i].name][j] = false
                        }
                    } else {
                        this.data[fixtures[i].name][j] = false
                    }
                }
            }
        }
    }
}