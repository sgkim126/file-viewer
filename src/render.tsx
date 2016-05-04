import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Connection from './connection.ts';
import FileBrowser from './file-browser.tsx';
import Preview from './preview.tsx';
import SeqGenerator from './seq-generator.ts';
import { Grid, Row, Col } from 'react-bootstrap';

interface IMainProps {
  connection: Connection;
  seq: IterableIterator<number>;
}

interface IState {
  lines: string[];
}

class Main extends React.Component<IMainProps, IState> {
  constructor(props: IMainProps) {
    super(props);

    this.state = { lines: [] };
  }

  public render(): JSX.Element {
    return (
      <Grid className='full-width full-height'>
      <Row className='full-width half-height'>
        <Col xs={12}>
          <FileBrowser connection={this.props.connection} seq={this.props.seq} onClick={(e: React.MouseEvent, path: string, isFile: boolean) => {
            if (!isFile) {
              return;
            }
            const seq = this.props.seq.next().value;
            const key = this.props.connection.key;
            const catResult = this.props.connection.send({
              seq,
              key,
              type: 'cat',
              path: path,
            });
            catResult.then((result: { lines: string[] }) => {
              this.setState({ lines: result.lines });
            });
          }}/>
        </Col>
      </Row>
      <Row className='full-width half-height'>
        <Col xs={12}>
          <Preview lines={this.state.lines} />
        </Col>
      </Row>
      </Grid>
    );
  }
}

export default function render(target: HTMLDivElement, connection: Connection): void {
  ReactDOM.render(<Main connection={connection} seq={SeqGenerator()}/>, target);
}
