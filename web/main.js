function update(){
    sequenceManager.update()
    dmx.update()
    artnet.sendData(dmx)
    requestAnimationFrame(update)
}

requestAnimationFrame(update)