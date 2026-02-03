var dmx = new DMX()
var artnet = new Artnet("10.175.60.40", "ws://localhost:8765")
dmx.data = new Array(512).fill(0)

var ui = new UI()
var patchMenu = new Patch()
var settingsMenu = new Settings()
var parameterMenu = new Parameter()

var fixtureManager = new FixtureManager()
fixtureManager.loadFixtureLibrary()

var sequenceManager = new SequenceManager()

var paletteManager = new PaletteManager()

var save = new Save()

save.loadFromBrowser()

function lerp(a,b,t){
    return (b-a)*t
}