import Express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
// import methodOverride from 'method-override';

import Binance from 'node-binance-api';

export default () => {
  const app = new Express();
  app.use(morgan(':method :url :status'));
  app.set('view engine', 'pug');
  app.set('views', `${__dirname}/views`);
  app.use(Express.static(`${__dirname}/public`));

  // app.use(methodOverride('_method'));
  app.use(bodyParser.urlencoded({ extended: false }));

  const binance = new Binance();
  const getPrices = () => binance.futuresPrices();
  // binance.futuresMiniTickerStream('BTCUSDT', console.log);

  app.get('/', (_req, res) => {
    getPrices().then((price) => {
      res.render('index', { price });
      console.log(price);
    });
  });

  // app.post('/api', (req, res) => {
  // const {} = req.body;
  // });

  return app;
};
