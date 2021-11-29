import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './index.css';
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'primereact/resources/themes/mdc-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';


ReactDOM.render(
  <>
    <App />
  </>,
  document.getElementById('root')
);