import render from './render.tsx';
import Connection from './connection.ts';
import './viewer.styl';

((window: Window, document: Document): void => {
  const main: HTMLDivElement = document.getElementById('main') as HTMLDivElement;
  const USER_KEY = 'user-key';

  const connection = Connection.open(localStorage.getItem(USER_KEY));
  connection.then((connection) => {
    localStorage.setItem(USER_KEY, connection.key);
    render(main, connection);
  });
})(window, window.document);
