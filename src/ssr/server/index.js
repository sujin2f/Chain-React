import express from 'express';
import compression from 'compression';
import path from 'path';

import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import Helmet from 'react-helmet';
import routes from 'src/components/routes';
import App from 'src/components/App';

// import Favicon from 'app/assets/images/favicon-32x32.png';

import configureStore, { initializeSession } from './store';

const app = express();

app.use(compression());
app.use(express.static(path.resolve(__dirname, '../../../', process.env.npm_package_config_paths_output)));

app.get('/*', (req, res) => {
  const context = {};
  const store = configureStore();

  store.dispatch(initializeSession());

  const dataRequirements =
    routes
      .filter(route => matchPath(req.url, route)) // filter matching paths
      .map(route => route.component) // map to components
      .filter(comp => comp.serverFetch) // check if components have data requirement
      .map(comp => store.dispatch(comp.serverFetch())); // dispatch data requirement

  Promise.all(dataRequirements).then(() => {
    const jsx = (
      <ReduxProvider store={store}>
        <StaticRouter context={context} location={req.url}>
          <App />
        </StaticRouter>
      </ReduxProvider>
    );
    const reactDom = renderToString(jsx);
    const reduxState = store.getState();
    const helmetData = Helmet.renderStatic();

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(htmlTemplate(reactDom, reduxState, helmetData));
  });
});
app.listen(8080);
console.log('Server listening on port 8080!');

function htmlTemplate(reactDom, reduxState, helmetData) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      ${helmetData.title.toString()}
      ${helmetData.meta.toString()}
      <title>React SSR</title>
    </head>

    <body>
      <div id="app">${reactDom}</div>
      <script>
        window.REDUX_DATA = ${JSON.stringify(reduxState)}
      </script>
      <script src="./app.bundle.js"></script>
      <script src="./style.bundle.js"></script>
    </body>
    </html>
  `;
}
