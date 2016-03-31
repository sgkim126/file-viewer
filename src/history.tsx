import * as React from 'react';

export default class History extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <div className='history'>
      History
      </div>
    );
  }
}
