// import Express from 'express';
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
// import methodOverride from 'method-override';

import Binance from 'node-binance-api';

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

export default () => {
  const domain = isDevelopment ? 'http://localhost:8080' : '';

  const app = express();
  app.use(morgan(':method :url :status'));
  app.set('view engine', 'pug');
  app.set('views', `${__dirname}/views`);
  // app.use(express.static(`${domain}/public`));

  // app.use(methodOverride('_method'));
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

  return app;
};
