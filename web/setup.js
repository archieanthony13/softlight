var dmx = new DMX()
var artnet = new Artnet()
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