class Patch{
    constructor(){
        this.patchElement = document.querySelector('.patch-menu')
        this.active = false
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
        this.patchElement.querySelector(".patch-menu-bottom-section").innerHTML = ""
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
            this.patchElement.querySelector(".patch-menu-bottom-section").append(input)
            this.patchElement.querySelector(".patch-menu-bottom-section").append(label)
        }
        this.patchElement.querySelector(".patch-menu-bottom-section").style.gridTemplateRows = "repeat(" + fixtureManager.fixtures.length + ", calc(var(--scale)*4))"
    }
}