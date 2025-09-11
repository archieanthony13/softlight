function update(){
    artnet.sendData(dmx)
    requestAnimationFrame(update)
}

requestAnimationFrame(update)