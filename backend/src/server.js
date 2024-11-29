import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { config } from 'dotenv';

config();

const port = process.env.PORT || 8080;

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <body>
      <h1>WebSocket Iniciado</h1>
      <script>
        const ws = new WebSocket('ws://' + location.host);
        ws.onmessage = (event) => console.log('Mensagem recebida:', event.data);
        ws.onopen = () => console.log('Conexão estabelecida!');
        ws.onerror = (error) => console.error('Erro:', error);
      </script>
    </body>
    </html>
  `);
});

// WebSocket
const wss = new WebSocketServer({ server });

wss.on('connection', ws => {
  ws.on('error', console.error);

  ws.on('message', data => {
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === ws.OPEN) {
        client.send(data.toString());
      }
    });
  });

  console.log('Client connected');
});

server.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});
