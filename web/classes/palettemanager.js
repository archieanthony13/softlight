class PaletteManager{
    constructor(){
        this.palettes = {"dimmer":{},"color":{},"position":{},"beam":{},"shape":{}}
    }

    createPalette(attribute,name){
        this.palettes[attribute][name] = new Palette()
        ui.updatePalettesList()
    }
}