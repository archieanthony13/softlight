class Artnet{
    constructor(ip, websocket){
        if(ip){
            this.ip = ip
        }
        if(websocket){
            this.changeWebsocket(websocket)
        }
    }

    changeIp(ip){
        this.ip = ip
    }

    changeWebsocket(address){
        this.websocket = address
        this.socket = new WebSocket(this.websocket);
        this.open = false
        let that = this
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

    sendData(dmx){
        if(this.open){
            this.socket.send(JSON.stringify([this.ip,1,JSON.stringify(dmx.data)]));
        }
    }
}