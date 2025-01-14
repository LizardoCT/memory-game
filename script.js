document.addEventListener('DOMContentLoaded', () => {
  const images = [
    './images/beatles.webp',
    './images/blink182.webp',
    './images/fkatwigs.webp',
    './images/fleetwood.webp',
    './images/greenday.webp',
    './images/kiss.webp',
    './images/metallica.webp',
    './images/pinkfloyd.webp',
  ]

  let cards = []
  let flippedCards = []
  let lives = 6
  let isLocked = false

  function showGameOverMessage(message1, message2) {
    const messageElement1 = document.getElementById('game-message-1')
    const messageElement2 = document.getElementById('game-message-2')

    // Asignar los mensajes a los párrafos
    messageElement1.textContent = message1
    messageElement2.textContent = message2

    // Mostrar el modal
    document.getElementById('game-over').classList.remove('hidden')
    // Mostrar el overlay (fondo oscuro)
    document.getElementById('overlay').classList.remove('hidden')

    // Animación de confeti solo si el jugador gana
    if (message1 === '¡YOU WIN!') {
      confetti({
        particleCount: 200,
        spread: 150,
        origin: { x: 0.5, y: 0.6 },
      })
    }
  }

  function createCards() {
    const duplicatedImages = [...images, ...images]
    return duplicatedImages
      .sort(() => Math.random() - 0.5)
      .map((image, index) => ({
        id: index,
        image,
        isFlipped: false,
        isMatched: false,
      }))
  }

  function updateUI() {
    const livesCountElement = document.getElementById('lives-count')
    const heart = document.querySelector('.heart')
    const heartBroken = document.querySelector('.heart-broken')
    const currentLives = lives // Asume que `lives` es la variable global para las vidas restantes

    // Animación para el contador de vidas
    livesCountElement.classList.add('fade-out')

    setTimeout(() => {
      // Actualizar el contenido del contador
      livesCountElement.textContent = currentLives.toString()

      // Cambiar a fade-in
      livesCountElement.classList.remove('fade-out')
      livesCountElement.classList.add('fade-in')

      // Remover la clase fade-in después de la animación
      setTimeout(() => {
        livesCountElement.classList.remove('fade-in')
      }, 500) // Duración de la animación de fade-in
    }, 500) // Duración de fade-out

    // Animación para los corazones
    if (currentLives < 6) {
      // Ocultar el corazón actual y mostrar el corazón roto con animación
      heart.classList.add('hidden')
      heartBroken.classList.remove('hidden')
      heartBroken.classList.add('animate')

      setTimeout(() => {
        heartBroken.classList.remove('animate')
        heartBroken.classList.add('hidden')
        heart.classList.remove('hidden')
      }, 1000) // Duración de la animación del corazón roto
    } else if (currentLives === 0) {
      heart.classList.add('hidden')
      heartBroken.classList.add('hidden')
    }
  }

  function createGameGrid() {
    const gameGrid = document.getElementById('game-grid')
    gameGrid.innerHTML = ''

    cards.forEach((card, index) => {
      const cardElement = document.createElement('div')
      cardElement.className = 'card'
      cardElement.dataset.index = index.toString()
      cardElement.textContent = '❓'

      cardElement.addEventListener('click', () => handleCardClick(index))
      gameGrid.appendChild(cardElement)
    })
  }

  function flipCard(index, show) {
    const cardElement = document.querySelector(`[data-index="${index}"]`)
    if (show) {
      cardElement.classList.add('flipped')
      cardElement.innerHTML = `<img src="${cards[index].image}" alt="card front">`
    } else {
      cardElement.classList.remove('flipped')
      cardElement.textContent = '❓'
    }
  }

  function handleCardClick(index) {
    if (
      isLocked ||
      flippedCards.length === 2 ||
      cards[index].isFlipped ||
      cards[index].isMatched
    ) {
      return
    }

    flipCard(index, true)
    cards[index].isFlipped = true
    flippedCards.push(index)

    if (flippedCards.length === 2) {
      isLocked = true

      const [firstIndex, secondIndex] = flippedCards

      if (cards[firstIndex].image === cards[secondIndex].image) {
        cards[firstIndex].isMatched = true
        cards[secondIndex].isMatched = true

        // Añadir la clase para la animación de escala
        const firstCardElement = document.querySelector(
          `[data-index="${firstIndex}"]`
        )
        const secondCardElement = document.querySelector(
          `[data-index="${secondIndex}"]`
        )

        setTimeout(() => {
          firstCardElement.classList.add('match')
          secondCardElement.classList.add('match')
        }, 1000)

        // Remover la clase después de la animación
        setTimeout(() => {
          firstCardElement.classList.remove('match')
          secondCardElement.classList.remove('match')
          isLocked = false
          flippedCards = []
        }, 500)

        if (cards.every((card) => card.isMatched)) {
          setTimeout(() => {
            showGameOverMessage('¡YOU WIN!', 'Has ganado el juego 🤑')
          }, 500)
        }
      } else {
        lives--
        updateUI()

        if (lives <= 0) {
          setTimeout(() => {
            flipCard(firstIndex, false)
            flipCard(secondIndex, false)
            cards[firstIndex].isFlipped = false
            cards[secondIndex].isFlipped = false
            flippedCards = []
            showGameOverMessage('¡GAME OVER!', 'Has perdido todas tus vidas 😓')
          }, 1000)
          return
        }

        setTimeout(() => {
          flipCard(firstIndex, false)
          flipCard(secondIndex, false)
          cards[firstIndex].isFlipped = false
          cards[secondIndex].isFlipped = false
          flippedCards = []
          isLocked = false
        }, 1000)
      }
    }
  }

  function resetMatchedCards(callback) {
    const matchedCards = cards.filter((card) => card.isMatched)

    // Verificar si hay cartas que hicieron match
    if (matchedCards.length === 0) {
      if (callback) callback() // Llamar al callback inmediatamente si no hay cartas
      return
    }

    matchedCards.forEach((card) => {
      const cardElement = document.querySelector(`[data-index="${card.id}"]`)
      if (cardElement) {
        card.isFlipped = false // Marcar como no volteada
        flipCard(card.id, false) // Usar la animación de volteo existente
      }
    })

    // Esperar a que termine la animación antes de continuar
    setTimeout(() => {
      if (callback) callback()
    }, 400) // Ajusta este tiempo según la duración de tu animación
  }

  function restartGame() {
    lives = 6
    flippedCards = []
    isLocked = false
    cards = createCards()
    document.getElementById('game-over').classList.add('hidden')
    document.getElementById('overlay').classList.add('hidden')
    createGameGrid()
    updateUI()
  }

  // Event listeners
  document.getElementById('restart-button').addEventListener('click', () => {
    resetMatchedCards(() => {
      restartGame() // Reinicia el juego después de voltear las cartas
    })
  })

  document.getElementById('play-again').addEventListener('click', () => {
    resetMatchedCards(() => {
      restartGame() // Reinicia el juego después de voltear las cartas
    })
  })

  // Initialize game
  restartGame()
})
