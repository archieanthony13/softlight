class Artnet{
    constructor(ip){
        this.ip = ip
        this.socket = new WebSocket("ws://localhost:8765");
        this.open = false
        var that = this
        this.socket.onopen = () => { 
            console.log("Connected to server");
            that.open = true
        }; 
        
        this.socket.onmessage = (event) => { 
            console.log("Message from server:", event.data); 
        }; 
        
        this.socket.onerror = (error) => { 
            console.error("WebSocket error:", error); 
        }; 
        
        this.socket.onclose = () => { 
            console.log("Connection closed"); 
            that.open = false
        };
    }

    changeIp(ip){
        this.ip = ip
    }

    sendData(dmx){
        if(this.open){
            this.socket.send(JSON.stringify([this.ip,1,JSON.stringify(dmx.data)]));
        }
    }
}