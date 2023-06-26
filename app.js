const WebSocket = require('ws')

const ws = new WebSocket.Server({ port: 7070 })

const clients = new Map()

ws.on('connection', ws => {
  const id = uuidv4()
  const color = Math.floor(Math.random() * 360)
  const metaData = { id, color }

  clients.set(ws, metaData)
})