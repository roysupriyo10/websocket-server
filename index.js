(async () => {
  const connectToServer = async () => {
    const ws = new WebSocket(`ws://localhost:7070/ws`)
    return new Promise((resolve, reject) => {
      const timer = setInterval(() => {
        if (ws.readyState === 1) {
          clearInterval(timer)
          resolve(ws)
        }
      }, 10);
    })
  }

  const getOrCreateCursorFor = (messageBody) => {
    const sender = messageBody.sender
    const existing = document.querySelector(`[data-sender='${sender}']`)
    if (existing) {
      return existing
    }

    const template = document.getElementById('cursor')
    const cursor = template.content.firstElementChild.cloneNode(true);
    const svgPath = cursor.getElementsByTagName('path')[0];

    cursor.setAttribute("data-sender", sender);
    svgPath.setAttribute('fill', `hsl(${messageBody.color}, 50%, 50%)`);
    document.body.appendChild(cursor);

    return cursor;
  }
  const ws = await connectToServer()
  document.body.onmousemove = e => {
    const messageBody = { x: e.clientX, y: e.clientY }
    ws.send(JSON.stringify(messageBody))
  }

  ws.onmessage = e => {
    const messageBody = JSON.parse(e.data);
    const cursor = getOrCreateCursorFor(messageBody);
    cursor.style.transform = `translate(${messageBody.x}px, ${messageBody.y}px)`;
  }

})()