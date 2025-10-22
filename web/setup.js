var dmx = new DMX()
var artnet = new Artnet("10.175.60.40")
dmx.data = new Array(512).fill(0)

var ui = new UI()
var patchMenu = new Patch()

var fixtureManager = new FixtureManager()
fixtureManager.loadFixtureLibrary()
fixtureManager.patchFixture(148,"56 Channel","Chauvet Professional","Rogue R2X Wash","RR2XW 1")
fixtureManager.patchFixture(232,"56 Channel","Chauvet Professional","Rogue R2X Wash","RR2XW 2")