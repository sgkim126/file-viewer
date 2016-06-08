import * as React from 'react';
import AdvancedCommander from './advancedcommander.tsx';
import ICommandOption from './icommandoption.ts';
import ISelected from './iselected.ts';
import { Panel, PanelGroup, } from 'react-bootstrap';

interface IProps {
  selecteds: ISelected[];

  openDir: (path: string, columnNumber: number) => void;
  onCommand: (command: string, option: ICommandOption) => void;
}
interface IState {
  activeKey: number;
}

export default class Commander extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      activeKey: 2,
    };
  }

  public render(): JSX.Element {
    const handleSelect = (activeKey: number) => {
      this.setState({ activeKey });
    };

    const { selecteds, openDir, onCommand } = this.props;

    return <PanelGroup activeKey={this.state.activeKey} onSelect={handleSelect} accordion>
      <Panel header="Advanced" eventKey="2">
        <AdvancedCommander openDir={openDir} selecteds={selecteds} onCommand={onCommand}/>
      </Panel>
    </PanelGroup>;
  }
}
