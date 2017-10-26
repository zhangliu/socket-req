
const co = require('co')

const TIME_OUT = 2000

class SocketReq {
  constructor(socket) {
    this.socket = socket
  }

  sendReq(data, method, option) {
    return new Promise((resolve, reject) => {
      this.socket.write(data)
      const callback = resData => {
        if ((typeof method === 'function')) {
          co(function* run() {
            try {
              let checkResult = method(resData)
              if (typeof checkResult !== 'boolean') {
                checkResult = yield checkResult
              }
              if (!checkResult) return
              this.socket.removeListener('data', callback)
              resolve(resData)
            } catch (err) {
              reject(err)
            }
          }.bind(this))
        }
        setTimeout(() => {
          this.socket.removeListener('data', callback)
          reject('socket获取数据超时')
        }, TIME_OUT)
      }
      this.socket.on('data', callback)
    })
  }
}

module.exports = SocketReq
