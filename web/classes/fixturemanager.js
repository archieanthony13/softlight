class FixtureManager{
    constructor(){
        this.fixtureLibrary = []
    }

    loadFixtureLibrary(){
        if(localStorage.getItem("softlight-fixture-library")){
            this.fixtureLibrary = JSON.parse(localStorage.getItem("softlight-fixture-library"))
        } else {
            this.fixtureLibrary = []
        }
    }

    loadFixtureFromFile(){
        let object = document.createElement('input')
        object.type = "file"
        object.click()
        let that = this
        object.onchange = function(){
            let filereader = new FileReader()
            filereader.onload = async function(){
                that.fixtureLibrary.push(JSON.parse(filereader.result))
                localStorage.setItem("softlight-fixture-library", JSON.stringify(that.fixtureLibrary))
            }
            filereader.readAsText(object.files[0])
        }
    }
}