class Artnet{
    constructor(ip, websocket){
        // Set IP and WebSocket addresses based on constructor input
        if(ip){
            this.ip = ip
        }
        if(websocket){
            this.changeWebsocket(websocket)
        }
    }

    // Function to update the IP Address of the Art-Net node
    changeIp(ip){
        this.ip = ip
    }

    // Function to update the WebSocket Address of the Python server
    changeWebsocket(address){
        this.websocket = address
        this.socket = new WebSocket(this.websocket);
        this.open = false
        let that = this

        // Functions to console log messages based on WebSocket events and set variables accordingly
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

    // Send DMX data to Python using the WebSocket connection
    sendData(dmx){
        if(this.open){
            this.socket.send(JSON.stringify([this.ip,1,JSON.stringify(dmx.data)]));
        }
    }
}