class Interface{
    constructor(){
        let that = this
        this.controlButtons = [
            new Button(true,5,400,190,50,"#BBBBBB",function(){that.selectedMode = "dimmer"}),
            new Button(true,205,400,190,50,"#BBBBBB",function(){that.selectedMode = "color"}),
            new Button(true,405,400,190,50,"#BBBBBB",function(){that.selectedMode = "position"}),
            new Button(true,605,400,190,50,"#BBBBBB",function(){that.selectedMode = "shape"}),
            new Button(true,805,400,190,50,"#BBBBBB",function(){that.selectedMode = "beam"})
        ]
        this.selectedMode = "dimmer"
        this.fixtureButtons = [
            
        ]
    }

    update(){
        this.updateControlSection()
        this.updateSelectFixtureSection()
    }

    updateControlSection(){
        renderManager.renderColor("#FFFFFF",0,400,1000,50)
        for(let i=0;i<this.controlButtons.length;i++){
            this.controlButtons[i].update()
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

    createFixtureButtons(){
        for(let i=0;i<fixtureManager.fixtures.length;i++){
            let button = new Button(true,20,20+50*i,250,40,"#BBBBBB",function(){
                if(fixtureManager.selectedFixtures.indexOf(i) == -1){
                    fixtureManager.selectedFixtures.push(i)
                } else {
                    fixtureManager.selectedFixtures.splice(fixtureManager.selectedFixtures.indexOf(i),1)
                }
            })
            button.setHoldable(false)
            this.fixtureButtons.push(button)
        }
    }

    updateSelectFixtureSection(){
        renderManager.renderColor("#FFFFFF",10,10,480,380)
        for(let i=0;i<this.fixtureButtons.length;i++){
            this.fixtureButtons[i].update()
        }
        for(let i=0;i<fixtureManager.fixtures.length;i++){
            renderManager.renderText(fixtureManager.fixtures[i].name,"#000000",20,50+50*i,30)
        }
    }
}