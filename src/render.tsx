import * as React from 'react';
import * as ReactDOM from 'react-dom';

class SimpleDOM extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props);
  }

  public render(): JSX.Element {
    return <div>simple</div>;
  }
}

export default function render(target: HTMLDivElement): void {
  ReactDOM.render(<SimpleDOM />, target);
}
