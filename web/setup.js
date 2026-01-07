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

async function patchFixtures(){
    await fixtureManager.patchFixture(148,"56 Channel","Chauvet Professional","Rogue R2X Wash","RR2XW 1")
    await fixtureManager.patchFixture(232,"56 Channel","Chauvet Professional","Rogue R2X Wash","RR2XW 2")

    sequenceManager.createSequence("1")
    sequenceManager.createEmptyCue("1",0,"Cue 0")
    sequenceManager.store(0,"1")
}

patchFixtures()

function lerp(a,b,t){
    return (b-a)*t
}