document.addEventListener('DOMContentLoaded', () => {
    const width = 10
    const grid = document.querySelector('.grid')
    // define que toda vez que chamar a const grid, ele vai buscar o elemento com a classe .grid
    let squares = Array.from(document.querySelectorAll('.grid div'))
    // aqui ele esta transformando todos os elementos div em um lindo array
    let nextRandom = 0
    let timerID 
    var score = 0
    const btnRegistrar= document.querySelector('#button_registrar')
    const body = document.querySelector('#bd_tetris')
    const scoreDisplay = document.querySelector('#span_pontuação')
    const tetrisDisplay = document.querySelector('#ct-tetris')
    const pop = document.querySelector('#pop')
    const startBtn = document.querySelector('#comecar')
    const cores = [
        '#00ADEE',
        '#EC008B',
        '#8AC53E',
        '#FFF100',
        '#F6972B', 
        '#EC1B24',
        '#FFC518'
    ]

// aqui eu faço os desenhos das peças usando o indice pra indicar onde está preenchido
    const peçaL =[
        [1,width+1, width*2 +1, 2],
        [width, width+1, width+2, width* 2 + 2],
        [1,width+1,width*2+1, width *2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ]
    const peçaZ = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
    ]
    const peçaT = [
        [1, width, width + 1, width + 2],
        [1,width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]
    const peçaO = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ]
    const peçaI = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ]
    const peçaLInv = [
      [0, 1, width + 1, width * 2 +1],
      [width, width+1, width + 2, width *2],
      [1, width +1 , width* 2 + 1, width * 2 + 2 ],
      [width + 2, width * 2, width * 2 +1, width * 2 +2]
    ]
    const peçaZInv =[
      [width, width+1,width *2 +1, width*2 +2],
      [2, width +1, width +2, width * 2+1],
      [width, width+1,width *2 +1, width*2 +2],
      [2, width +1, width +2, width * 2+1]
    ]

    const peças = [peçaL, peçaZ,peçaT, peçaO,peçaI, peçaLInv, peçaZInv]
    
    let currentPosition = 4 // aqui diz onde a peça vai començar dentro do grid
    let currentRotation = 0 // aqui diz em qual rotação ela vai começar -- sempre a primeira
    
    let random = Math.floor(Math.random() * peças.length) // aqui eu digo qual peça será a proxima (randomico)
    let current = peças[random][currentRotation] // current é a peça selecionada aleatoriamente
    
    
    function desenhar(){
            current.forEach(index => {
              squares[currentPosition + index].classList.add('peça')
              squares[currentPosition + index].style.backgroundColor= cores[random]
            })
          }
    function apagar(){
        current.forEach(index => {
          squares[currentPosition + index].classList.remove('peça')
          squares[currentPosition + index].style.backgroundColor= ''
        })
    }

    function control(e){
        if(e.keyCode === 65){
            moveLeft()
        } else if (e.keyCode === 87){
            rotate()
        }else if(e.keyCode === 68){
           moveRight()
        } else if (e.keyCode === 83){
            moveDown()
            
        }
    }
    document.addEventListener('keydown',control)

    function moveDown(){
        apagar()
        currentPosition += width
        desenhar()
        freeze()
        FimdeJogo()
    }
    function freeze (){
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
          //se algum indice (div) encostar em uma div  com a classe taken, o código transforma todas as divs da peça em taken.
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            random = nextRandom
            nextRandom = Math.floor(Math.random()* peças.length)
            current = peças[random][currentRotation]
            currentPosition= 4 
            desenhar()
            displayShape()
            addScore()
        }
    }

    //mover as peças pra direita/esquerda exceto quando está na borda ou tem algo bloquando

    function moveLeft(){
        apagar()
        const estaNaBordaEsquerda = current.some(index =>(currentPosition + index) % width === 0)
          /* os numeros da borda esquerda sempre são multiplos de 10, 0, 10, 20 ,30 isso pois o width do grid é 10
          eu verifico se ele esta na borda esquerda checando se o resto da divisão da posição de uma peça pelo width é 0
          se verdadeiro, significa que tem alguma peça na esquerda. */
        if (!estaNaBordaEsquerda) currentPosition -=1
        // se ele não está na borda esquerda, eu deixo ele se mexer para a esquerda, como eu faço isso?
        // sei la
        // width é = 10, o primeiro quadrado é na posição 0 então pra mexer pra direita é +1, já pra direita é -1 :D
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        current+= 1
        } 
        desenhar()
    }

    function moveRight(){
        apagar()
        const estaNaBordaDireita = current.some(index =>(currentPosition + index) % width === width - 1)
        
        if (!estaNaBordaDireita) currentPosition +=1

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        current -= 1
        } 
        desenhar()
    }
    function isAtRight() {
        return current.some(index=> (currentPosition + index + 1) % width === 0)  
      }
      
      function isAtLeft() {
        return current.some(index=> (currentPosition + index) % width === 0)
      }
      
      function checkRotatedPosition(P){
        P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
        if ((P+1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
          if (isAtRight()){            //use actual position to check if it's flipped over to right side
            currentPosition += 1    //if so, add one to wrap it back around
            checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
            }
        }
        else if (P % width > 5) {
          if (isAtLeft()){
            currentPosition -= 1
          checkRotatedPosition(P)
          }
        }
      }

    function rotate(){
        apagar()
        currentRotation++
        if(currentRotation === current.length ){
            currentRotation=0
        }
        current = peças[random][currentRotation]
        checkRotatedPosition()
        desenhar()
    }
 

    //aqui começa o código do display da proxima peça
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0

    const proximaPeça = [
        [1, displayWidth+1, displayWidth*2+1, 2], 
        [0, displayWidth, displayWidth+1, displayWidth*2+1], 
        [1, displayWidth, displayWidth+1, displayWidth+2], 
        [0, 1, displayWidth, displayWidth+1], 
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1],
        [0, 1, displayWidth + 1, displayWidth * 2 +1],
        [displayWidth, displayWidth+1, displayWidth *2 +1, displayWidth*2 +2],
    ]

    function displayShape(){
        displaySquares.forEach(square => {
            square.classList.remove('peça')
            square.style.backgroundColor= ''
        })
        proximaPeça[nextRandom].forEach(index => { 
            displaySquares[displayIndex + index].classList.add('peça')
            displaySquares[displayIndex+index].style.backgroundColor= cores[nextRandom]
        })
    }

startBtn.addEventListener('click', () => {
if (timerID){
    clearInterval(timerID)
    timerID = null
} else{
    desenhar()
    timerID = setInterval(moveDown,1000)
    nextRandom = Math.floor(Math.random() * peças.length)
    displayShape()
}
})

function addScore (){
    for(let i  = 0; i < 199; i+= width){
        const fileira = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
        if (fileira.every(index => squares[index].classList.contains('taken'))){
           score +=10
           scoreDisplay.innerHTML = score
           fileira.forEach(index => {
             squares[index].classList.remove('taken')
             squares[index].classList.remove('peça')
             squares[index].style.backgroundColor = ''
           })
           const squaresRemoved = squares.splice(i,width)
           squares = squaresRemoved.concat(squares)
           squares.forEach(cell => grid.appendChild(cell))
        }
    }
}

function FimdeJogo(){
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
    tetrisDisplay.classList.add('hidden')
    pop.classList.add('show')
    pontos_pop.innerHTML = score
    clearInterval(timerID)
    }
}

btnRegistrar.addEventListener('click', () => {
    var NicknameVar = ipt_nickname.value;
    console.log(score)
    if (NicknameVar == "") {

      alert("Mensagem de erro para todos os campos em branco");
      return false;
    }
    else {
    }

    // Enviando o valor da nova input
    fetch("/usuarios/cadastrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nicknameServer: NicknameVar,
        scoreServer: score
      })
    }).then(function (resposta) {

      console.log("resposta: ", resposta);

      if (resposta.ok) {
        console.log('registrado')

        setTimeout(() => {
          window.location = "tetris.html";
        }, "2000")

        limparFormulario();
        finalizarAguardar();
      } else {
        throw ("Houve um erro ao tentar realizar o cadastro!");
      }
    }).catch(function (resposta) {
      console.log(`#ERRO: ${resposta}`);
      finalizarAguardar();
    });
    
    window.location.reload()
})

window.addEventListener('load', () => {
  console.log("foi!")
    fetch("/usuarios/placar")
        .then(resposta => {

            if (resposta.ok) {
                resposta.json().then(resposta => {

                    console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
                    
                    for( i = 0;  i  < resposta.length ; i ++){
                      placarnomes.innerHTML +=  `<div class = "nome">
                      <span>
                      ${resposta[i].nickname} : ${resposta[i].pontos}
                      </span>
                      </div>`
                      
                    }
                });
            } else {

                console.error('Nenhum dado encontrado ou erro na API');
            }
        })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados do aquario p/ gráfico: ${error.message}`);
        });

})
})