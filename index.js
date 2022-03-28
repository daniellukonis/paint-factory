// author : daniellukonis

let poolDirection = 'clockwise'

let stickDirection = 'clockwise'

function randomInt(min,max){
    return Math.floor(fxrand()*max)+min
}

function resizeCanvas(){
    const canvas = document.querySelector('canvas')
    let x = window.innerWidth
    let y = window.innerHeight
    x > y ? x = y : y = x;
    canvas.width = x
    canvas.height = y
} 

function fillCanvas(color1 = 'black',color2 = 'white',width){
    canvas = document.querySelector('canvas')
    context = this.canvas.getContext('2d')
    context.save()
    context.lineWidth = width
    context.fillStyle = color1
    context.strokeStyle = color2
    context.fillRect(0,0,canvas.width,canvas.height)
    context.strokeRect(0,0,canvas.width,canvas.height)
    context.restore()
}

function strokeCanvas(color1 = 'black',color2 = 'white',width){
    canvas = document.querySelector('canvas')
    context = this.canvas.getContext('2d')
    context.save()
    context.lineWidth = width
    context.fillStyle = color1
    context.strokeStyle = color2
    // context.fillRect(0,0,canvas.width,canvas.height)
    context.strokeRect(0,0,canvas.width,canvas.height)
    context.restore()
}

class Drips{
    constructor(x,y,radius,color = 'white'){
        this.canvas = document.querySelector('canvas')
        this.context = this.canvas.getContext('2d')

        this.x = x
        this.y = y
        this.yVelocity = 0.1
        this.radius = radius
        this.fillStyle = 'white'
        this.colorArray = color
        this.strokeColor = 'rgb(150,150,150)'
        this.dripPanel = radius
        this.dripRadius = radius / 35
        this.lineWidth = 1
        this.maxDrips = this.canvas.width / radius * 4
        this.dripsArray = []
        this.fillDripsArray()
    }

    randomInt(min,max){
        return Math.floor(fxrand()*max)+min
    }

    randomColor(){
                const colorIndex = this.randomInt(0,this.colorArray.length)
                return this.colorArray[colorIndex]
            }

    fillDripsArray(){
        for(let i = 0; i < this.maxDrips; i++){
            const sDrip = {}
            sDrip.x = this.dripPanel * fxrand()
            sDrip.y = (this.canvas.width - this.y) * fxrand()
            sDrip.color = this.fillStyle
            this.dripsArray.push(sDrip) 
        }

    }

    drawDrip(x,y,color,{context} = this){
        context.save()
        context.fillStyle = color
        context.strokeStyle = this.strokeColor
        context.lineWidth = this.lineWidth
        context.translate(x - this.dripPanel/2 ,y + this.radius/2)
        context.beginPath()
        context.arc(0,0,this.dripRadius,0,Math.PI*2)
        context.fill()
        context.stroke()
        context.restore()
    }

    moveDrips(){
        this.dripsArray.forEach(d=>{
            d.y += this.yVelocity
            d.y > this.canvas.width - this.y ? d.y = 0 : null;
        })
    }

    animateDrips(){
        this.dripsArray.forEach(d=>{
            this.context.save()
            this.context.translate(this.x,this.y)
            this.moveDrips()
            this.drawDrip(d.x,d.y,d.color)
            this.context.restore()
        })
    }
}

class ColoredDrips{
    constructor(x,y,radius,color='white'){
        this.canvas = document.querySelector('canvas')
        this.context = this.canvas.getContext('2d')

        this.x = x
        this.y = y
        this.yVelocity = 0.1
        this.radius = radius
        this.fillStyle = 'white'
        this.colorArray = color
        this.strokeColor = 'rgb(150,150,150)'
        this.dripPanel = radius
        this.dripRadius = radius / 35
        this.lineWidth = 1
        this.maxDrips = this.canvas.width / radius * 4
        this.dripsArray = []
        this.fillDripsArray()
    }

    randomInt(min,max){
        return Math.floor(fxrand()*max)+min
    }

    randomColor(){
                const colorIndex = this.randomInt(0,this.colorArray.length)
                return this.colorArray[colorIndex]
            }

    fillDripsArray(){
        for(let i = 0; i < this.maxDrips; i++){
            const sDrip = {}
            sDrip.x = this.dripPanel * fxrand()
            sDrip.y = this.y * 0.7 * fxrand()
            sDrip.color = this.randomColor()
            this.dripsArray.push(sDrip) 
        }
       
    }

    drawDrip(x,y,color,{context} = this){
        context.save()
        context.fillStyle = color
        context.strokeStyle = this.strokeColor
        context.lineWidth = this.lineWidth
        context.translate(x - this.dripPanel/2 ,y)
        context.beginPath()
        context.arc(0,0,this.dripRadius,0,Math.PI*2)
        context.fill()
        context.stroke()
        context.restore()
    }

    moveDrips(){
        this.dripsArray.forEach(d=>{
            d.y += this.yVelocity
            d.y > this.y - this.radius * 0.75 ? d.y = 0 : null;
        })
    }

    animateDrips(){
        this.dripsArray.forEach(d=>{
            this.context.save()
            this.context.translate(this.x,0)
            this.moveDrips()
            this.drawDrip(d.x,d.y,d.color)
            this.context.restore()
        })
    }
}

class Thread{
    constructor(x,y,radius,colors,orbit){
        this.canvas = document.querySelector('canvas')
        this.context = this.canvas.getContext('2d')
        this.x = x
        this.y = y
        
        this.angle = 0
        this.angleVelocity = 0.005

        this.radius = this.minRadius
        this.maxRadius = radius
        this.minRadius = this.maxRadius * 0.10
        this.radiusVelocity = 0.5

        this.arcLength = 2 * fxrand()

        this.lineWidth = this.radius * 0.05
        this.hslArray = colors
        this.strokeStyle = this.randomHSL()
        
        this.maxThreads = this.maxRadius - this.minRadius
        this.checkDirection(orbit)
        this.randomThread()
    }

    drawThread({context} = this){
        context.save()
        context.translate(this.x,this.y)
        context.lineCap = 'round'
        context.strokeStyle = this.strokeStyle
        context.lineWidth = this.lineWidth
        context.rotate(this.angle)
        context.beginPath()
        context.arc(0,0,this.radius,0,this.arcLength)
        context.stroke()
        context.restore()
    }

    rotateThread(){
        this.angle += this.angleVelocity
    }

    radiusThread(){
        this.radius += this.radiusVelocity
        this.radius > this.maxRadius ? this.radius = this.minRadius : null;
    }

    threadWidth(){
        this.lineWidth = this.radius * 0.05
    }

    checkDirection(orbit){
        if(orbit === 1){
            this.angleVelocity *= this.randomDirection()
            poolDirection = 'both'
        }
        else if(orbit === 2){
            this.angleVelocity *= -1
            poolDirection = 'counter-clockwise'
        }
        else{
            this.angleVelocity *= 1
            poolDirection = 'clockwise'
        }
    }
    randomInt(min,max){
        return Math.floor(fxrand()*max)+min
    }

    randomHSL(){
        const index = this.randomInt(0,this.hslArray.length)
        return this.hslArray[index]
    }

    randomRadius(){
        const drips = new Drips()
        
        this.radius = Math.round(this.maxRadius * fxrand())
    }

    randomAngle(){
        this.angle = Math.PI * 2 * fxrand()
    }

    randomThread(){
        this.randomRadius()
        this.randomAngle()
    }

    randomDirection(){
        return fxrand() >= 0.5 ? 1 : -1
    }

    animateThread(){
        this.radiusThread()
        this.threadWidth()
        this.rotateThread()
        this.drawThread()
    }
}

function randomInt(min,max){
    return Math.floor(fxrand()*max)+min
}





const hexColors1 = ["#03045e","#023e8a","#0077b6","#0096c7","#00b4d8","#48cae4","#90e0ef","#ade8f4","#caf0f8"]
const hexColors2 = ["#f72585","#b5179e","#7209b7","#560bad","#480ca8","#3a0ca3","#3f37c9","#4361ee","#4895ef","#4cc9f0"]
const hexColors3 = ["#cb997e","#ddbea9","#ffe8d6","#b7b7a4","#a5a58d","#6b705c"]
const hexColors4 = ["#10002b","#240046","#3c096c","#5a189a","#7b2cbf","#9d4edd","#c77dff","#e0aaff"]

// const hexColors4 = ["#d9ed92","#99d98c","#76c893","#52b69a","#34a0a4","#168aad","#1a759f","#1e6091","#184e77"]
const hexColors5 = ["#d8f3dc","#b7e4c7","#95d5b2","#74c69d","#52b788","#40916c","#2d6a4f","#1b4332","#081c15"]
// const hexColors6 = ["#006466","#065a60","#0b525b","#144552","#1b3a4b","#212f45","#272640","#312244","#3e1f47","#4d194d"]
const hexColors6 = ["#fbf8cc","#fde4cf","#ffcfd2","#f1c0e8","#cfbaf0","#a3c4f3","#90dbf4","#8eecf5","#98f5e1","#b9fbc0"]
const hexColors7 = ["#ff6d00","#ff7900","#ff8500","#ff9100","#ff9e00","#240046","#3c096c","#5a189a","#7b2cbf","#9d4edd"]
const hexColors8 = ["#590d22","#800f2f","#a4133c","#c9184a","#ff4d6d","#ff758f","#ff8fa3","#ffb3c1","#ffccd5","#fff0f3"]
const colorGrab = [hexColors1,hexColors2,hexColors3,hexColors4,hexColors5,hexColors6,hexColors7,hexColors8]
const colorIndex = randomInt(0,8)

const hslColors = colorGrab[colorIndex]

class Faucet{
    constructor(x,y,radius,colors){
        this.canvas = document.querySelector('canvas')
        this.context = this.canvas.getContext('2d')
        this.x = x
        this.xVelocity = 1
        this.y = y
        this.direction = this.randomDirection()
        this.angle = Math.PI * 2 * fxrand()
        this.angleVelocity = 0.001
        this.lineWidth = radius / 10
        this.radius = radius
        this.colors = colors
        this.faucetColor  = this.randomHSL()
        this.waterDrops = []
        this.fillWaterDrops()
    }
    randomDirection(){
        if(fxrand() >= 0.5){
            stickDirection = 'clockwise'
            return 1
        }
        else{
            stickDirection = 'counter-clockwise'
            return -1
        }
    }

    randomInt(min,max){
        return Math.floor(fxrand()*max)+min
    }

    randomHSL(){
        const index = this.randomInt(0,this.colors.length)
        return this.colors[index]
    }

    fillWaterDrops(){
        const maxDrops = this.radius / 10
        for(let i = 0; i < maxDrops; i++){
            let drop = {}
            drop.x = this.randomInt(0,this.radius)
            drop.radius = this.lineWidth * 0.25
            drop.color = this.randomHSL()
            this.waterDrops.push(drop)
        }
    }

    drawFaucet({context} = this){
        context.save()
        context.shadowBlur = this.radius / 100
        context.shadowColor = 'black'
        context.lineCap = 'round'
        context.lineWidth = this.lineWidth
        context.strokeStyle = this.faucetColor
        context.translate(this.x,this.y)
        this.rotateFaucet()
        context.rotate(this.angle)
        context.beginPath()
        context.moveTo(0,0)
        context.lineTo(this.radius,0)
        context.stroke()
        this.drawDrop(0,this.lineWidth*0.4,this.faucetColor)
        this.drawDrop(this.radius,this.lineWidth*0.4,this.faucetColor)
        this.moveDrops()
        this.drawStream()
        context.restore()
    }

    drawDrop(x,radius,color,{context} = this){
        context.save()
        context.fillStyle = color
        context.beginPath()
        context.arc(x,0,radius,0,Math.PI*2)
        context.fill()
        context.restore()
    }
    moveDrops(){
        this.waterDrops.forEach(drp=>{
            drp.x -= this.xVelocity
            drp.x < 0 ? drp.x = this.radius : null;
        })
    }
    rotateFaucet(){
        this.angle += this.angleVelocity * this.direction
    }

    drawStream(){
        this.waterDrops.forEach(wd=>{
            this.drawDrop(wd.x,wd.radius,wd.color)
        })
    }
}

class Pond{
    constructor(x,y,radius,colors){
        this.canvas = document.querySelector('canvas')
        this.context = this.canvas.getContext('2d')
        this.x = x
        this.y = y
        this.radius = radius
        this.colors = colors
        this.color1 = this.randomHSL()
        this.color2 = this.randomHSL()
        this.color3 = this.randomHSL()
    }

    randomHSL(){
        const index = randomInt(0,this.colors.length)
        return this.colors[index]
    }

    fillArc({context} = this){
        context.save()
        context.lineWidth = this.radius / 10
        context.strokeStyle = this.color1
        context.fillStyle = this.color2
        context.translate(this.x,this.y)
        context.beginPath()
        context.arc(0,0,this.radius,0,Math.PI*2)
        context.fill()
        context.stroke()
        context.restore()
    }
    strokeArc({context} = this){
        context.save()
        context.shadowBlur = this.radius / 40
        context.shadowColor = 'black'
        context.lineWidth = this.radius / 10
        context.strokeStyle = this.color3
        context.translate(this.x,this.y)
        context.beginPath()
        context.arc(0,0,this.radius,0,Math.PI*2)
        context.stroke()
        context.restore()
    }
}

class Plumbing{
    constructor(x,y,radius,colors){
        this.canvas = document.querySelector('canvas')
        this.context = this.canvas.getContext('2d')
        this.x = x
        this.y = y
        this.reverse = false
        this.radius = radius * 1.2
        this.colors = colors
        this.fillStyle = this.randomColor()
        this.strokeStyle = this.randomColor()
        this.x1 = -this.radius / 5
        this.y1 = -this.radius / 5
        this.z1 = 0
        this.yVelocity = 1
        this.x2 = this.radius / 5
        this.y2 = this.radius / 5
        this.z2 = 0
        this.zOffset =this.radius / 5
        this.createGradient()
        this.x > this.canvas.width/2 ? this.reverse = true : this.reverse = false;
    }
    randomInt(min,max){
        return Math.floor(fxrand()*max)+min
    }

    randomColor(){
                const colorIndex = this.randomInt(0,this.colors.length)
                return this.colors[colorIndex]
    }

    createGradient({context} = this){
        const gradient = context.createLinearGradient(0,0,0,this.radius/4)
        // for(let i = 0; i < this.colors.length; i++){
            // gradient.addColorStop(i/this.colors.length,this.colors[i])
        // }
        gradient.addColorStop(0,'black')
        gradient.addColorStop(0.5,'black')
        gradient.addColorStop(1,this.fillStyle)
        this.fillStyle = gradient
    }

    drawShower({context} = this){
        context.save()
        context.shadowBlur = this.radius / 100
        context.shadowColor = 'black'
        context.lineJoin = 'round'
        context.lineWidth = this.radius / 40
        context.fillStyle = this.fillStyle
        context.strokeStyle = this.strokeStyle
        context.translate(this.x,0)
        context.beginPath()
        context.moveTo(0,0)
        context.lineTo(-this.radius,0)
        context.quadraticCurveTo(-this.radius/2,this.radius/4/2,-this.radius/2,this.radius/4)
        context.bezierCurveTo(this.x1,this.z1+this.zOffset,this.x2,this.z2+this.zOffset,this.radius/2,this.radius/4)
        context.quadraticCurveTo(this.radius/2,this.radius/4/2,this.radius,0)
        context.lineTo(this.radius,0)
        context.lineTo(0,0)
        context.fill()
        context.restore()
    }

    waveShower(){
        this.z1 < this.y1 ? this.yVelocity*=-1 : null
        this.z1 > this.y2 ? this.yVelocity*=-1 : null
            this.z1 -= this.yVelocity
            this.z2 += this.yVelocity
    }


    animateShower(color){
        this.fillStyle = color
        this.waveShower()
        this.drawShower()
    }
}

class backgroundPattern{
    constructor(colors){
        this.canvas = document.querySelector('canvas')
        this.context = this.canvas.getContext('2d')
        this.colors = colors
        this.spacing = 20
        this.lineWidth = this.spacing / 2
        this.strokeStyle = 'white'
        this.maxArcs = this.canvas.width / this.spacing
        this.arcArray = []
        this.arcsArray()
    }
    randomInt(min,max){
        return Math.floor(fxrand()*max)+min
    }
    
    randomColor(){
        const index = this.randomInt(0,this.colors.length)
        return this.colors[index]
    }
    arcsArray(){
        for(let i = 0; i < this.maxArcs; i++){
            const x = this.canvas.width * fxrand()
            const y = this.canvas.height * fxrand()
            const r = this.canvas.width/4 * fxrand()
            const c1 = this.randomColor()
            const c2 = this.randomColor()
            this.arcArray.push({x:x,y:y,r:r,c1:c1,c2:c2})
        }
    }
    drawArcs(x,y,radius,c1,c2,{context} = this){
        context.save()
        context.lineWidth = radius / 10
        context.strokeStyle = c1
        context.fillStyle = c2
        context.translate(x,y)
        context.beginPath()
        context.arc(0,0,radius,0,Math.PI*2)
        context.fill()
        context.stroke()
        context.restore()
    }
    animateArcs(){
        for(let i = 0; i < this.arcArray.length; i++){
            const x = this.arcArray[i].x
            const y = this.arcArray[i].y
            const z = this.arcArray[i].r
            const c1 = this.arcArray[i].c1
            const c2 = this.arcArray[i].c2
            this.drawArcs(x,y,z,c1,c2)
        }
    }
}

resizeCanvas()
const canv = document.querySelector('canvas')
const cnx = canv.getContext('2d')

function randomDirection(){
    return fxrand() >= 0.5 ? 1 : -1
}

function randProps(){
    // xaxis = canv.width/2
    yaxis = canv.width/2
    zradius = randomInt(canv.height/7,canv.height/5)
    xaxis = randomInt(zradius + 25,canv.width - zradius*2 - 50)
    // zradius = canv.width/3
    
    // xaxis = (canv.width/2) + (canv.width/8 * randomDirection())
    // yaxis = (canv.height/2) + (canv.width/8 * randomDirection())
    // zradius = randomInt(canv.height/7,canv.height/5)

}

function createThreads(){
    const canvas = document.querySelector('canvas')
    const ratio = 0.5
    const threadArray = []
    const d = randomInt(1,3)
    for(let i = 0; i < canvas.width * ratio; i++){
        const thread = new Thread(xaxis,yaxis,zradius,hslColors,d)
        threadArray.push(thread)
    }
    return threadArray
}

randProps()
const fullPond = createThreads()
const emptyPond = new Pond(xaxis,yaxis,zradius,hslColors)
const metalFaucet = new Faucet(xaxis,yaxis,zradius,hslColors)
const waterDrips = new Drips(xaxis,yaxis,zradius)
const paintDrips = new ColoredDrips(xaxis,yaxis,zradius,hslColors)
const bottomPlumbing = new Plumbing(xaxis,yaxis,zradius,hslColors)
const bPattern = new backgroundPattern(hslColors)

// bgrad.addColorStop(0,'tan')
// bgrad.addColorStop(0.5,'tan')
// bgrad.addColorStop(1,'white')


function randomColor(colors){
    const index = randomInt(0,colors.length)
    return colors[index]
}



const background = randomColor(hslColors)

function loop(){
    fillCanvas(background,'black',40)
        bPattern.animateArcs()
        paintDrips.animateDrips()
        waterDrips.animateDrips()
    strokeCanvas('tan','black',40)
        emptyPond.fillArc()
        fullPond.forEach(thread => thread.animateThread())
        emptyPond.strokeArc()
        metalFaucet.drawFaucet()
        bottomPlumbing.animateShower('black')
    requestAnimationFrame(loop)
}
loop()

window.addEventListener("contextmenu",e => e.preventDefault())
window.addEventListener("resize", () => location.reload())

window.$fxhashFeatures = {
  "Paint Pool Rotation": poolDirection,
  "Paint Stick Rotation": stickDirection,
}