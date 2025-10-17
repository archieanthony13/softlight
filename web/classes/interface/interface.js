class Interface{
    constructor(){

    }

    update(){
        this.updateControlSection()
    }

    updateControlSection(){
        renderManager.renderColor("#FFFFFF",0,400,1000,50)
        renderManager.renderColor("#bbbbbb",0,450,1000,100)
        renderManager.renderColor("#000000",249,450,2,100)
        renderManager.renderColor("#000000",499,450,2,100)
        renderManager.renderColor("#000000",749,450,2,100)
        renderManager.renderText("Dimmer","#000000",10,435,30)
    }
}