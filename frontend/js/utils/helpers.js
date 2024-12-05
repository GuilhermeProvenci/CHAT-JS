export const getRandomColor = (colors) => {
  const randomIndex = Math.floor(Math.random() * colors.length)
  return colors[randomIndex]
}

export const scrollScreen = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
  })
}

export const sanitizeHTML = html => {
  const div = document.createElement('div')
  div.innerText = html
  return div.innerHTML
}