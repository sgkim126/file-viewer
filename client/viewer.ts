import './viewer.styl';
import 'babel-polyfill';
import Connection from './connection.ts';
import render from './render.tsx';

((window: Window, document: Document): void => {
  const main: HTMLDivElement = document.getElementById('main') as HTMLDivElement;
  const USER_KEY = 'user-token';

  const connection = Connection.open(localStorage.getItem(USER_KEY));
  connection.then(([ connection, root ]: [ Connection, string ]) => {
    localStorage.setItem(USER_KEY, connection.token);
    window['connection'] = connection;
    render(main, connection, root);
  });
})(window, window.document);
