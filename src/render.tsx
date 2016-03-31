import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Connection from './connection.ts';
import FileBrowser from './file-browser.tsx';
import History from './history.tsx';
import Preview from './preview.tsx';
import { Grid, Row, Col } from 'react-bootstrap';

interface IMainProps {
  connection: Connection;
}

class Main extends React.Component<IMainProps, {}> {
  constructor(props: IMainProps) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <Grid className='full-width full-height'>
      <Row className='full-width half-height'>
        <Col xs={12}>
          <FileBrowser />
        </Col>
      </Row>
      <Row className='full-width half-height'>
        <Col xs={8}>
          <Preview />
        </Col>
        <Col xs={4}>
          <History />
        </Col>
      </Row>
      </Grid>
    );
  }
}

export default function render(target: HTMLDivElement, connection: Connection): void {
  ReactDOM.render(<Main connection={connection}/>, target);
}
