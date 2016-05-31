import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Connection from './connection.ts';
import Main from './main.tsx';
import SeqGenerator from './seq-generator.ts';

export default function render(target: HTMLDivElement, connection: Connection, root: string): void {
  const seqGen = SeqGenerator();
  ReactDOM.render(<Main root={root} connection={connection} seq={seqGen}/>, target);
}
