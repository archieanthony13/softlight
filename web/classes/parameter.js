class Parameter {
    constructor(){
        this.parameterElement = document.querySelector('.menu#parameter-menu')
        this.parameterElementBottom = this.parameterElement.querySelector(".menu-bottom-bottom-section.raw-value")
        this.active = false

        this.parameter = ""
        this.value = 0
        this.bits = 1

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
            fixtureManager.updateSelectedFixtureChannel(that.parameter, that.value)
            ui.updateAttributes()
        }
    }

    toggleParameterMenu(){
        this.active = !this.active
        if(this.active){
            this.parameterElement.style.display = "grid"
            this.rawValueMenu()
        } else {
            this.parameterElement.style.display = "none"
        }
    }

    rawValueMenu(){
        this.parameterElementBottom = this.parameterElement.querySelector(".menu-bottom-section.raw-value")
        this.parameterElement.querySelector('.menu-bottom-section.raw-value').style.display = "grid"
        this.parameterElement.querySelector('.menu-bottom-section.list-values').style.display = "none"
        this.parameterElement.querySelector("button#raw-value").classList.add("selected")
        this.parameterElement.querySelector("button#list-values").classList.remove("selected")
        
        let input = this.parameterElementBottom.querySelector("input#parameter-raw-value")
        if(this.bits == 1){
            input.max = 255
        } else {
            input.max = 65535
        }
        input.value = this.value
        this.parameterElement.querySelector("input#parameter-raw-value").select()
    }

    listValueMenu(){
        this.parameterElementBottom = this.parameterElement.querySelector(".menu-bottom-bottom-section.raw-value")
        this.parameterElement.querySelector('.menu-bottom-section.raw-value').style.display = "none"
        this.parameterElement.querySelector('.menu-bottom-section.list-values').style.display = "grid"
        this.parameterElement.querySelector("button#raw-value").classList.remove("selected")
        this.parameterElement.querySelector("button#list-values").classList.add("selected")
    }
}

// NOTE
// Given a 16-bit binary number this is how to split into two 8-bit numbers
// 0b1111000000001111 >> 8                      Most significant bit (binary shift)
// 0b1111000000001111 & 0b0000000011111111      Least significant bit (mask)
// Could convert the mask to HEX to make it shorter

// Shorter:
// 16-bit number >> 8
// 16-bit number & 255