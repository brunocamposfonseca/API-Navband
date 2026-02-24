require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mongoose = require('mongoose');
const net = require('net');
const aedes = require('aedes')();
const routes = require('./routes');
const ControllerAPI = require('./controllers/ControllerAPI');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

// =====================================================
// 🔹 Servidor HTTP + WebSocket
// =====================================================
const server = http.createServer(app);

// WebSocket comum para comunicação com o front-end
const wss = new WebSocket.Server({ server, path: '/wss' });

wss.on('connection', (ws) => {
  console.log('🟢 Cliente WebSocket conectado');
  ws.send('Bem-vindo via WebSocket!');

  ws.on('message', (msg) => {
    console.log('💬 Mensagem WS recebida:', msg.toString());

    try {
      const externalData = JSON.parse(msg.toString());
      
      const internalPayload = JSON.parse(externalData.payload);

      const fullPacket = { 
          topic: externalData.topic, 
          ...internalPayload
      };

      const controller = new ControllerAPI(fullPacket); 

      switch (fullPacket.topic) {
        case 'pulseira/request':
          controller.getPulseira().then((response) => {
            ws.send(JSON.stringify({ topic: 'pulseira/response', data: response }));
          }).catch((error) => {
            console.error('Erro no ControllerAPI WS:', error);
          });
          break;

        case 'acesso/request':
          controller.verificaExisteAcesso().then((response) => {
            console.log(JSON.stringify({topic: 'acesso/response', data: response }));
            ws.send(JSON.stringify({ topic: 'acesso/response', data: response }));
          }).catch((error) => {
            console.error('Erro no ControllerAPI WS:', error);
          });
          break;

        case 'coordenadas/request':
          controller.getAcesso().then((response) => {
            console.log(JSON.stringify({topic: 'coordenadas/response', data: response }));
            ws.send(JSON.stringify({ topic: 'coordenadas/response', data: response }));
          }).catch((error) => {
            console.error('Erro no ControllerAPI WS:', error);
          });
          break;

        case 'acesso/update':
          controller.updateAcesso().then((response) => {
            ws.send(JSON.stringify({ topic: 'acesso/update/response', data: response }));
          }).catch((error) => {
            console.error('Erro no ControllerAPI WS:', error);
          });
          break;

        case 'login/request':
          console.log("Acionou Login - Websocket")
          console.log("Payload Login WS:", fullPacket);
          controller.loginUser().then((response) => {
            ws.send(JSON.stringify({ topic: 'login/response', data: response }));
          }).catch((error) => {
            console.error('Erro no ControllerAPI WS:', error);
          });
          break;

        case 'resetpassword/request':
          controller.updatePasswordResponsavel().then((response) => {
            ws.send(JSON.stringify({ topic: 'resetpassword/response', data: response }));
          }).catch((error) => {
            console.error('Erro no ControllerAPI WS:', error);
          });
          break;

        default:
          ws.send(JSON.stringify({ topic: 'error', message: 'Tópico desconhecido.' }));
          break;
      }
    } catch (err) {
      console.error('Erro ao processar mensagem WS (JSON inválido):', err);
      ws.send(JSON.stringify({ topic: 'error', message: 'Formato de mensagem inválido.' }));
    }
  });
});

// =====================================================
// 🔹 MQTT Broker (TCP)
// =====================================================
const mqttServer = net.createServer(aedes.handle);


mqttServer.listen(1883, () => {
  console.log('📡 MQTT Broker rodando em mqtt://localhost:1883');
});

// --- Logs de eventos MQTT ---
aedes.on('client', (client) => {
  console.log(`🟩 Cliente MQTT conectado: ${client?.id}`);
});

aedes.on('clientDisconnect', (client) => {
  console.log(`🟥 Cliente MQTT desconectado: ${client?.id}`);
});

aedes.on('publish', (packet, client) => {
  if (!client) return;

  const controller = new ControllerAPI(packet.payload ? JSON.parse(packet.payload.toString()) : { topic: packet.topic });

  switch (packet.topic) {

    case 'pulseira/request':
      controller.getPulseira().then(response => {
        aedes.publish({
          topic: 'pulseira/response',
          payload: JSON.stringify(response)
        });
      });
      break;
      case 'acesso/update':
      controller.updateAcesso().then(response => {
        aedes.publish({
          topic: 'acesso/update/response',
          payload: JSON.stringify(response)
        });
      });
      break;

    default:
      console.log(`⚠ Tópico MQTT desconhecido: ${packet.topic}`);
      break;
  }
  
});


// =====================================================
// 🔹 MongoDB + Inicialização do servidor HTTP
// =====================================================

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('<==== 🧩 MONGOOSE CONECTADO COM SUCESSO! ====>');

    server.listen(3000, () => {
      console.log('<==== 🚀 Servidor Disponível ✅ ====>');
      console.log('<-| HTTP em http://localhost:3000 |->');
      console.log('<-| WS em ws://localhost:3000/wss |->');
      console.log('<-| MQTT em mqtt://localhost:1883 |->');
    });
  })
  .catch((err) => {
    console.error('Erro ao conectar no MongoDB:', err);
  });
