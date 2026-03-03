class DMX{
    constructor(){
        this.data = new Array(512).fill(0)
        this.dataTypes = new Array(512).fill("default")
        this.universes = 1
    }

    updateChannel(channel, data){
        for(let i=0;i<data.length;i++){
            this.data[channel - 1 + i] = data[i]
        }
    }

    updateChannelsFromFixture(name){
        let fixture = fixtureManager.getFixture(name)
        let universeOffset = 512 * (fixture.universe - 1)
        for(let i=0;i<fixture.channels.length;i++){
            if(!(fixture.manualChannels[i] instanceof Array) && !(fixture.channels[i] instanceof Array)){
                if(fixture.manualChannels[i] !== false){
                    this.data[universeOffset + fixture.channel - 1 + i] = fixture.manualChannels[i]
                    this.dataTypes[universeOffset + fixture.channel - 1 + i] = "manual"
                } else if(fixture.channels[i] !== false) {
                    this.data[universeOffset + fixture.channel - 1 + i] = fixture.channels[i]
                    this.dataTypes[universeOffset + fixture.channel - 1 + i] = "sequence"
                } else {
                    this.data[universeOffset + fixture.channel - 1 + i] = fixture.defaultChannels[i]
                    this.dataTypes[universeOffset + fixture.channel - 1 + i] = "default"
                }
            } else {
                if(fixture.manualChannels[i] !== false){
                    this.data[universeOffset + fixture.channel - 1 + i] = paletteManager.palettes[fixture.manualChannels[i][0]][fixture.manualChannels[i][1]].data[fixture.name][i]
                    this.dataTypes[universeOffset + fixture.channel - 1 + i] = "manual"
                } else if(fixture.channels[i] !== false) {
                    this.data[universeOffset + fixture.channel - 1 + i] = paletteManager.palettes[fixture.channels[i][0]][fixture.channels[i][1]].data[fixture.name][i]
                    this.dataTypes[universeOffset + fixture.channel - 1 + i] = "sequence"
                } else {
                    this.data[universeOffset + fixture.channel - 1 + i] = fixture.defaultChannels[i]
                    this.dataTypes[universeOffset + fixture.channel - 1 + i] = "default"
                }
            }
        }
    }

    updateUniverses(){
        this.universes = 0
        for(let i=0;i<fixtureManager.fixtures.length;i++){
            this.universes = Math.max(fixtureManager.fixtures[i].universe, this.universes)
        }
        this.data.length = 512 * this.universes
        this.dataTypes.length = 512 * this.universes
        this.data = JSON.parse(JSON.stringify(this.data).replaceAll("null",0))
        this.dataTypes = JSON.parse(JSON.stringify(this.dataTypes).replaceAll("null","\"default\""))
    }

    update(){
        let fixtures = fixtureManager.fixtures
        for(let i=0;i<fixtures.length;i++){
            this.updateChannelsFromFixture(fixtures[i].name)
        }
    }

    getFixtureData(fixtureName){
        let fixture = fixtureManager.getFixture(fixtureName)
        let universeOffset = 512 * (fixture.universe - 1)
        let beginningChannel = universeOffset + fixture.channel - 1
        let endChannel = universeOffset + beginningChannel + fixture.channelNames.length
        return this.data.slice(beginningChannel,endChannel)
    }

    getFixtureDataTypes(fixtureName){
        let fixture = fixtureManager.getFixture(fixtureName)
        let universeOffset = 512 * (fixture.universe - 1)
        let beginningChannel = universeOffset + fixture.channel - 1
        let endChannel = universeOffset + beginningChannel + fixture.channelNames.length
        return this.dataTypes.slice(beginningChannel,endChannel)
    }
}