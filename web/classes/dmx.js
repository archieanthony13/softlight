class DMX{
    constructor(){
        // Initialise DMX output arrays
        this.data = new Array(512).fill(0)
        this.dataTypes = new Array(512).fill("default")
        this.universes = 1
    }

    // Function to update a specific channel in the DMX output to a given value
    updateChannel(channel, data){
        for(let i=0;i<data.length;i++){
            this.data[channel - 1 + i] = data[i]
        }
    }

    // Update the DMX output from a specific fixture
    updateChannelsFromFixture(name){
        let fixture = fixtureManager.getFixture(name)
        let universeOffset = 512 * (fixture.universe - 1)
        // Loop through all fixture channels
        for(let i=0;i<fixture.channels.length;i++){
            // Check values based on priority with manual being the most important and default being the least
            // Loop through based on priority and set the DMX output accordingly by offsetting the channel with the universe and fixture channel
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
            // If there is an array in the manual or sequence channels then it is referencing a palette
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

    // Function which updates the number of universes being used so DMX output can grow and shrink accordingly
    updateUniverses(){
        // Set universes to 0
        this.universes = 0
        // Loop through all fixtures and only update the universes variable if that fixture is in a larger universe
        for(let i=0;i<fixtureManager.fixtures.length;i++){
            this.universes = Math.max(fixtureManager.fixtures[i].universe, this.universes)
        }
        // Update DMX variable lengths accordingly
        this.data.length = 512 * this.universes
        this.dataTypes.length = 512 * this.universes
        // Ensure there are no null values as they should be set to 0 or default
        this.data = JSON.parse(JSON.stringify(this.data).replaceAll("null",0))
        this.dataTypes = JSON.parse(JSON.stringify(this.dataTypes).replaceAll("null","\"default\""))
    }

    // Update function which loops through all fixtures and updated the DMX array with their values
    update(){
        let fixtures = fixtureManager.fixtures
        for(let i=0;i<fixtures.length;i++){
            this.updateChannelsFromFixture(fixtures[i].name)
        }
    }

    // Return channel data for a specific fixture from the DMX array
    getFixtureData(fixtureName){
        let fixture = fixtureManager.getFixture(fixtureName)
        let universeOffset = 512 * (fixture.universe - 1)
        let beginningChannel = universeOffset + fixture.channel - 1
        let endChannel = universeOffset + beginningChannel + fixture.channelNames.length
        return this.data.slice(beginningChannel,endChannel)
    }

    // Return channel type data for a specific fixture from the DMX array
    getFixtureDataTypes(fixtureName){
        let fixture = fixtureManager.getFixture(fixtureName)
        let universeOffset = 512 * (fixture.universe - 1)
        let beginningChannel = universeOffset + fixture.channel - 1
        let endChannel = universeOffset + beginningChannel + fixture.channelNames.length
        return this.dataTypes.slice(beginningChannel,endChannel)
    }
}