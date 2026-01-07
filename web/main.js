function update(timestamp){
    sequenceManager.update(timestamp)
    dmx.update()
    artnet.sendData(dmx)
    requestAnimationFrame(update)
}

requestAnimationFrame(update)