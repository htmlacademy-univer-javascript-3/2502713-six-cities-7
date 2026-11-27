import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './app';
import { offers } from './mocks/offers';
import { store } from './store';
import { loadOffers } from './store/action';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
store.dispatch(loadOffers(offers));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App isAuthorized />
    </Provider>
  </React.StrictMode>
);
