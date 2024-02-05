const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const score = document.querySelector(".score-value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const button = document.querySelector(".play")

const audio = new Audio("../assets/audio.mp3")

const size = 30

const initialPosition = {x: 270, y: 240}
//posição inicial da cobra
let snake = [initialPosition]

//Pontuação
const incrementScore = () => {
    score.innerText = +score.innerText + 10
}

//função para aleatorizar a posição da comida
const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30
}

//função para aleatorizar a cor da comida (RGB)
const randomColor = () => {
    const red = randomNumber(0,255)
    const green = randomNumber(0,255)
    const blue = randomNumber(0,255)

    return `rgb(${red}, ${green}, ${blue})`
}

//imprime a posição da comida
const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor(),
}

//direção da cobrinha
let direction, loopId

const drawFood = () => {

    const{ x, y, color} = food

    ctx.shadowColor = color
    ctx.shadowBlur = 6
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}

// desenhar a cobrinha
const drawSnake = () => {
    ctx.fillStyle = "#3ECD8D" //preenchimento da figura
    // ctx.fillRect(snake[0].x, snake[0].y, size, size) //posição da figura H e V, e tamanho da figura W e H
    snake.forEach((position, index) => {

        if(index == snake.length - 1){// verifica qual o index para defini-lo como cabeça
            ctx.fillStyle = "#0DB1A1"
        }

        ctx.fillRect(position.x, position.y, size, size)
    })
}

//mover a cobrinha
const moveSnake = () => {
    if (!direction) return

    const head = snake[snake.length - 1]//verifica a posição da cabeça

    snake.shift()//remove o último elemento do array

    if (direction == "right"){ //verifica a direção da cobrinha
        snake.push({ x: head.x + size, y: head.y })
    }
    if (direction == "left"){ 
        snake.push({ x: head.x - size, y: head.y })
    }
    if (direction == "down"){ 
        snake.push({ x: head.x, y: head.y + size })
    }
    if (direction == "up"){ 
        snake.push({ x: head.x, y: head.y - size })
    }
}

const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "#191919"

    for (let i = 30; i < canvas.width; i +=30){
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }
}

//Verifica se a cobrinha comeu a comida
const checkEat = () => {
    const head = snake[snake.length - 1]

    if(head.x == food.x && head.y == food.y){
        incrementScore()
        snake.push(head)
        audio.play()
        //se a condição for verdadeira, gera uma nova comida
        let x = randomPosition()
        let y = randomPosition()
        //impede que a comida seja gerada em cima da cobrinha
        while(snake.find((position) => position.x == x && position.y == y)){
        x = randomPosition()
        y = randomPosition()
        }

        food.x = x
        food.y = y
        food.color = randomColor()
    }
}

//limita o espaço
const checkCollision = () => {
    const head = snake[snake.length - 1]
    const canvasLimite = canvas.width - size
    const neckIndex = snake.length - 2
    //verifica se a cobra colidiu com a parede
    const wallColision = head.x < 0 || head.x > canvasLimite || head.y < 0 || head.y > canvasLimite
    //verifica se a cobre colidiu com ela mesma
    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

    if (wallColision || selfCollision){
        gameOver()
    }
}

const gameOver = () => {
    direction = undefined
    menu.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(3px)"
}

const gameLoop = () => {
    clearInterval(loopId)
    ctx.clearRect(0, 0, 600, 600)
    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    checkEat()
    checkCollision()

    loopId = setTimeout(() =>{
        gameLoop()
    }, 300)
}

gameLoop()

// adicionar função dos botões do teclado
document.addEventListener("keydown", ({ key }) => {
    if(key == "ArrowRight" && direction !== "left"){
        direction = "right"
    }
    if(key == "ArrowLeft" && direction !== "right"){
        direction = "left"
    }
    if(key == "ArrowDown" && direction !== "up"){
        direction = "down"
    }
    if(key == "ArrowUp" && direction !== "down"){
        direction = "up"
    }
})

//botão jogar novamente
button.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    snake = [initialPosition]
})