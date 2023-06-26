const WebSocket = require('ws')

const syncSocket = new WebSocket.Server({ port: 7070 })

const clients = new Map()

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
console.log("wss up");

syncSocket.on('connection', ws => {
  const id = uuidv4()
  const color = Math.floor(Math.random() * 360)
  const metaData = { id, color }

  clients.set(ws, metaData)
  ws.on('message', messageAsString => {
    const message = JSON.parse(messageAsString)
    const metaData = clients.get(ws)
  
    message.sender = metaData.id
    message.color = metaData.color
  
    const outbound = JSON.stringify(message);
  
    [...clients.keys()].forEach(client => {
      client.send(outbound)
    })
  })

  ws.on('close', () => {
    clients.delete(ws)
  })
})

