var canvas = document.querySelector('canvas')
var ctx = canvas.getContext('2d')

let scale = 2
canvas.style.width = "1000px"
canvas.style.height = "500px"
canvas.width = 1000*scale
canvas.height = 500*scale
ctx.scale(scale,scale)

ctx.imageSmoothingEnabled = false

var windowScale = 1
window.addEventListener('resize',function(e){
    let width = this.window.innerWidth
    let height = this.window.innerHeight
    if(width >= height*2){
        canvas.style.height = height + "px"
        canvas.style.width = height*2 + "px"
        windowScale = height/500
    } else {
        canvas.style.height = width/2 + "px"
        canvas.style.width = width + "px"
        windowScale = width/1000
    }
})

window.dispatchEvent(new Event('resize'));

var dmx = new DMX()
var artnet = new Artnet("10.175.60.40")
dmx.data = new Array(512).fill(0)

var fixtureManager = new FixtureManager()
fixtureManager.loadFixtureLibrary()
fixtureManager.patchFixture(148,"56 Channel","Chauvet Professional","Rogue R2X Wash","RR2XW 1")
fixtureManager.patchFixture(232,"56 Channel","Chauvet Professional","Rogue R2X Wash","RR2XW 2")

var inputManager = new InputManager()
var renderManager = new RenderManager()
// renderManager.loadFont("./assets/textures/font")
var interface = new Interface()