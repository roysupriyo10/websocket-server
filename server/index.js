const WebSocket = require('ws')

const syncSocket = new WebSocket.Server({ port: 7070 })

const clients = new Map()

console.log("wss up");

syncSocket.on('connection', ws => {
  const id = Math.random()

  
  clients.set(ws, id)
  console.log(clients.keys())
  ws.on('message', data => {
    const message = JSON.parse(data)

    if (message.type === 'rangeUpdate') {
      console.log('rangeUpdate')
      console.log(message.data)
    }
    else if (message.type === 'lineUpdate') {
      console.log('lineUpdate')
    }

    console.log(message.syncClientId);
    // console.log(message)
    // const outbound = JSON.stringify(message);
  
    [...clients.keys()].forEach(client => {
      client.send(JSON.stringify(message))
    })
  })

  ws.on('close', () => {
    console.log('closed')
    clients.delete(ws)
  })
})

