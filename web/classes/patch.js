class Patch{
    constructor(){
        this.patchElement = document.querySelector('.patch-menu')
        this.patchElementBottom = this.patchElement.querySelector(".patch-menu-bottom-section")
        this.active = false

        let that = this
        this.patchElement.querySelector("#patch-fixture").onclick = function(){
            that.patchFixtureMenu()
        }

        this.patchElementBottom.querySelector("#manufacturer").onchange = function(){
            that.updateFixtureNameSelect()
            that.updateChannelSelect()
        }
        this.patchElementBottom.querySelector("#name").onchange = function(){
            that.updateChannelSelect()
        }
    }

    togglePatchMenu(){
        this.active = !this.active
        if(this.active){
            this.patchElement.style.display = "grid"
            this.updateFixtureList()
        } else {
            this.patchElement.style.display = "none"
        }
    }

    updateFixtureList(){
        this.patchElementBottom.innerHTML = ""
        for(let i=0;i<fixtureManager.fixtures.length;i++){
            let label = document.createElement('label')
            label.innerHTML = fixtureManager.fixtures[i].name
            let forAttribute = document.createAttribute('for')
            forAttribute.value = "patch-" + i
            label.attributes.setNamedItem(forAttribute)
            let input = document.createElement('input')
            input.type = "checkbox"
            input.name = "patch-" + i
            input.id = "patch-" + i
            input.hidden = true
            this.patchElementBottom.append(input)
            this.patchElementBottom.append(label)
        }
        this.patchElementBottom.style.gridTemplateRows = "repeat(" + fixtureManager.fixtures.length + ", calc(var(--scale)*4))"
    }

    patchFixtureMenu(){
        this.patchElementBottom.append(manufacturerElement)
        this.patchElementBottom.append(nameElement)
        this.patchElementBottom.append(channelElement)
        this.updateManufacturerSelect()
        this.updateFixtureNameSelect()
        this.updateChannelSelect()
    }

    updateManufacturerSelect(){
        let manufacturerElement = this.patchElementBottom.querySelector("#manufacturer")
        let manufacturersList = []
        manufacturerElement.innerHTML = ""
        for(let i=0;i<fixtureManager.fixtureLibrary.length;i++){
            let fixture = fixtureManager.fixtureLibrary[i]
            let manufacturer = fixture.manufacturer
            if(manufacturersList.indexOf(manufacturer) == -1){
                let option = document.createElement('option')
                option.value = manufacturer
                option.innerHTML = manufacturer
                manufacturerElement.append(option)
                manufacturersList.push(manufacturer)
            }
        }
    }

    updateFixtureNameSelect(){
        let manufacturer = this.patchElementBottom.querySelector("#manufacturer").value
        let nameElement = this.patchElementBottom.querySelector("#name")
        nameElement.innerHTML = ""
        for(let i=0;i<fixtureManager.fixtureLibrary.length;i++){
            let fixture = fixtureManager.fixtureLibrary[i]
            if(fixture.manufacturer == manufacturer){
                let name = fixture.name
                let nameOption = document.createElement('option')
                nameOption.value = name
                nameOption.innerHTML = name
                nameElement.append(nameOption)
            }
        }
    }

    updateChannelSelect(){
        let manufacturer = this.patchElementBottom.querySelector("#manufacturer").value
        let name = this.patchElementBottom.querySelector("#name").value
        let channelElement = this.patchElementBottom.querySelector("#channel")
        channelElement.innerHTML = ""
        for(let i=0;i<fixtureManager.fixtureLibrary.length;i++){
            let fixture = fixtureManager.fixtureLibrary[i]
            if(fixture.manufacturer == manufacturer && fixture.name == name){
                let channelModes = Object.keys(fixture.modes)
                for(let i=0;i<channelModes.length;i++){
                    let channel = channelModes[i]
                    let channelOption = document.createElement('option')
                    channelOption.value = channel
                    channelOption.innerHTML = channel
                    channelElement.append(channelOption)
                }
            }
        }
    }
}