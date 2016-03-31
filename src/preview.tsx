import * as React from 'react';

export default class Preview extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <div className='preview'>
     Preview
      </div>
    );
  }
}
