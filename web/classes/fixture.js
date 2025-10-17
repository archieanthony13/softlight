class Fixture{
    constructor(channel, mode, fixtureProfile){
        this.channel = channel
        this.mode = mode
        this.fixtureProfile = fixtureProfile
        this.channelNames = this.fixtureProfile.modes[this.mode]
        this.channels = []
        for(let i=0;i<this.channelNames.length;i++){
            this.channels.push(this.fixtureProfile.channels[this.channelNames[i]].defaultValue)
        }
    }

    updateFixtureChannel(channel, value){
        this.channels[this.channelNames.indexOf(channel)] = value
    }
}