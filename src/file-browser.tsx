import * as React from 'react';

export default class FileBrowser extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <div className='file-browser'>
      File Browser
      </div>
    );
  }
}
