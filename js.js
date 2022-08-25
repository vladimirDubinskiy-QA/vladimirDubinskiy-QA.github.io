const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const particlesArray = []
const obstaclesArray =[]
canvas.width = 600
canvas.height = 400

let spacePressed = false
let angle = 0
let hue = 0
let frame = 0
let score = 0
let gamespeed = 3

const gradient = ctx.createLinearGradient(0, 0, 0, 70)
gradient.addColorStop('0.4', '#fff')
gradient.addColorStop('0.5', '#000')
gradient.addColorStop('0.55', '#4040ff')
gradient.addColorStop('0.6', '#000')
gradient.addColorStop('0.9', '#fff')

class Particle {
  constructor(){
    this.x = bird.x
    this.y = bird.y
    this.size = Math.random() * 7 + 3
    this.speedY = (Math.random()*1) - 0.5
    this.color = 'hsla(' + hue + ',100%, 50%, 0.8'
  }
  update(){
    this.x -= gamespeed
    this.y += this.speedY
  }
  draw(){
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
  }
}

function handleParticles(){
  particlesArray.unshift(new Particle)
  for (i = 0; i < particlesArray.length; i++){
      particlesArray[i].update()
      particlesArray[i].draw()
  }
  // Если частиц больше 200 - удаляем 20
  if (particlesArray.length > 320){
      for (i = 0; i < 20; i++){
      particlesArray.pop(particlesArray[i]);
    }
  }    
}

class Obstacle {
  constructor(){
    this.top = (Math.random() * canvas.height/3) + 15
    this.bottom = (Math.random() * canvas.height/3) + 15
    this.x = canvas.width
    this.width = 20
    this.color = 'hsla(' + hue + ', 100%, 50%, 1)'
    this.counted = false
  }
  draw(){
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, 0, this.width, this.top)
    ctx.fillRect(this.x, canvas.height - this.bottom, this.width, this.bottom)
  }
  update(){
     this.x -= gamespeed
     if (!this.counted && this.x < bird.x){
      score++
      this.counted = true
     }
     this.draw()
  }
}

function handleObstacles(){
  if (frame%10 ===0){
    obstaclesArray.unshift(new Obstacle)
  }
  for (i = 0; i < obstaclesArray.length; i++){
    obstaclesArray[i].update()
  }
  if (obstaclesArray.length > 48){
    obstaclesArray.pop(obstaclesArray[0])
  }
}  

class Bird {
  constructor(){
    this.x = 150
    this.y = 200
    this.vy = 0
    this.width = 20
    this.height = 20
    this.weight = 0.6
  }
  update(){
    let curve = Math.sin(angle) * 20
    if (this.y > canvas.height - this.height * 3 + curve){
        this.y = canvas.height - this.height * 3 + curve
        this.vy = 0
    } else {
    this.vy += this.weight
    this.vy *= 0.9
    this.y += this.vy
    }
    if (this.y < 0 + this.height){
      this.y = 0 + this.height
      this.vy = 0
    }
    if (spacePressed && this.y > this.height * 3) this.flap()
  }
  draw(){
    ctx.fillStyle = 'red'
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }
  flap(){
    this.vy -= 1.33
  }
}
const bird = new Bird()

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  //ctx.fillRect(10, canvas.height - 90, 50, 50)
  handleObstacles()
  bird.update()
  bird.draw()
  ctx.fillStyle = gradient
  ctx.font = '90px Georgia'
  ctx.strokeText(score , 100, 70)
  ctx.fillText(score, 100, 70)
  handleCollisions()
  handleParticles()
  if (handleCollisions()) return
  requestAnimationFrame(animate)
  angle+=0.12
  hue++
  frame++
}
animate()

window.addEventListener('keydown', function(e){
    if (e.code === 'Space') spacePressed = true
      
})
window.addEventListener('keyup', function(e){
    if (e.code === 'Space') spacePressed = false
})   

const bang = new Image()
bang.src = 'dead1.png'
function handleCollisions(){
  for (i = 0; i < obstaclesArray.length; i++){
    if(bird.x < obstaclesArray[i].x + obstaclesArray[i].width && bird.x + bird.width > obstaclesArray[i].x &&
      ((bird.y < 0 + obstaclesArray[i].top && bird.y + bird.height >0) ||
       (bird.y > canvas.height - obstaclesArray[i].bottom &&
       bird.y + bird.height < canvas.height))){
      //Отловили столкновение
      ctx.drawImage(bang, bird.x - 10, bird.y -10, 50, 50)
      ctx.font = "25px Georgia"
      ctx.fillStyle = '#fff'
      ctx.fillText('Игра окончена, счёт:' + score, 160, canvas.height/2 - 10)
      return true    
    } 
  }
}   

