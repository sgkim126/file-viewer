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
    fetch('./commands.json').then((res: any) => res.json())
    .then((config: any) => {
      render(main, connection, root, config);
    });
  });
})(window, window.document);
