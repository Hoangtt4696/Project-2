import _forEach from 'lodash/forEach';
import Express from 'express';
import compression from 'compression';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import session from 'express-session';
import morgan from 'morgan';
import connectMongo from 'connect-mongo';
import path from 'path';
import IntlWrapper from '../client/modules/Intl/IntlWrapper';
import envConfig from '../config/config';

// Webpack Requirements
import webpack from 'webpack';
import config from '../webpack.config.dev';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

const MongoStore = connectMongo(session);
const appConfig = envConfig.haravanApp;

// Initialize the Express App
const app = new Express();

// Set Development modes checks
const isDevMode = envConfig.NODE_ENV === 'development' || false;
const isProdMode = envConfig.NODE_ENV === 'production' || false;

// Run Webpack dev server in development mode
if (isDevMode) {
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}

// React And Redux Setup
import { configureStore } from '../client/store';
import { Provider } from 'react-redux';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import Helmet from 'react-helmet';

// Import required modules
import routes from '../client/routes';
import { fetchComponentData } from './util/fetchData';
import couponRoutes from './routes/coupon.routes';
import customerCouponRoutes from './routes/customer-coupon.routes';
import indexRoutes from './routes/index.routes';
import webhookRoutes from './routes/webhook.routes';
import settingRoutes from './routes/setting.routes';
import shopRoutes from './routes/shop.routes';
import downloadRoutes from './routes/download.routes';
import { haravanApi } from './middlewares/haravan.middleware';
import log from './util/loggerUtil';
import rabbitmq from './util/rabbitmqUtil';
import { start as startConsumer } from './rabittConsumers/helpers/consumer.helper';
import { start as startCron } from './crons/helpers/cron.helper';

// Set native promises as mongoose promise
mongoose.Promise = global.Promise;

// MongoDB Connection
mongoose.connect(
  envConfig.mongoURL,
  {
    server: {
      poolSize: envConfig.mongoPoolSize,
      socketOptions: { keepAlive: 1 },
      reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
      reconnectInterval: 1000,
    },
  }, (error) => {
    if (error) {
      console.error('Please make sure Mongodb is installed and running!'); // eslint-disable-line no-console
      log.error(error);
      throw error;
    }
  });

// Init RabbitMQ
(() => {
  rabbitmq.connect();

  const rabbitConfig = envConfig.rabbitmq;
  const rabbitQueues = rabbitConfig.queues;

  _forEach(rabbitQueues, queue => {
    if (rabbitConfig.active && queue.active) {
      rabbitmq.createPublisher(queue.queueName);
      rabbitmq.createPublisher(`${queue.queueName}_error`);
    }
  });
})();

// Apply body Parser and server public assets and routes
app.use(session({
  name: envConfig.session.name,
  secret: envConfig.session.secret,
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 3 * 24 * 60 * 60,
  }),
  cookie: {
    secure: false,
    maxAge: envConfig.session.exp * 60 * 1000,
  },
}));
app.use(compression());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
app.use(Express.static(path.resolve(__dirname, '../dist/client')));
app.use(morgan('tiny'));
app.use(Express.static(path.join(__dirname, 'public')));
// Routes init
((myApp) => {
  indexRoutes(myApp);
  webhookRoutes(myApp);
  settingRoutes(myApp);
  couponRoutes(myApp);
  customerCouponRoutes(myApp);
  shopRoutes(myApp);
  downloadRoutes(myApp);
})(app);

// Render Initial HTML
const renderFullPage = (html, initialState, data = {}) => {
  const head = Helmet.rewind();

  // Import Manifests
  const assetsManifest = process.env.webpackAssets && JSON.parse(process.env.webpackAssets);
  const chunkManifest = process.env.webpackChunkAssets && JSON.parse(process.env.webpackChunkAssets);

  const embedUrl = `${appConfig.protocol}${data.shop}/admin/app#/embed/${appConfig.apiKey}`;
  const domain = envConfig.hostname;

  const embedAuth = `
    <div id="authenticate" style="display:none;">${embedUrl}</div>
    <div id="embed" style="display:none;">${appConfig.embed}</div>
    <script>
      function isNoIframeOrIframeInMyHost() {
        var myresult = true;
        try {
          var tophref = top.location.href;
          var tophostname = top.location.hostname.toString();
          var myhref = location.href;
          if (tophref === myhref) {
            myresult = true;
          } else if (tophostname !== "${domain}") {
            //tophostname !== "www.yourdomain.com"
            myresult = false;
          }
        } catch (error) {
          myresult = false;
        }
        return myresult;
      }
    
      var embed = "${appConfig.embed}";
      if (isNoIframeOrIframeInMyHost()) {
        //web
        if (embed == "true") {
          var element = document.getElementById("authenticate");
          var url = element.innerText || element.textContent;
          window.location = url;
        }
      }
    </script>
  `;

  return `
    <!doctype html>
    <html>
      <head>
        ${head.base.toString()}
        ${head.title.toString()}
        ${head.meta.toString()}
        ${head.link.toString()}
        ${head.script.toString()}

        ${isProdMode ? `<link rel='stylesheet' href='${assetsManifest['/app.css']}' />` : ''}
        <link href='https://fonts.googleapis.com/css?family=Lato:400,300,700' rel='stylesheet' type='text/css'/>
        <link rel="shortcut icon" href="http://res.cloudinary.com/hashnode/image/upload/v1455629445/static_imgs/mern/mern-favicon-circle-fill.png" type="image/png" />
      </head>
      <body>
        <div id="root"><div>${html}</div></div>
        
        ${data.shop && appConfig.embed ? embedAuth : ''}
        
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
          ${isProdMode ?
          `//<![CDATA[
          window.webpackManifest = ${JSON.stringify(chunkManifest)};
          //]]>` : ''}
        </script>
        <script type="text/javascript">
          var apphost = '${appConfig.appHost}';
          var apikey = '${appConfig.apiKey}';
          var shopname = '${data.shop}';
          var timestamp = '${data.timestamp}';
          var signature = '${data.signature}';
          var code = '${data.code}';
        </script>
        <script src='${isProdMode ? assetsManifest['/vendor.js'] : '/vendor.js'}'></script>
        <script src='${isProdMode ? assetsManifest['/app.js'] : '/app.js'}'></script>
      </body>
    </html>
  `;
};

const renderError = err => {
  log.error(err);

  const softTab = '&#32;&#32;&#32;&#32;';
  const errTrace = isProdMode ?
    `:<br><br><pre style="color:red">${softTab}${err.stack.replace(/\n/g, `<br>${softTab}`)}</pre>` : '';
  return renderFullPage(`Server Error${errTrace}`, {});
};

// Server Side Rendering based on routes matched by React-router.
app.use(haravanApi, (req, res, next) => {
  match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
    if (err) {
      return res.status(500).end(renderError(err));
    }

    if (redirectLocation) {
      return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    }

    if (!renderProps) {
      return next();
    }

    const shop = req.session.shop || req.query.shop;
    const timestamp = req.query.timestamp || '';
    const signature = req.query.signature || '';
    const code = req.query.code || '';

    const store = configureStore();

    return fetchComponentData(store, renderProps.components, renderProps.params)
      .then(() => {
        const initialView = renderToString(
          <Provider store={store}>
            <IntlWrapper>
              <RouterContext {...renderProps} />
            </IntlWrapper>
          </Provider>
        );
        const finalState = store.getState();

        const data = {
          shop,
          timestamp,
          signature,
          code,
        };

        res
          .set('Content-Type', 'text/html')
          .status(200)
          .end(renderFullPage(initialView, finalState, data));
      })
      .catch((error) => next(error));
  });
});

// start app
app.listen(envConfig.port, (error) => {
  if (!error) {
    console.log(`MERN is running on port: ${envConfig.port}! Build something amazing!`); // eslint-disable-line

    startConsumer();
    startCron();
  }
});

export default app;
