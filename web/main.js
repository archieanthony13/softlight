// Create an update function which runs at 60 FPS to handle the software
function update(){
    timestamp++
    sequenceManager.update(timestamp)
    dmx.update()
    artnet.sendData(dmx)
    requestAnimationFrame(update)
}

// Create a timestamp variable which goes up each frame to allow for cue timings
var timestamp = 0

// Begin the update loop
requestAnimationFrame(update)