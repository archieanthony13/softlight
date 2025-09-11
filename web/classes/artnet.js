class Artnet{
    constructor(ip){
        this.ip = ip
        this.socket = new WebSocket("ws://localhost:8765");
        var that = this
        this.socket.onopen = () => { 
            console.log("Connected to server"); 
        }; 
        
        this.socket.onmessage = (event) => { 
            console.log("Message from server:", event.data); 
        }; 
        
        this.socket.onerror = (error) => { 
            console.error("WebSocket error:", error); 
        }; 
        
        this.socket.onclose = () => { 
            console.log("Connection closed"); 
        };
    }

    changeIp(ip){
        this.ip = ip
    }

    sendData(universe, dmx){
        this.socket.send(JSON.stringify([this.ip,universe,JSON.stringify(dmx.data)]));
    }
}