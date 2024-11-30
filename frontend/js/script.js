const LOGIN_DISPLAY_CLASS = 'login'
const CHAT_DISPLAY_CLASS = 'chat'
// const WebSocket_URL = "wss://chat-frontend-d9v7.onrender.com";
const WebSocket_URL = 'ws://localhost:8080'

const login = document.querySelector(`.${LOGIN_DISPLAY_CLASS}`)
const chat = document.querySelector(`.${CHAT_DISPLAY_CLASS}`)
const loginForm = login.querySelector('.login__form')
const loginInput = login.querySelector('.login__input')
const chatForm = chat.querySelector('.chat__form')
const chatInput = chat.querySelector('.chat__input')
const chatMessages = chat.querySelector('.chat__messages')
const imageInput = document.getElementById('imageInput')

const colors = [
  'cadetblue',
  'darkgoldenrod',
  'cornflowerblue',
  'darkkhaki',
  'hotpink',
  'gold'
]

const user = { id: '', name: '', color: '' }
let websocket

const createMessageSelfElement = content => {
  const div = document.createElement('div')
  div.classList.add('message__self')
  div.innerHTML = content
  return div
}

const createMessageOtherElement = (content, sender, senderColor) => {
  const div = document.createElement('div')
  const span = document.createElement('span')

  div.classList.add('message__other')
  span.classList.add('message__sender')
  span.style.color = senderColor

  div.appendChild(span)
  span.innerHTML = sender
  div.innerHTML += content

  return div
}

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length)
  return colors[randomIndex]
}

const scrollScreen = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
  })
}

const sanitizeHTML = html => {
  const div = document.createElement('div')
  div.innerText = html
  return div.innerHTML
}

const processMessage = ({ data }) => {
  const { userId, userName, userColor, content, image } = JSON.parse(data)

  const sanitizedContent = sanitizeHTML(content)

  const message =
    userId === user.id
      ? createMessageSelfElement(sanitizedContent)
      : createMessageOtherElement(sanitizedContent, userName, userColor)

  if (image) {
    console.log('Recebendo imagem:', image)
    const imageElement = document.createElement('img')
    imageElement.src = image
    imageElement.alt = 'Imagem enviada'
    imageElement.classList.add('message__image')
    message.appendChild(imageElement)
  }

  chatMessages.appendChild(message)
  scrollScreen()
}

const handleLogin = event => {
  event.preventDefault()

  user.id = crypto.randomUUID()
  user.name = loginInput.value
  user.color = getRandomColor()

  login.style.display = 'none'
  chat.style.display = 'flex'

  websocket = new WebSocket(WebSocket_URL)
  websocket.onmessage = processMessage
  console.log('Logged in')
}

const sendMessage = event => {
  event.preventDefault()

  const messageContent = chatInput.value.trim()

  if (messageContent || imageInput.files.length > 0) {
    const message = {
      userId: user.id,
      userName: user.name,
      userColor: user.color,
      content: messageContent,
      image: null
    }

    // Exibe a mensagem localmente antes de enviar
    const messageElement = createMessageSelfElement(
      sanitizeHTML(message.content)
    )
    chatMessages.appendChild(messageElement)
    scrollScreen()

    if (imageInput.files.length > 0) {
      const file = imageInput.files[0]
      const reader = new FileReader()

      reader.onload = function (event) {
        message.image = event.target.result

        const imageElement = document.createElement('img')
        imageElement.src = message.image
        imageElement.alt = 'Imagem enviada'
        imageElement.classList.add('message__image')
        messageElement.appendChild(imageElement)

        if (websocket.readyState === WebSocket.OPEN) {
          websocket.send(JSON.stringify(message))
        } else {
          console.error('WebSocket não está aberto.')
        }

        chatInput.value = ''
        imageInput.value = ''
      }

      reader.readAsDataURL(file)
    } else {
      if (websocket.readyState === WebSocket.OPEN) {
        websocket.send(JSON.stringify(message))
      } else {
        console.error('WebSocket não está aberto.')
      }

      chatInput.value = ''
    }
  }
}

const chatImageInput = document.getElementById('imageInput')

chatInput.addEventListener('paste', function (event) {
  if (event.clipboardData && event.clipboardData.items) {
    for (let i = 0; i < event.clipboardData.items.length; i++) {
      const item = event.clipboardData.items[i]

      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile()

        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)
        imageInput.files = dataTransfer.files

        const reader = new FileReader()
        reader.onload = function (event) {
          const imageData = event.target.result
        }
        reader.readAsDataURL(file)

        break
      }
    }
  }
})

loginForm.addEventListener('submit', handleLogin)
chatForm.addEventListener('submit', sendMessage)
