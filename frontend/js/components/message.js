export const createMessageSelfElement = content => {
  const div = document.createElement('div')
  div.classList.add('message__self')
  div.innerHTML = content
  return div
}

export const createMessageOtherElement = (content, sender, senderColor) => {
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