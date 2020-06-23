import path from 'path';
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
// import methodOverride from 'method-override';
import socket from 'socket.io';
import Binance from 'node-binance-api';

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;
const domain = isDevelopment ? 'http://localhost:8080' : '';
const port = process.env.PORT || 5000;

export default () => {
  const app = express();
  app.use(morgan(':method :url :status'));
  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, 'views'));
  app.use('/assets', express.static(path.join(__dirname, 'public')));

  app.use(bodyParser.urlencoded({ extended: false }));

  const binance = new Binance();
  const getPrices = () => binance.futuresPrices();
  // binance.futuresMiniTickerStream('BTCUSDT', console.log);

  app.get('/', (_req, res) => {
    getPrices().then((price) => {
      res.render('index', { price, domain });
      console.log(price);
    });
  });

  // app.post('/api', (req, res) => {
  // const {} = req.body;
  // });

  const server = app.listen(port, () => {
    console.log(`Server has been started on port http://localhost:${port}`);
  });

  const io = socket(server);
  io.on('connection', (client) => {
    console.log(`socket client connected with ID:${client.id}`);
    client.on('disconnect', () => {
      console.log(`client with ID:${client.id} disconnected`);
    });
  });

  // binance.futuresMiniTickerStream('BTCUSDT', (data) => io.emit('newData', data));
  binance.websockets.miniTicker((data) => io.emit('newData', data));
};
