const { Checkbox, ControlLabel, FormControl, FormGroup, HelpBlock, Radio } = require('react-bootstrap');
import { findDOMNode } from 'react-dom';
import * as Option from './icommandoption.ts';
import * as React from 'react';
import ICommandOption from './icommandoption.ts';
import ISelected from './iselected.ts';
import { Button, ButtonGroup, Modal } from 'react-bootstrap';

interface IProps {
  selecteds: ISelected[];

  openDir: (path: string, column: number) => void;
  onCommand: (command: string, option: ICommandOption) => void;
}

interface IState {
  menu?: {
    title: string,
    body: JSX.Element,
    onSubmit: (e: React.FormEvent) => void,
  };
}

export default class Commander extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      menu: undefined,
    };
  }

  public render(): JSX.Element {
    return <div className='commander'>
      <ButtonGroup>{this.buttons()}</ButtonGroup>
      {this.menu()}
    </div>;
  }

  private menu(): JSX.Element {
    const menu = this.state.menu;
    if (!menu) {
      return undefined;
    }
    const header = menu.title ? <Modal.Header closeButton><Modal.Title>{menu.title}</Modal.Title></Modal.Header> : undefined;
    const body = menu.body ? <Modal.Body>{menu.body}</Modal.Body> : undefined;
    const footer = menu.onSubmit ? <Modal.Footer><Button onClick={menu.onSubmit}>Run</Button></Modal.Footer> : undefined;
    return <Modal show={!!menu} onHide={() => this.setState({ menu: undefined })}>
      {header}
      {body}
      {footer}
      </Modal>;
  }

  private buttons(): JSX.Element[] {
    const buttons: JSX.Element[] = [];
    if (this.props.selecteds.length === 0) {
      buttons.push(<Button key='no-selected' disabled>No selected</Button>);
      return buttons;
    }

    if (!this.hasDir()) {
      buttons.push(this.catButton(this.props.selecteds));
      buttons.push(this.sortButton(this.props.selecteds));
    }

    if (this.props.selecteds.length === 1) {
      const selected = this.props.selecteds[0];
      if (selected.is_dir) {
        buttons.push(this.openButton(selected));
      } else {
        buttons.push(this.uniqButton(selected));
        buttons.push(this.headButton(selected));
        buttons.push(this.tailButton(selected));
      }
    }

    if (buttons.length === 0) {
      buttons.push(<Button key='no-available' disabled>No available command</Button>);
    }

    return buttons;
  }

  private openButton(selected: ISelected): JSX.Element {
    const onClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      this.props.openDir(selected.input.file, selected.column + 1);
    };
    return <Button key='open' onClick={onClick}>open</Button>;
  }

  private catButton(selecteds: ISelected[]): JSX.Element {
    const onClick = (e: React.MouseEvent) => {
      e.stopPropagation();

      let numberNonblankRef: HTMLInputElement;
      let showEndsRef: HTMLInputElement;
      let numberRef: HTMLInputElement;
      let squeezeBlankRef: HTMLInputElement;
      let showTabsRef: HTMLInputElement;
      let showNonprintingRef: HTMLInputElement;

      const title = 'cat';
      const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const inputs = selecteds.map((selected: ISelected) => selected.input);
        const option: Option.ICatOption = { inputs };

        if (numberNonblankRef.checked) {
          option.numberNonblank = true;
        }
        if (showEndsRef.checked) {
          option.showEnds = true;
        }
        if (numberRef.checked) {
          option.number = true;
        }
        if (showEndsRef.checked) {
          option.showEnds = true;
        }
        if (squeezeBlankRef.checked) {
          option.squeezeBlank = true;
        }
        if (showTabsRef.checked) {
          option.showTabs = true;
        }
        if (showNonprintingRef.checked) {
          option.showNonprinting = true;
        }

        this.props.onCommand('cat', option);
        this.setState({ menu: undefined });
      };

      const body = <form onSubmit={onSubmit}>
        <FormGroup>
          <Checkbox inputRef={(ref: HTMLInputElement) => { numberNonblankRef = ref; }}>number-nonblank</Checkbox>
          <HelpBlock>number nonempty output lines</HelpBlock>
        </FormGroup>
        <FormGroup>
          <Checkbox inputRef={(ref: HTMLInputElement) => { showEndsRef = ref; }}>show-ends</Checkbox>
          <HelpBlock>display $ at end of each line</HelpBlock>
        </FormGroup>
        <FormGroup>
          <Checkbox inputRef={(ref: HTMLInputElement) => { numberRef = ref; }}>number</Checkbox>
          <HelpBlock>number all output lines</HelpBlock>
        </FormGroup>
        <FormGroup>
          <Checkbox inputRef={(ref: HTMLInputElement) => { squeezeBlankRef = ref; }}>squeeze-blank</Checkbox>
          <HelpBlock>suppress repeated empty output lines</HelpBlock>
        </FormGroup>
        <FormGroup>
          <Checkbox inputRef={(ref: HTMLInputElement) => { showTabsRef = ref; }}>show-tabs</Checkbox>
          <HelpBlock>display TAB characters as ^I</HelpBlock>
        </FormGroup>
        <FormGroup>
          <Checkbox inputRef={(ref: HTMLInputElement) => { showNonprintingRef = ref; }}>show-nonprinting</Checkbox>
          <HelpBlock>use ^ and M- notation, except for LFD and TAB</HelpBlock>
        </FormGroup>
      </form>;

      this.setState({ menu: { title, body, onSubmit,  } });
    };
    return <Button key='cat' onClick={onClick}>cat</Button>;
  }

  private headButton(selected: ISelected): JSX.Element {
    const onClick = (e: React.MouseEvent) => {
      e.stopPropagation();

      let linesRef: HTMLInputElement;
      let bytesRef: HTMLInputElement;

      const title = 'head';
      const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const input = selected.input;

        const option: Option.IHeadOption = { input };
        const linesValue = (findDOMNode(linesRef) as HTMLInputElement).value;
        if (linesValue !== "") {
          option.lines = parseInt(linesValue, 10);
        }
        const bytesValue = (findDOMNode(bytesRef) as HTMLInputElement).value;
        if (bytesValue !== "") {
          option.bytes = parseInt(bytesValue, 10);
        }

        this.props.onCommand('head', option);
        this.setState({ menu: undefined });
      };

      const body = <form onSubmit={onSubmit}>
        <FormGroup>
          <ControlLabel>lines</ControlLabel>
          <FormControl ref={(ref: HTMLInputElement) => { linesRef = ref; }} type='number' placeholder='lines' />
          <HelpBlock>print the first K lines instead of the first 10; with the leading '-', print all but the last K lines of each file</HelpBlock>
        </FormGroup>
        <FormGroup>
          <ControlLabel>bytes</ControlLabel>
          <FormControl ref={(ref: HTMLInputElement) => { bytesRef = ref; }} type='number' placeholder='bytes' />
          <HelpBlock>print the first K bytes of each file; with the leading '-', print all but the last K bytes of each file</HelpBlock>
        </FormGroup>
      </form>;

      this.setState({ menu: { title, body, onSubmit,  } });
    };
    return <Button key='head' onClick={onClick}>head</Button>;
  }

  private tailButton(selected: ISelected): JSX.Element {
    const onClick = (e: React.MouseEvent) => {
      e.stopPropagation();

      let linesRef: HTMLInputElement;
      let bytesRef: HTMLInputElement;

      const title = 'tail';
      const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const input = selected.input;

        const option: Option.ITailOption = { input };
        const linesValue = (findDOMNode(linesRef) as HTMLInputElement).value;
        if (linesValue !== "") {
          option.lines = parseInt(linesValue, 10);
        }
        const bytesValue = (findDOMNode(bytesRef) as HTMLInputElement).value;
        if (bytesValue !== "") {
          option.bytes = parseInt(bytesValue, 10);
        }

        this.props.onCommand('tail', option);
        this.setState({ menu: undefined });
      };

      const body = <form onSubmit={onSubmit}>
        <FormGroup>
          <ControlLabel>lines</ControlLabel>
          <FormControl ref={(ref: HTMLInputElement) => { linesRef = ref; }} type='number' placeholder='lines' />
          <HelpBlock>output the last K lines, instead of the last 10; or use -n +K to output lines starting with the Kth</HelpBlock>
        </FormGroup>
        <FormGroup>
          <ControlLabel>bytes</ControlLabel>
          <FormControl ref={(ref: HTMLInputElement) => { bytesRef = ref; }} type='number' placeholder='bytes' />
          <HelpBlock>output the last K bytes; alternatively, use -c +K to output bytes starting with the Kth of each file</HelpBlock>
        </FormGroup>
      </form>;

      this.setState({ menu: { title, body, onSubmit,  } });
    };
    return <Button key='tail' onClick={onClick}>tail</Button>;
  }

  private uniqButton(selected: ISelected): JSX.Element {
    const onClick = (e: React.MouseEvent) => {
      e.stopPropagation();

      let allRepeatedNoneRef: HTMLInputElement;
      let allRepeatedPrependRef: HTMLInputElement;
      let allRepeatedSeperateRef: HTMLInputElement;
      let skipFieldsRef: HTMLInputElement;
      let skipCharsRef: HTMLInputElement;
      let checkCharsRef: HTMLInputElement;
      let countRef: HTMLInputElement;
      let repeatedRef: HTMLInputElement;
      let ignoreCaseRef: HTMLInputElement;
      let uniqueRef: HTMLInputElement;
      let zeroTerminatedRef: HTMLInputElement;

      const title = 'uniq';
      const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const input = selected.input;
        const option: Option.IUniqOption = { input };

        if (countRef.checked) {
          option.count = true;
        }
        if (repeatedRef.checked) {
          option.repeated = true;
        }
        if (ignoreCaseRef.checked) {
          option.ignoreCase = true;
        }
        if (uniqueRef.checked) {
          option.unique = true;
        }
        if (zeroTerminatedRef.checked) {
          option.zeroTerminated = true;
        }

        if ((findDOMNode(allRepeatedPrependRef) as any).checked) {
          option.allRepeated = 'prepend';
        } else if ((findDOMNode(allRepeatedSeperateRef) as any).checked) {
          option.allRepeated = 'seperate';
        }
        const skipFieldsRefValue = (findDOMNode(skipFieldsRef) as HTMLInputElement).value;
        if (skipFieldsRefValue !== "") {
          option.skipFields = parseInt(skipFieldsRefValue, 10);
        }
        const skipCharsRefValue = (findDOMNode(skipCharsRef) as HTMLInputElement).value;
        if (skipCharsRefValue !== "") {
          option.skipChars = parseInt(skipCharsRefValue, 10);
        }
        const checkCharsRefValue = (findDOMNode(checkCharsRef) as HTMLInputElement).value;
        if (checkCharsRefValue !== "") {
          option.checkChars = parseInt(checkCharsRefValue, 10);
        }

        this.props.onCommand('uniq', option);
        this.setState({ menu: undefined });
      };

      const checkAllRepeatedNone = () => {
        (findDOMNode(allRepeatedPrependRef) as any).checked = false;
        (findDOMNode(allRepeatedSeperateRef) as any).checked = false;
      };
      const checkAllRepeatedPrepend = () => {
        (findDOMNode(allRepeatedNoneRef) as any).checked = false;
        (findDOMNode(allRepeatedSeperateRef) as any).checked = false;
      };
      const checkAllRepeatedSeperate = () => {
        (findDOMNode(allRepeatedNoneRef) as any).checked = false;
        (findDOMNode(allRepeatedPrependRef) as any).checked = false;
      };
      const body = <form onSubmit={onSubmit}>
        <FormGroup>
          <ControlLabel>all repeated</ControlLabel>
          <Radio onChange={checkAllRepeatedNone} inline checked inputRef={(ref: HTMLInputElement) => { allRepeatedNoneRef = ref; }}>none</Radio>
          <Radio onChange={checkAllRepeatedPrepend} inline inputRef={(ref: HTMLInputElement) => { allRepeatedPrependRef = ref; }}>prepend</Radio>
          <Radio onChange={checkAllRepeatedSeperate} inline inputRef={(ref: HTMLInputElement) => { allRepeatedSeperateRef = ref; }}>seperate</Radio>
          <HelpBlock>{"print all duplicate lines delimit-method={none(default),prepend,separate\} Delimiting is done with blank lines"}</HelpBlock>
        </FormGroup>
        <FormGroup>
          <ControlLabel>skip fields</ControlLabel>
          <FormControl ref={(ref: HTMLInputElement) => { skipFieldsRef = ref; }} type='number' placeholder='skip fields' />
          <HelpBlock>avoid comparing the first N fields</HelpBlock>
        </FormGroup>
        <FormGroup>
          <ControlLabel>skip chars</ControlLabel>
          <FormControl ref={(ref: HTMLInputElement) => { skipCharsRef = ref; }} type='number' placeholder='skip chars' />
          <HelpBlock>avoid comparing the first N characters</HelpBlock>
        </FormGroup>
        <FormGroup>
          <ControlLabel>check chars</ControlLabel>
          <FormControl ref={(ref: HTMLInputElement) => { checkCharsRef = ref; }} type='number' placeholder='check chars' />
          <HelpBlock>compare no more than N characters in lines</HelpBlock>
        </FormGroup>
        <FormGroup>
          <Checkbox inputRef={(ref: HTMLInputElement) => { countRef = ref; }}>count</Checkbox>
          <HelpBlock>prefix lines by the number of occurrences</HelpBlock>
        </FormGroup>
        <FormGroup>
          <Checkbox inputRef={(ref: HTMLInputElement) => { repeatedRef = ref; }}>repeated</Checkbox>
          <HelpBlock>only print duplicate lines</HelpBlock>
        </FormGroup>
        <FormGroup>
          <Checkbox inputRef={(ref: HTMLInputElement) => { ignoreCaseRef = ref; }}>ignore case</Checkbox>
          <HelpBlock>ignore differences in case when comparing</HelpBlock>
        </FormGroup>
        <FormGroup>
          <Checkbox inputRef={(ref: HTMLInputElement) => { uniqueRef = ref; }}>unique</Checkbox>
          <HelpBlock>only print unique lines</HelpBlock>
        </FormGroup>
        <FormGroup>
          <Checkbox inputRef={(ref: HTMLInputElement) => { zeroTerminatedRef = ref; }}>zero terminated</Checkbox>
          <HelpBlock>end lines with 0 byte, not newline</HelpBlock>
        </FormGroup>
      </form>;

      this.setState({ menu: { title, body, onSubmit,  } });
    };
    return <Button key='uniq' onClick={onClick}>uniq</Button>;
  }

  private sortButton(selecteds: ISelected[]): JSX.Element {
    const onClick = (e: React.MouseEvent) => {
      e.stopPropagation();

      let ignoreLeadingBlanksRef: HTMLInputElement;
      let dictionaryOrderRef: HTMLInputElement;
      let ignoreCaseRef: HTMLInputElement;
      let generalNumericSortRef: HTMLInputElement;
      let ignoreNonprintingRef: HTMLInputElement;
      let monthSortRef: HTMLInputElement;
      let humanNumericSortRef: HTMLInputElement;
      let numericSortRef: HTMLInputElement;
      let randomSortRef: HTMLInputElement;
      let reverseRef: HTMLInputElement;
      let versionSortRef: HTMLInputElement;

      let checkRef: HTMLInputElement;
      let checkSilentRef: HTMLInputElement;
      let debugRef: HTMLInputElement;
      let key1Ref: HTMLInputElement;
      let key2Ref: HTMLInputElement;
      let key3Ref: HTMLInputElement;
      let key4Ref: HTMLInputElement;
      let key5Ref: HTMLInputElement;
      let key6Ref: HTMLInputElement;
      let key7Ref: HTMLInputElement;
      let key8Ref: HTMLInputElement;
      let key9Ref: HTMLInputElement;
      let key10Ref: HTMLInputElement;
      let mergeRef: HTMLInputElement;
      let stableRef: HTMLInputElement;
      let fieldSeperatorRef: HTMLInputElement;
      let uniqueRef: HTMLInputElement;
      let zeroTerminatedRef: HTMLInputElement;

      const title = 'sort';
      const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const inputs = selecteds.map((selected: ISelected) => selected.input);
        const option: Option.ISortOption = { inputs };

        if (ignoreLeadingBlanksRef.checked) {
          option.ignoreLeadingBlanks = true;
        }
        if (dictionaryOrderRef.checked) {
          option.dictionaryOrder = true;
        }
        if (ignoreCaseRef.checked) {
          option.ignoreCase = true;
        }
        if (generalNumericSortRef.checked) {
          option.generalNumericSort = true;
        }
        if (ignoreNonprintingRef.checked) {
          option.ignoreNonprinting = true;
        }
        if (monthSortRef.checked) {
          option.monthSort = true;
        }
        if (humanNumericSortRef.checked) {
          option.humanNumericSort = true;
        }
        if (numericSortRef.checked) {
          option.numericSort = true;
        }
        if (randomSortRef.checked) {
          option.randomSort = true;
        }
        if (reverseRef.checked) {
          option.reverse = true;
        }
        if (versionSortRef.checked) {
          option.versionSort = true;
        }

        if (checkRef.checked) {
          option.check = true;
        }
        if (checkSilentRef.checked) {
          option.checkSilent = true;
        }
        if (debugRef.checked) {
          option.debug = true;
        }
        if (mergeRef.checked) {
          option.merge = true;
        }
        if (stableRef.checked) {
          option.stable = true;
        }
        if (uniqueRef.checked) {
          option.unique = true;
        }
        if (zeroTerminatedRef.checked) {
          option.zeroTerminated = true;
        }

        const fieldSeperatorRefValue = (findDOMNode(fieldSeperatorRef) as HTMLInputElement).value;
        if (fieldSeperatorRefValue !== "") {
          option.fieldSeperator = fieldSeperatorRefValue;
        }

        const key: number[] = [];
        if (key1Ref.checked) {
          key.push(1);
        }
        if (key2Ref.checked) {
          key.push(2);
        }
        if (key3Ref.checked) {
          key.push(3);
        }
        if (key4Ref.checked) {
          key.push(4);
        }
        if (key5Ref.checked) {
          key.push(5);
        }
        if (key6Ref.checked) {
          key.push(6);
        }
        if (key7Ref.checked) {
          key.push(7);
        }
        if (key8Ref.checked) {
          key.push(8);
        }
        if (key9Ref.checked) {
          key.push(9);
        }
        if (key10Ref.checked) {
          key.push(10);
        }
        if (key.length !== 0) {
          option.key = key;
        }

        this.props.onCommand('sort', option);
        this.setState({ menu: undefined });
      };

      const body = <form onSubmit={onSubmit}>
        <FormGroup>
          <Checkbox inputRef={(ref: HTMLInputElement) => { ignoreLeadingBlanksRef = ref; }}>ignore leading blanks</Checkbox>
          <HelpBlock>ignore leading blanks</HelpBlock>
        </FormGroup>
        <FormGroup>
          <Checkbox inputRef={(ref: HTMLInputElement) => { ignoreNonprintingRef = ref; }}>ignore nonprinting</Checkbox>
          <HelpBlock>consider only printable characters</HelpBlock>
        </FormGroup>

        <FormGroup>
          <Checkbox inputRef={(ref: HTMLInputElement) => { ignoreCaseRef = ref; }}>ignore case</Checkbox>
          <HelpBlock>fold lower case to upper case characters</HelpBlock>
        </FormGroup>
        <FormGroup>
          <Checkbox inputRef={(ref: HTMLInputElement) => { reverseRef = ref; }}>reverse</Checkbox>
          <HelpBlock>reverse the result of comparisons</HelpBlock>
        </FormGroup>
        <FormGroup>
          <Checkbox inputRef={(ref: HTMLInputElement) => { dictionaryOrderRef = ref; }}>dictionary order</Checkbox>
          <HelpBlock>consider only blanks and alphanumeric characters</HelpBlock>
        </FormGroup>

        <FormGroup>
          <Checkbox inputRef={(ref: HTMLInputElement) => { generalNumericSortRef = ref; }}>general numeric sort</Checkbox>
          <HelpBlock>compare according to general numerical value</HelpBlock>
        </FormGroup>
        <FormGroup>
          <Checkbox inputRef={(ref: HTMLInputElement) => { humanNumericSortRef = ref; }}>human numeric sort</Checkbox>
          <HelpBlock>compare human readable numbers (e.g., 2K 1G)</HelpBlock>
        </FormGroup>
        <FormGroup>
          <Checkbox inputRef={(ref: HTMLInputElement) => { monthSortRef = ref; }}>month sort</Checkbox>
          <HelpBlock>{"compare (unknown) < 'JAN' < ... < 'DEC'"}</HelpBlock>
        </FormGroup>
        <FormGroup>
          <Checkbox inputRef={(ref: HTMLInputElement) => { numericSortRef = ref; }}>numeric sort</Checkbox>
          <HelpBlock>compare according to string numerical value</HelpBlock>
        </FormGroup>
        <FormGroup>
          <Checkbox inputRef={(ref: HTMLInputElement) => { randomSortRef = ref; }}>random sort</Checkbox>
          <HelpBlock>sort by random hash of keys</HelpBlock>
        </FormGroup>
        <FormGroup>
          <Checkbox inputRef={(ref: HTMLInputElement) => { versionSortRef = ref; }}>version sort</Checkbox>
          <HelpBlock>natural sort of (version) numbers within text</HelpBlock>
        </FormGroup>

        <FormGroup>
          <Checkbox inputRef={(ref: HTMLInputElement) => { checkRef = ref; }}>check</Checkbox>
          <HelpBlock>check for sorted input; do not sort</HelpBlock>
        </FormGroup>
        <FormGroup>
          <Checkbox inputRef={(ref: HTMLInputElement) => { checkSilentRef = ref; }}>check silent</Checkbox>
          <HelpBlock>like -c, but do not report first bad line</HelpBlock>
        </FormGroup>

        <FormGroup>
          <Checkbox inputRef={(ref: HTMLInputElement) => { debugRef = ref; }}>debug</Checkbox>
          <HelpBlock>annotate the part of the line used to sort, and warn about questionable usage to stderr</HelpBlock>
        </FormGroup>

        <FormGroup>
          <Checkbox inputRef={(ref: HTMLInputElement) => { mergeRef = ref; }}>merge</Checkbox>
          <HelpBlock>merge already sorted files; do not sort</HelpBlock>
        </FormGroup>
        <FormGroup>
          <Checkbox inputRef={(ref: HTMLInputElement) => { stableRef = ref; }}>stable</Checkbox>
          <HelpBlock>stabilize sort by disabling last-resort comparison</HelpBlock>
        </FormGroup>
        <FormGroup>
          <Checkbox inputRef={(ref: HTMLInputElement) => { uniqueRef = ref; }}>unique</Checkbox>
          <HelpBlock>with -c, check for strict ordering; without -c, output only the first of an equal run</HelpBlock>
        </FormGroup>
        <FormGroup>
          <Checkbox inputRef={(ref: HTMLInputElement) => { zeroTerminatedRef = ref; }}>zeroTerminated</Checkbox>
          <HelpBlock>end lines with 0 byte, not newline</HelpBlock>
        </FormGroup>

        <FormGroup>
          <ControlLabel>field seperator</ControlLabel>
          <FormControl ref={(ref: HTMLInputElement) => { fieldSeperatorRef = ref; }} type='text' placeholder='field seperator' />
          <HelpBlock>use SEP instead of non-blank to blank transition</HelpBlock>
        </FormGroup>

        <FormGroup>
          <ControlLabel>key</ControlLabel>
          <Checkbox inline inputRef={(ref: HTMLInputElement) => { key1Ref = ref; }}>1</Checkbox>
          <Checkbox inline inputRef={(ref: HTMLInputElement) => { key2Ref = ref; }}>2</Checkbox>
          <Checkbox inline inputRef={(ref: HTMLInputElement) => { key3Ref = ref; }}>3</Checkbox>
          <Checkbox inline inputRef={(ref: HTMLInputElement) => { key4Ref = ref; }}>4</Checkbox>
          <Checkbox inline inputRef={(ref: HTMLInputElement) => { key5Ref = ref; }}>5</Checkbox>
          <Checkbox inline inputRef={(ref: HTMLInputElement) => { key6Ref = ref; }}>6</Checkbox>
          <Checkbox inline inputRef={(ref: HTMLInputElement) => { key7Ref = ref; }}>7</Checkbox>
          <Checkbox inline inputRef={(ref: HTMLInputElement) => { key8Ref = ref; }}>8</Checkbox>
          <Checkbox inline inputRef={(ref: HTMLInputElement) => { key9Ref = ref; }}>9</Checkbox>
          <Checkbox inline inputRef={(ref: HTMLInputElement) => { key10Ref = ref; }}>10</Checkbox>
          <HelpBlock>sort via a key; KEYDEF gives location and type</HelpBlock>
        </FormGroup>
      </form>;

      this.setState({ menu: { title, body, onSubmit,  } });
    };
    return <Button key='sort' onClick={onClick}>sort</Button>;
  }

  private hasDir(): boolean {
    return !!this.props.selecteds.find((selected: ISelected) => selected.is_dir);
  }
}
