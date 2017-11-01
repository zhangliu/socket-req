
const TIME_OUT = 2000

class SocketReq {
  constructor(socket, receiver) {
    this.socket = socket
    this.receiver = receiver || socket
  }

  sendReq(sendData, eventName, option) {
    return new Promise((resolve, reject) => {
      this.socket.write(sendData)
      const callback = data => {
        resolve(data)
        this.receiver.removeListener(eventName, callback)
      }
      this.receiver.on(eventName, callback)
      setTimeout(() => {
        this.receiver.removeListener(eventName, callback)
        reject('socket获取数据超时')
      }, TIME_OUT)
    })
  }
}

module.exports = SocketReq
