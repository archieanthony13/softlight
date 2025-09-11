let faders = document.querySelector('.faders')

for(let i=0;i<6;i++){
    let fader = document.createElement('input')
    fader.type = 'range'
    fader.name = `fader${i}`
    fader.id = `fader${i}`
    fader.className = 'fader'
    fader.max = '255'
    fader.min = '0'
    fader.value = '0'
    faders.appendChild(fader)
}