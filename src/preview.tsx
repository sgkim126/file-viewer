import * as React from 'react';

interface IProps {
  lines: string[];
}

export default class Preview extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <div className='preview'>{this.props.lines.join('<br />')}</div>
    );
  }
}
