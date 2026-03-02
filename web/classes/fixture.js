class Fixture{
    constructor(universe, channel, mode, fixtureProfile, name){
        this.name = name
        this.universe = universe
        this.channel = channel
        this.mode = mode
        this.fixtureProfile = fixtureProfile
        this.channelNames = this.fixtureProfile.modes[this.mode]
        this.channelTypes = []
        this.manualChannels = new Array(this.channelNames.length).fill(false)
        this.channels = new Array(this.channelNames.length).fill(false)
        this.sequenceChannels = {}
        this.sequencePriority = []
        this.defaultChannels = []
        for(let i=0;i<this.channelNames.length;i++){
            this.defaultChannels.push(this.fixtureProfile.channels[this.channelNames[i]].defaultValue)
            this.channelTypes.push(this.fixtureProfile.channels[this.channelNames[i]].type)
        }
    }

    updateFixtureChannel(channel, value, sequence){
        let index = this.channelNames.indexOf(channel)
        if(index == -1){
            console.error("Unable to update channel. This does not exist for this fixture.")
        } else {
            if(this.sequenceChannels[sequence] === undefined){
                this.sequenceChannels[sequence] = new Array(this.channelNames.length).fill(false)
            }
            this.sequencePriority.splice(this.sequencePriority.indexOf(sequence),1)
            this.sequencePriority.push(sequence)
            this.sequenceChannels[sequence][index] = Math.round(value)
            this.updateSequenceOutput()
        }
    }

    updateFixtureChannelByIndex(index, value, sequence){
        if(this.sequenceChannels[sequence] === undefined){
            this.sequenceChannels[sequence] = new Array(this.channelNames.length).fill(false)
        }
        this.sequencePriority.splice(this.sequencePriority.indexOf(sequence),1)
        this.sequencePriority.push(sequence)
        this.sequenceChannels[sequence][index] = Math.round(value)
        this.updateSequenceOutput()
    }

    updateSequenceOutput(){
        this.channels.fill(false)
        for(let i=0;i<this.sequencePriority.length;i++){
            let channels = this.sequenceChannels[this.sequencePriority[i]]
            for(let j=0;j<channels.length;j++){
                if(channels[j] !== false){
                    this.channels[j] = channels[j]
                }
            }
        }
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

    clearSequenceChannels(sequence){
        let index = Object.keys(this.sequenceChannels).indexOf(sequence)
        if(index != -1){
            this.sequenceChannels[sequence].fill(false)
            this.updateSequenceOutput()
        }
    }
}