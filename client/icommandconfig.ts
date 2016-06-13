import ICommandFlag from './icommandflag.ts';

interface ICommandConfig {
  name: string;
  desc: string;

  flags: ICommandFlag[];

  input: string;
}

export default ICommandConfig;
