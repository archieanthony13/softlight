class Fixture{
    constructor(channel, mode, fixtureProfile, name){
        this.name = name
        this.channel = channel
        this.mode = mode
        this.fixtureProfile = fixtureProfile
        this.channelNames = this.fixtureProfile.modes[this.mode]
        this.channelTypes = []
        this.manualChannels = new Array(this.channelNames.length).fill(false)
        this.channels = new Array(this.channelNames.length).fill(false)
        this.defaultChannels = []
        for(let i=0;i<this.channelNames.length;i++){
            this.defaultChannels.push(this.fixtureProfile.channels[this.channelNames[i]].defaultValue)
            this.channelTypes.push(this.fixtureProfile.channels[this.channelNames[i]].type)
        }
    }

    updateFixtureChannel(channel, value){
        if(this.channelNames.indexOf(channel) == -1){
            console.error("Unable to update channel. This does not exist for this fixture.")
        } else {
            this.channels[this.channelNames.indexOf(channel)] = Math.round(value)
        }
    }

    updateFixtureChannelByIndex(index, value){
        this.channels[index] = Math.round(value)
    }

    updateFixtureManualChannel(channel, value){
        if(this.channelNames.indexOf(channel) == -1){
            console.error("Unable to update channel. This does not exist for this fixture.")
        } else {
            this.manualChannels[this.channelNames.indexOf(channel)] = Math.round(value)
        }
    }

    clearManualChannels(){
        this.manualChannels.fill(false)
    }
}