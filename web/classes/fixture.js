class Fixture{
    constructor(channel, mode, fixtureProfile, name){
        this.name = name
        this.channel = channel
        this.mode = mode
        this.fixtureProfile = fixtureProfile
        this.channelNames = this.fixtureProfile.modes[this.mode]
        this.manualChannels = new Array(this.channelNames.length).fill(false)
        this.channels = []
        for(let i=0;i<this.channelNames.length;i++){
            this.channels.push(this.fixtureProfile.channels[this.channelNames[i]].defaultValue)
        }
    }

    updateFixtureChannel(channel, value){
        if(this.channelNames.indexOf(channel) == -1){
            console.error("Unable to update channel. This does not exist for this fixture.")
        } else {
            this.channels[this.channelNames.indexOf(channel)] = value
        }
    }

    updateFixtureManualChannel(channel, value){
        if(this.channelNames.indexOf(channel) == -1){
            console.error("Unable to update channel. This does not exist for this fixture.")
        } else {
            this.manualChannels[this.channelNames.indexOf(channel)] = value
        }
    }

    clearManualChannels(){
        this.manualChannels.fill(false)
    }
}