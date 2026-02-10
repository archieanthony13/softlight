class PaletteManager{
    constructor(){
        this.menuActive = false
        this.paletteMenuElement = document.querySelector('.menu#palette-menu')
        this.paletteMenuElementBottom = this.paletteMenuElement.querySelector(".menu-bottom-section")

        this.paletteStoreMenuElement = document.querySelector('.menu#palette-store-menu')
        this.paletteStoreMenuElementBottom = this.paletteStoreMenuElement.querySelector(".menu-bottom-section")

        this.palettes = {"dimmer":{},"color":{},"position":{},"beam":{},"shape":{}}

        let that = this
        this.paletteMenuElement.querySelector("button#exit-palette").onclick = function(){
            that.togglePaletteMenu()
        }
        this.paletteMenuElement.querySelector("button#palette-create-palette").onclick = function(){
            let name = that.paletteMenuElementBottom.querySelector("input").value
            that.createPalette(null,name)
            that.togglePaletteMenu()
        }
        this.paletteStoreMenuElement.querySelector("button#exit-palette-store").onclick = function(){
            that.togglePaletteStoreMenu()
        }
        this.paletteStoreMenuElement.querySelector("button#palette-store-palette").onclick = function(){
            let name = that.paletteStoreMenuElementBottom.querySelector("input").value
            let mode = that.paletteStoreMenuElementBottom.querySelector("select").value
            that.store(name, mode)
            that.togglePaletteStoreMenu()
        }
    }

    createPalette(attribute,name){
        if(attribute){
            this.palettes[attribute][name] = new Palette(attribute)
        } else {
            this.palettes[ui.attribute][name] = new Palette(ui.attribute)
        }
        ui.updatePalettesList()
    }

    deletePalette(attribute,name){
        if(attribute){
            delete this.palettes[attribute][name]
        } else {
            delete this.palettes[ui.attribute][name]
        }
    }

    togglePaletteMenu(){
        this.menuActive = !this.menuActive
        if(this.menuActive){
            this.paletteMenuElement.style.display = "grid"
            let inputs = this.paletteMenuElement.querySelectorAll("input")
            for(let i=0;i<inputs.length;i++){
                inputs[i].value = ""
            }
            document.querySelector(".container").style.opacity = "0.25"
        } else {
            this.paletteMenuElement.style.display = "none"
            document.querySelector(".container").style.opacity = "1"
        }
    }

    togglePaletteStoreMenu(){
        this.menuActive = !this.menuActive
        if(this.menuActive){
            this.paletteStoreMenuElement.style.display = "grid"
            let inputs = this.paletteStoreMenuElement.querySelectorAll("input")
            for(let i=0;i<inputs.length;i++){
                inputs[i].value = ""
            }
            document.querySelector(".container").style.opacity = "0.25"
        } else {
            this.paletteStoreMenuElement.style.display = "none"
            document.querySelector(".container").style.opacity = "1"
        }
    }

    store(name, mode){
        let index = Object.keys(this.palettes[ui.attribute]).indexOf(name)
        if(index != -1){
            this.palettes[ui.attribute][name].store(mode)
        } else {
            this.createPalette(null,name)
            this.palettes[ui.attribute][name].store(mode)
        }
    }
}