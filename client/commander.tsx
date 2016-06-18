import * as React from 'react';
import AdvancedCommander from './advancedcommander.tsx';
import ICommandConfig from './icommandconfig.ts';
import ICommandOption from './icommandoption.ts';
import ISelected from './iselected.ts';
import NoviceCommander from './novicecommander.tsx';
import { Panel, PanelGroup, } from 'react-bootstrap';

interface IProps {
  configs: ICommandConfig[];
  selecteds: ISelected[];

  onCommand: (command: string, option: ICommandOption) => void;
}
interface IState {
  activeKey: number;
}

export default class Commander extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      activeKey: 1,
    };
  }

  public render(): JSX.Element {
    const handleSelect = (activeKey: number) => {
      this.setState({ activeKey });
    };

    const { selecteds, onCommand } = this.props;

    return <PanelGroup activeKey={this.state.activeKey} onSelect={handleSelect} accordion>
      <Panel header="Command" eventKey={1}>
        <NoviceCommander selecteds={selecteds} onCommand={onCommand}/>
      </Panel>
      <Panel header="Advanced" eventKey={2}>
        <AdvancedCommander selecteds={selecteds} onCommand={onCommand} configs={this.props.configs} />
      </Panel>
    </PanelGroup>;
  }
}
