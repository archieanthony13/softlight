class DMX{
    constructor(){
        this.data = new Array(512).fill(0)
    }

    updateChannel(channel, data){
        for(let i=0;i<data.length;i++){
            this.data[channel - 1 + i] = data[i]
        }
    }
}