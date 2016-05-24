import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Connection from './connection.ts';
import Main from './main.tsx';
import SeqGenerator from './seq-generator.ts';

export default function render(target: HTMLDivElement, connection: Connection): void {
  const seqGen = SeqGenerator();
  home(connection, seqGen).then((homePath: string) => {
    ReactDOM.render(<Main home={homePath} connection={connection} seq={seqGen}/>, target);
  });
}

function home(connection: Connection, seqGen: IterableIterator<number>): Promise<string> {
  const seq = seqGen.next().value;
  const key = connection.key;

  return connection.send({seq, key, type: 'home'})
  .then((result: {home: string}): string => {
    return result.home;
  });
}
