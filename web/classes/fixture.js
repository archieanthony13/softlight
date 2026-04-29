class Fixture{
    constructor(universe, channel, mode, fixtureProfile, name){
        // Initialise variables that are necessary for fixtures
        // Universe, channel, mode, fixture profile and fixture name and given by the constructor when created
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
        // Set the default channels array and the channel types array to hold the values listed in the fixture profile
        for(let i=0;i<this.channelNames.length;i++){
            this.defaultChannels.push(this.fixtureProfile.channels[this.channelNames[i]].defaultValue)
            this.channelTypes.push(this.fixtureProfile.channels[this.channelNames[i]].type)
        }
    }

    // Function to update fixture sequence channels
    updateFixtureChannel(channel, value, sequence){
        // Check if channel exists for this fixture
        let index = this.channelNames.indexOf(channel)
        if(index == -1){
            console.error("Unable to update channel. This does not exist for this fixture.")
        } else {
            // If the sequence doesn't exist in the fixture then create an empty array
            if(this.sequenceChannels[sequence] === undefined){
                this.sequenceChannels[sequence] = new Array(this.channelNames.length).fill(false)
            }
            // Make this sequence the priority by adding it to the end of the array
            this.sequencePriority.splice(this.sequencePriority.indexOf(sequence),1)
            this.sequencePriority.push(sequence)
            // Set the channel and update the sequence output
            this.sequenceChannels[sequence][index] = Math.round(value)
            this.updateSequenceOutput()
        }
    }

    // Function to update fixture sequence channels based on a channel index
    updateFixtureChannelByIndex(index, value, sequence){
        // If the sequence doesn't exist in the fixture then create an empty array
        if(this.sequenceChannels[sequence] === undefined){
            this.sequenceChannels[sequence] = new Array(this.channelNames.length).fill(false)
        }
        // Make this sequence the priority by adding it to the end of the array
        this.sequencePriority.splice(this.sequencePriority.indexOf(sequence),1)
        this.sequencePriority.push(sequence)
        // Set the channel and update the sequence output
        this.sequenceChannels[sequence][index] = Math.round(value)
        this.updateSequenceOutput()
    }

    // Function to merge all sequence channels into one array
    updateSequenceOutput(){
        // Set channel output to false
        this.channels.fill(false)
        // Loop through the sequence priority where the highest priority is last in the array
        for(let i=0;i<this.sequencePriority.length;i++){
            // Get sequence channels
            let channels = this.sequenceChannels[this.sequencePriority[i]]
            // Merge these sequence channels into one array
            for(let j=0;j<channels.length;j++){
                if(channels[j] !== false){
                    this.channels[j] = channels[j]
                }
            }
        }
    }

    // Function to update fixture manual channels
    updateFixtureManualChannel(channel, value){
        // Check if channel exists for this fixture
        if(this.channelNames.indexOf(channel) == -1){
            console.error("Unable to update channel. This does not exist for this fixture.")
        } else {
            // Set the manual channel of the specific channel to the given value
            this.manualChannels[this.channelNames.indexOf(channel)] = Math.round(value)
        }
    }

    // FUnction to reset manual channels
    clearManualChannels(){
        this.manualChannels.fill(false)
    }

    // Function to reset sequence channels
    clearSequenceChannels(sequence){
        let index = Object.keys(this.sequenceChannels).indexOf(sequence)
        if(index != -1){
            this.sequenceChannels[sequence].fill(false)
            this.updateSequenceOutput()
        }
    }
}