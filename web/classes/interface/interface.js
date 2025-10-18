class Interface{
    constructor(){
        let that = this
        this.objects = [
            new Button(true,5,400,190,50,"#BBBBBB",function(){that.selectedMode = "dimmer"}),
            new Button(true,205,400,190,50,"#BBBBBB",function(){that.selectedMode = "color"}),
            new Button(true,405,400,190,50,"#BBBBBB",function(){that.selectedMode = "position"}),
            new Button(true,605,400,190,50,"#BBBBBB",function(){that.selectedMode = "shape"}),
            new Button(true,805,400,190,50,"#BBBBBB",function(){that.selectedMode = "beam"})
        ]
        this.selectedMode = "dimmer"
    }

    update(){
        this.updateControlSection()
    }

    updateControlSection(){
        renderManager.renderColor("#FFFFFF",0,400,1000,50)
        for(let i=0;i<this.objects.length;i++){
            this.objects[i].update()
        }
        renderManager.renderText("Dimmer","#000000",10,435,30)
        renderManager.renderText("Color","#000000",210,435,30)
        renderManager.renderText("Position","#000000",410,435,30)
        renderManager.renderText("Shape","#000000",610,435,30)
        renderManager.renderText("Beam","#000000",810,435,30)
        let attributes = []
        if(fixtureManager.selectedFixtures.length > 0){
            for(let i=0;i<fixtureManager.selectedFixtures.length;i++){
                let fixture = fixtureManager.fixtures[fixtureManager.selectedFixtures[i]]
                for(let j=0;j<fixture.channelNames.length;j++){
                    if(fixture.fixtureProfile.channels[fixture.channelNames[j]].type == this.selectedMode && attributes.indexOf(fixture.channelNames[j]) == -1)
                    attributes.push(fixture.channelNames[j])
                }
            }
        }
    }
}