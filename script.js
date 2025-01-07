// Grab a couple of things
const section = document.querySelector('section')
const playerLivesCount = document.querySelector('span')
let playerLives = 6

// Link text
playerLivesCount.textContent = playerLives

// Generate the data
const getData = () => [
  { imgSrc: './images/beatles.webp', name: 'The Beatles' },
  { imgSrc: './images/blink182.webp', name: 'blink 182' },
  { imgSrc: './images/fkatwigs.webp', name: 'fka twigs' },
  { imgSrc: './images/fleetwood.webp', name: 'fleetwood' },
  { imgSrc: './images/greenday.webp', name: 'green day' },
  { imgSrc: './images/kiss.webp', name: 'kiss' },
  { imgSrc: './images/metallica.webp', name: 'metallica' },
  { imgSrc: './images/pinkfloyd.webp', name: 'pink floyd' },
  { imgSrc: './images/beatles.webp', name: 'The Beatles' },
  { imgSrc: './images/blink182.webp', name: 'blink 182' },
  { imgSrc: './images/fkatwigs.webp', name: 'fka twigs' },
  { imgSrc: './images/fleetwood.webp', name: 'fleetwood' },
  { imgSrc: './images/greenday.webp', name: 'green day' },
  { imgSrc: './images/kiss.webp', name: 'kiss' },
  { imgSrc: './images/metallica.webp', name: 'metallica' },
  { imgSrc: './images/pinkfloyd.webp', name: 'pink floyd' },
]

// Randomize
const randomize = () => {
  const cardData = getData()
  cardData.sort(() => Math.random() - 0.5)
  return cardData
}

// Card generate function
const cardGenerator = () => {
  const cardData = randomize()
  // Generate the HTML
  cardData.forEach((item) => {
    const card = document.createElement('div')
    const face = document.createElement('img')
    const back = document.createElement('div')
    card.classList = 'card'
    face.classList = 'face'
    back.classList = 'back'
    // Attach the image to the card
    face.src = item.imgSrc
    card.setAttribute('name', item.name)
    // Attach the data to the section
    section.appendChild(card)
    card.appendChild(face)
    card.appendChild(back)

    card.addEventListener('click', (e) => {
      card.classList.toggle('toggleCard')
      checkCards(e)
    })
  })
}

// Check cards
const checkCards = (e) => {
  const clickedCard = e.target
  clickedCard.classList.add('flipped')
  const flippedCards = document.querySelectorAll('.flipped')
  const toggleCard = document.querySelectorAll('.toggleCard')
  // Logic the matches
  if (flippedCards.length === 2) {
    if (
      flippedCards[0].getAttribute('name') ===
      flippedCards[1].getAttribute('name')
    ) {
      // console.log('match')
      flippedCards.forEach((card) => {
        card.classList.remove('flipped')
        card.style.pointerEvents = 'none'
      })
    } else {
      // console.log('no match')
      flippedCards.forEach((card) => {
        card.classList.remove('flipped')
        setTimeout(() => card.classList.remove('toggleCard'), 1000)
      })
      playerLives--
      playerLivesCount.textContent = playerLives
      if (playerLives === 0) {
        restart('Try again!')
      }
    }
  }
  // Run a check to see if the game is won
  if (toggleCard.length === 16) {
    restart('You won!')
  }
}

// Restart
const restart = (text) => {
  let cardData = randomize()
  let faces = document.querySelectorAll('.face')
  let cards = document.querySelectorAll('.card')
  section.style.pointerEvents = 'none'
  cardData.forEach((item, index) => {
    cards[index].classList.remove('toggleCard')
    // Randomize the cards
    setTimeout(() => {
      cards[index].style.pointerEvents = 'all'
      faces[index].src = item.imgSrc
      cards[index].setAttribute('name', item.name)
      section.style.pointerEvents = 'all'
    }, 1000)
  })
  playerLives = 6
  playerLivesCount.textContent = playerLives
  setTimeout(() => window.alert(text), 1000)
}

cardGenerator()
