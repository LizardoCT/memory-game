document.addEventListener('DOMContentLoaded', () => {
  const ease = 'power4.inOut'

  revealTransition().then(() => {
    gsap.set('.block', { visibility: 'hidden' })
    gsap.set('.my-title', { display: 'none' })
  })

  function revealTransition() {
    return new Promise((resolve) => {
      // show title
      const title = document.querySelector('.my-title')
      gsap.to(title, {
        opacity: 1,
        duration: 1.2,
        onComplete: () => {
          // hide title and show blocks
          gsap.to(title, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
              gsap.set('.block', { scaleY: 1 })
              gsap.to('.block', {
                scaleY: 0,
                duration: 1,
                stagger: {
                  each: 0.1,
                  from: 'start',
                  grid: 'auto',
                  axis: 'x',
                },
                ease: ease,
                onComplete: resolve,
              })
            },
          })
        },
      })
    })
  }

  const images = [
    './images/miko.webp',
    './images/avicii.webp',
    './images/malone.webp',
    './images/ed.webp',
    './images/sting.webp',
    './images/usher.webp',
    './images/drake.webp',
    './images/weeknd.webp',
  ]

  let cards = []
  let flippedCards = []
  let lives = 6
  let isLocked = false

  function showGameOverMessage(message1, message2) {
    const messageElement1 = document.getElementById('game-message-1')
    const messageElement2 = document.getElementById('game-message-2')

    messageElement1.textContent = message1
    messageElement2.textContent = message2

    document.getElementById('game-over').classList.remove('hidden')
    document.getElementById('overlay').classList.remove('hidden')

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
    const currentLives = lives

    livesCountElement.classList.add('fade-out')

    setTimeout(() => {
      livesCountElement.textContent = currentLives.toString()

      livesCountElement.classList.remove('fade-out')
      livesCountElement.classList.add('fade-in')

      setTimeout(() => {
        livesCountElement.classList.remove('fade-in')
      }, 500)
    }, 500)

    if (currentLives < 6) {
      heart.classList.add('hidden')
      heartBroken.classList.remove('hidden')
      heartBroken.classList.add('animate')

      setTimeout(() => {
        heartBroken.classList.remove('animate')
        heartBroken.classList.add('hidden')
        heart.classList.remove('hidden')
      }, 1000)
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

    if (matchedCards.length === 0) {
      if (callback) callback()
      return
    }

    matchedCards.forEach((card) => {
      const cardElement = document.querySelector(`[data-index="${card.id}"]`)
      if (cardElement) {
        card.isFlipped = false
        flipCard(card.id, false)
      }
    })

    setTimeout(() => {
      if (callback) callback()
    }, 400)
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
      restartGame()
    })
  })

  document.getElementById('play-again').addEventListener('click', () => {
    resetMatchedCards(() => {
      restartGame()
    })
  })

  // Initialize game
  restartGame()
})
