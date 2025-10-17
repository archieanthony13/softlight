function update(){
    artnet.sendData(dmx)
    renderManager.update()
    requestAnimationFrame(update)
}

requestAnimationFrame(update)