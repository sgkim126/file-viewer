const { argv, stdout } = require('process');
import { readFileSync, writeFileSync } from 'fs';
import ICommandFlag from '../client/icommandflag.ts';

const PACKAGE = 'package main';

const IMPORTS = [ 'errors', 'fmt', 'encoding/json', 'strconv' ];

const commands = JSON.parse(readFileSync(argv[2], 'utf8'));

stdout.write(PACKAGE);
stdout.write('\n\n');
stdout.write(imports());
stdout.write('\n\n');
stdout.write(runCommandRequest(commands));
stdout.write('\n\n');
commands.forEach((command: any) => {
  const flags = command.flags.filter((flag: ICommandFlag) => flag.type !== 'not-implemented');
  stdout.write(optionStruct(command.name, flags, command.input));
  stdout.write('\n\n');
  stdout.write(requestStruct(command.name));
  stdout.write('\n\n');
  stdout.write(methods(command.name));
  stdout.write('\n\n');
  stdout.write(inputMethod(command.name, command.input));
  stdout.write('\n\n');
  stdout.write(handleMethod(command.name, command.input));
  stdout.write('\n\n');
  stdout.write(optionsMethod(command.name, flags));
  stdout.write('\n\n');
});
stdout.write("\n");

function runCommandRequest(commands: { name: string }[]): string {
  function caseStatement(name: string): string {
    return `
case "${name}":
    var request ${name}Request
    err := json.Unmarshal(data, &request)
    shouldNot(err)
    return request
    `;
  }

  const cases = commands.map(({ name }: { name: string}) => caseStatement(name)).join("\n");

  return `
  func runCommandRequest(data []byte, command string) Request {
  switch command {
  ${cases}
  default:
      panic(errors.New(fmt.Sprintf("\\"%s\\" is not implemented", command)))
  }
  }`;
}

function imports(): string {
  return "import (\n" + IMPORTS.map((pack: string) => `"${pack}"`).join("\n") + "\n)";
}

function optionsMethod(name: string, flags: ICommandFlag[]): string {
  function boolFlag(name: string, shortFlag: string, longFlag: string): string {
    const flag = shortFlag === '' ? `"--${longFlag}"` : `"-${shortFlag}"`;
    return `
    if option.${name} != nil && *option.${name} {
    options = append(options, ${flag})
    }`;
  }
  function intFlag(name: string, shortFlag: string, longFlag: string): string {
    const flag = shortFlag === '' ?
      `fmt.Sprintf("--${longFlag}=%d", *option.${name})` :
        `"-${shortFlag}", strconv.Itoa(*option.${name})`;
    return `
    if option.${name} != nil {
    options = append(options, ${flag})
    }`;
  }
  function stringFlag(name: string, shortFlag: string, longFlag: string): string {
    let flag: string;
    if (shortFlag !== '') {
      flag = `"-${shortFlag}", *option.${name}`;
    } else if (longFlag !== '') {
      flag = `fmt.Sprintf("--${longFlag}=%s", *option.${name})`;
    } else {
      flag = `*option.${name}`;
    }
    return `
    if option.${name} != nil {
    options = append(options, ${flag})
    }`;
  }
  function enumFlag(name: string, longFlag: string, flagType: string): string {
    const cases = flagType.split(',').map((name: string) => `case "${name}":`);
    return `
    if option.${name} != nil {
    ${name} := *option.${name}
    switch ${name} {
    ${cases.join('\n')}
default:
    panic(errors.New(fmt.Sprintf("\\"%s\\" is not a valid ${name}", ${name})))
    }
    options = append(options, fmt.Sprintf("--${longFlag}=%s", ${name}))
    }`;
  }
  function flag(flag: ICommandFlag): string {
    switch (flag.type) {
        case 'bool':
            return boolFlag(flag.name, flag.short, flag.long);
        case 'int':
            return intFlag(flag.name, flag.short, flag.long);
        case 'string':
            return stringFlag(flag.name, flag.short, flag.long);
    }
    return enumFlag(flag.name, flag.long, flag.type);
  }

  return `
  func (request ${name}Request) options() []string {
  options := []string{}
  option := request.Option

  ${flags.map(flag).join('\n')}

  return options;
  }`;
}

function requestStruct(name: string): string {
  return `type ${name}Request struct {
  Seq
  Option ${name}Option \`json:"option"\`
  }`;
}

function methods(name: string): string {
  return `func (request ${name}Request) Name() string {
  return "${name}"
  }

  func (request ${name}Request) token() token {
  return *request.Token
  }

  func (request ${name}Request) seq() Seq {
  return request.Seq
  }
  `;
}

function optionStruct(name: string, flags: ICommandFlag[], input: string): string {
  function getInputStructType(input: string) {
    switch (input) {
        case 'one':
            return 'Input CommandInput `json:"input"`';
        case 'two':
            return 'Input1 CommandInput `json:"input1"`\n' + 'Input2 CommandInput `json:"input2"`\n';
        default:
            break;
    }
    return 'Inputs []CommandInput `json:"inputs"`';
  }
  function getFlagType(type: string): string {
    switch (type) {
        case 'int':
        case 'string':
        case 'bool':
            return type;
        default:
            break;
    }
    return 'string';
  }
  const flagNames = flags.map((flag: ICommandFlag) => `${flag.name} *${getFlagType(flag.type)}`);
  return `type ${name}Option struct {
  ${flagNames.join("\n")}

  ${getInputStructType(input)}
  }`;
}

function handleMethod(name: string, input: string): string {
  function oneMethod(name: string): string {
    return `
    func (request ${name}Request) Handle(tg TokenGenerator, cm *ContextManager) Response {
    return RunCommandForOneInput(request, tg, cm)
    }
    `;
  }
  function twoMethod(name: string): string {
    return `
    func (request ${name}Request) Handle(tg TokenGenerator, cm *ContextManager) Response {
    return RunCommandForTwoInput(request, tg, cm)
    }
    `;
  }
  function multiMethod(name: string): string {
    return `
    func (request ${name}Request) Handle(tg TokenGenerator, cm *ContextManager) Response {
    return RunCommandForMultipleInput(request, tg, cm)
    }
    `;
  }

  switch (input) {
      case 'one':
          return oneMethod(name);
      case 'two':
          return twoMethod(name);
      default:
          break;
  }
  return multiMethod(name);
}
function inputMethod(name: string, input: string): string {
  function oneMethod(name: string): string {
    return `
    func (request ${name}Request) input() CommandInput {
    return request.Option.Input
    }
    `;
  }
  function twoMethod(name: string): string {
    return `
    func (request ${name}Request) input1() CommandInput {
    return request.Option.Input1
    }

    func (request ${name}Request) input2() CommandInput {
    return request.Option.Input2
    }
    `;
  }
  function multiMethod(name: string): string {
    return `
    func (request ${name}Request) inputs() []CommandInput {
    return request.Option.Inputs
    }
    `;
  }

  switch (input) {
      case 'one':
          return oneMethod(name);
      case 'two':
          return twoMethod(name);
      default:
          break;
  }
  return multiMethod(name);
}
