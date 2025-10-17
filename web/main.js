function update(){
    ctx.clearRect(0,0,1000,500)
    dmx.update()
    artnet.sendData(dmx)
    interface.update()
    requestAnimationFrame(update)
}

requestAnimationFrame(update)