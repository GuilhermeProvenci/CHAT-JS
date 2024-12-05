export class WebSocketService {
  constructor(url) {
    this.socket = null
    this.url = url
  }

  connect() {
    this.socket = new WebSocket(this.url)
    return this.socket
  }

  send(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message))
    } else {
      console.error('WebSocket não está aberto.')
    }
  }
}