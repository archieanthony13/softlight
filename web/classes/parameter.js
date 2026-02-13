class Parameter {
    constructor(){
        this.parameterElement = document.querySelector('.menu#parameter-menu')
        this.parameterElementBottom = this.parameterElement.querySelector(".menu-bottom-bottom-section.raw-value")
        this.active = false

        this.parameter = ""
        this.value = 0
        this.bits = 1
        this.pixel = 1

        let that = this
        this.parameterElement.querySelector("button#exit-parameter").onclick = function(){
            that.toggleParameterMenu()
        }
        this.parameterElement.querySelector("button#raw-value").onclick = function(){
            that.rawValueMenu()
        }
        this.parameterElement.querySelector("button#list-values").onclick = function(){
            that.listValueMenu()
        }
        this.parameterElement.querySelector("button#pixel-values").onclick = function(){
            that.pixelValueMenu()
        }
        this.parameterElement.querySelector("button#raw-value-min").onclick = function(){
            let input = that.parameterElement.querySelector("input#parameter-raw-value")
            input.value = input.min
            input.onkeyup()
        }
        this.parameterElement.querySelector("button#raw-value-max").onclick = function(){
            let input = that.parameterElement.querySelector("input#parameter-raw-value")
            input.value = input.max
            input.onkeyup()
        }
        this.parameterElement.querySelector("button#raw-value-half").onclick = function(){
            let input = that.parameterElement.querySelector("input#parameter-raw-value")
            input.value = Math.ceil((input.max - input.min)/2)
            input.onkeyup()
        }
        this.parameterElement.querySelector("input#parameter-raw-value").onkeyup = function(){
            let value = parseInt(this.value)
            let min = parseInt(this.min)
            let max = parseInt(this.max)
            if(value < min) {
                value = min
            } else if(value > max){
                value = max
            }
            that.value = value
            this.value = value
            fixtureManager.updateSelectedFixtureManualChannel(that.parameter, that.value, that.bits)
            ui.updateAttributes()
        }
        this.parameterElement.querySelector("input#parameter-raw-value").onchange = function(){
            this.onkeyup()
        }
    }

    toggleParameterMenu(){
        this.active = !this.active
        if(this.active){
            this.parameterElement.style.display = "grid"
            document.querySelector(".container").style.opacity = "0.25"
            this.rawValueMenu()
        } else {
            this.parameterElement.style.display = "none"
            document.querySelector(".container").style.opacity = "1"
        }
    }

    rawValueMenu(){
        this.parameterElementBottom = this.parameterElement.querySelector(".menu-bottom-section.raw-value")
        this.parameterElement.querySelector('.menu-bottom-section.raw-value').style.display = "grid"
        this.parameterElement.querySelector('.menu-bottom-section.list-values').style.display = "none"
        this.parameterElement.querySelector('.menu-bottom-section.pixel-values').style.display = "none"
        this.parameterElement.querySelector("button#raw-value").classList.add("selected")
        this.parameterElement.querySelector("button#list-values").classList.remove("selected")
        this.parameterElement.querySelector("button#pixel-values").classList.remove("selected")
        
        let input = this.parameterElementBottom.querySelector("input#parameter-raw-value")
        if(this.bits == 1){
            input.max = 255
            this.parameterElementBottom.querySelector("p#parameter-range").innerHTML = "Min: 0, Max: 255"
        } else {
            input.max = 65535
            this.parameterElementBottom.querySelector("p#parameter-range").innerHTML = "Min: 0, Max: 65535"
        }
        input.value = this.value
        this.parameterElement.querySelector("input#parameter-raw-value").select()
    }

    listValueMenu(){
        this.parameterElementBottom = this.parameterElement.querySelector(".menu-bottom-section.list-values")
        this.parameterElement.querySelector('.menu-bottom-section.raw-value').style.display = "none"
        this.parameterElement.querySelector('.menu-bottom-section.list-values').style.display = "grid"
        this.parameterElement.querySelector('.menu-bottom-section.pixel-values').style.display = "none"
        this.parameterElement.querySelector("button#raw-value").classList.remove("selected")
        this.parameterElement.querySelector("button#list-values").classList.add("selected")
        this.parameterElement.querySelector("button#pixel-values").classList.remove("selected")

        let listValues = []
        for(let i=0;i<fixtureManager.selectedFixtures.length;i++){
            let fixture = fixtureManager.fixtures[fixtureManager.selectedFixtures[i]]
            let fixtureList = fixture.fixtureProfile.channels[this.parameter].listValues
            if(fixtureList){
                listValues = listValues.concat(fixtureList)
            }
        }
        let selectElement = this.parameterElementBottom.querySelector("select")
        selectElement.innerHTML = ""
        for(let i=0;i<listValues.length;i++){
            let option = document.createElement("option")
            // option.value = Math.round(listValues[])
            let min = listValues[i].startValue
            let max = listValues[i].endValue
            let middle = Math.round(min + (max - min)/2)
            option.value = middle
            option.innerHTML = listValues[i].description
            selectElement.append(option)
            if(this.value >= min && this.value <= max){
                selectElement.value = middle
            }
        }
        let that = this
        selectElement.onchange = function(){
            let value = parseInt(this.value)
            that.value = value
            console.log(that.parameter,this.value,that.bits)
            fixtureManager.updateSelectedFixtureManualChannel(that.parameter,this.value,that.bits)
            ui.updateAttributes()
        }
    }
    pixelValueMenu(){
        this.parameterElementBottom = this.parameterElement.querySelector(".menu-bottom-bottom-section.raw-value")
        this.parameterElement.querySelector('.menu-bottom-section.raw-value').style.display = "none"
        this.parameterElement.querySelector('.menu-bottom-section.list-values').style.display = "none"
        this.parameterElement.querySelector('.menu-bottom-section.pixel-values').style.display = "grid"
        this.parameterElement.querySelector("button#raw-value").classList.remove("selected")
        this.parameterElement.querySelector("button#list-values").classList.remove("selected")
        this.parameterElement.querySelector("button#pixel-values").classList.add("selected")
    }
}