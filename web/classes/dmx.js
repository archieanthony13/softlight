class DMX{
    constructor(){
        this.data = new Array(512).fill(0)
    }

    updateChannel(channel, data){
        for(let i=0;i<data.length;i++){
            this.data[channel - 1 + i] = data[i]
        }
    }

    updateChannelsFromFixture(name){
        let fixture = fixtureManager.getFixture(name)
        for(let i=0;i<fixture.channels.length;i++){
            if(fixture.manualChannels[i] !== false){
                this.data[fixture.channel - 1 + i] = fixture.manualChannels[i]
            } else if(fixture.channels[i] !== false) {
                this.data[fixture.channel - 1 + i] = fixture.channels[i]
            } else {
                this.data[fixture.channel - 1 + i] = fixture.defaultChannels[i]
            }
        }
    }

    update(){
        let fixtures = fixtureManager.fixtures
        for(let i=0;i<fixtures.length;i++){
            this.updateChannelsFromFixture(fixtures[i].name)
        }
    }
}