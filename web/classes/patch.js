class Patch{
    constructor(){
        this.patchElement = document.querySelector('.patch-menu')
        this.patchElementBottom = this.patchElement.querySelector(".patch-menu-bottom-bottom-section")
        this.active = false

        this.manufacturerElement = document.createElement('select')
        this.manufacturerElement.id = "manufacturer"
        this.nameElement = document.createElement('select')
        this.nameElement.id = "name"
        this.channelElement = document.createElement('select')
        this.channelElement.id = "channel"

        let that = this
        this.patchElement.querySelector("button#fixture-list").onclick = function(){
            that.updateFixtureList()
        }
        this.patchElement.querySelector("button#patch-fixture").onclick = function(){
            that.patchFixtureMenu()
        }
        this.patchElement.querySelector('button#upload-fixture-profile').onclick = function(){
            fixtureManager.loadFixtureProfileFromFile()
        }
        this.patchElement.querySelector('button#load-fixture-library').onclick = function(){
            fixtureManager.loadFixtureLibraryFromCloud()
        }

        this.manufacturerElement.onchange = function(){
            that.updateFixtureNameSelect()
            that.updateChannelSelect()
        }
        this.nameElement.onchange = function(){
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
        this.patchElement.querySelector('button#upload-fixture-profile').style.display = "none"
        this.patchElement.querySelector('button#load-fixture-library').style.display = "none"
        this.patchElement.querySelector('button#delete-fixture').style.display = "block"
        this.patchElement.querySelector('button#edit-fixture').style.display = "block"
        this.patchElementBottom.style.gridTemplateRows = "repeat(" + fixtureManager.fixtures.length + ", calc(var(--scale)*4))"
    }

    patchFixtureMenu(){
        this.patchElementBottom.innerHTML = ""
        this.patchElementBottom.append(this.manufacturerElement)
        this.patchElementBottom.append(this.nameElement)
        this.patchElementBottom.append(this.channelElement)
        this.updateManufacturerSelect()
        this.updateFixtureNameSelect()
        this.updateChannelSelect()
        this.patchElement.querySelector('button#upload-fixture-profile').style.display = "block"
        this.patchElement.querySelector('button#load-fixture-library').style.display = "block"
        this.patchElement.querySelector('button#delete-fixture').style.display = "none"
        this.patchElement.querySelector('button#edit-fixture').style.display = "none"
        this.patchElementBottom.style.gridTemplateRows = "repeat(3, calc(var(--scale)*4))"
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