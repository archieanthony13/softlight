class Artnet{
    constructor(ip){
        this.ip = ip
        this.socket = new WebSocket("ws://localhost:8765");
        this.open = false
        var that = this
        this.socket.onopen = function(e){
            console.log("Connected to server")
            that.open = true
        }

        this.socket.onmessage = function(e){
            console.log("Message from server:", e.data)
        }

        this.socket.onerror = function(e){
            console.error("WebSocket error:", e)
        }

        this.socket.onclose = function(e){
            console.log("Connection closed")
            that.open = false
        }
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