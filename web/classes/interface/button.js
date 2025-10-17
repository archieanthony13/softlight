class Button{
    constructor(display,x,y,w,h,color,onclick){
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.onclick = onclick
        this.display = display
        this.color = color
    }

    update(){
        if(this.display){
            renderManager.renderColor(this.color,this.x,this.y,this.w,this.h)
            let mouse = inputManager.getMouse()
            if(mouse.pos[0] >= this.x && mouse.pos[0] <= this.x + this.w && mouse.pos[1] >= this.y && mouse.pos[1] <= this.y + this.h && mouse.click){
                this.onclick()
            }
        }
    }
}