function update(){
    timestamp++
    sequenceManager.update(timestamp)
    dmx.update()
    artnet.sendData(dmx)
    requestAnimationFrame(update)
}

var timestamp = 0

requestAnimationFrame(update)