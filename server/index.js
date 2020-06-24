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
  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, 'views'));
  app.use(morgan(':method :url :status'));
  app.use('/assets', express.static(path.join(__dirname, 'public')));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  const binance = new Binance();
  const getPrices = () => binance.futuresPrices();
  const getCurrenciesList = (prices) => Object.keys(prices).map((curr) => curr.replace('USDT', ''));
  const socketSubs = binance.websockets.subscriptions();

  const server = app.listen(port, () => {
    console.log(`Server has been started on http://localhost:${port}`);
  });

  const io = socket(server);
  io.on('connection', (client) => {
    console.log(`socket client connected with ID:${client.id}`);
    client.on('disconnect', () => {
      console.log(`client with ID:${client.id} disconnected`);
    });
  });

  app.get('/', (_req, res) => {
    getPrices().then((prices) => {
      const currencies = getCurrenciesList(prices);
      res.render('index', { currencies, domain });
    });
  });

  app.post('/currency', (req, res) => {
    const { currency } = req.body;
    console.log('currency', currency);
    const priceCode = `${currency}USDT`;
    binance.websockets.prevDay(priceCode, (_err, data) => {
      console.log('endpoints', Object.keys(socketSubs));
      io.emit('newData', data);
    });
    res.status('200').end();
  });

  app.delete('/currency', (req, res) => {
    const { currency } = req.body;
    console.log('currency', currency);
    const tickerCode = `${currency.toLowerCase()}usdt@ticker`;
    const websocketsResp = binance.websockets.terminate(tickerCode);
    console.log('websocketsResp', websocketsResp);
    res.status('200').end();
  });
};
