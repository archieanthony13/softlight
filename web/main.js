function update(){
    dmx.update()
    artnet.sendData(dmx)
    requestAnimationFrame(update)
}

requestAnimationFrame(update)