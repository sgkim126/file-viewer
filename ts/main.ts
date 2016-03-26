import render from './render.tsx';

((document: Document): void => {
  const main: HTMLDivElement = document.getElementById('main') as HTMLDivElement;
  render(main);
})(window.document);
