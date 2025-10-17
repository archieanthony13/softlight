function update(){
    dmx.update()
    artnet.sendData(dmx)
    interface.update()
    requestAnimationFrame(update)
}

requestAnimationFrame(update)