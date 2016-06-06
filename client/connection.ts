import Message from './messages.ts';

export default class Connection {
  private _socket: WebSocket;
  private _token: string;

  private _resolvers: Map<number, (value: any) => void>;
  private _rejecters: Map<number, (reason: any) => void>;

  private _onerror: (e: Event) => void;
  private _onclose: (e: CloseEvent) => void;

  constructor(token: string, socket: WebSocket) {
    socket.onmessage = this.onMessage.bind(this);
    socket.onerror = this.onError.bind(this);
    socket.onclose = this.onClose.bind(this);
    this._socket = socket;
    this._token = token;
    this._resolvers = new Map();
    this._rejecters = new Map();
    this._onclose = (e) => e;
    this._onerror = (e) => e;
  }

  static open(token?: string): Promise<[Connection, string]> {
    return new Promise((resolve, reject) => {
      const socket = new WebSocket(`ws://${location.host}/c`);
      socket.onopen = (e) => {
        socket.onmessage = (e: MessageEvent) => {
          const { token, root } = JSON.parse(e.data);
          resolve([new Connection(token, socket), root]);
        };
        socket.onclose = (e) => {
          reject(e);
        };
        socket.onerror = (e) => {
          reject(e);
        };
        socket.send(JSON.stringify(new_command(token)));
      };
    });
  }

  send(command: Message): Promise<any> {
    const SEQ = command.seq;
    return new Promise((resolve, reject) => {
      this._resolvers.set(SEQ, resolve);
      this._rejecters.set(SEQ, reject);
      this._socket.send(JSON.stringify(command));
    });
  }

  private onMessage(e: MessageEvent): void {
    const data = JSON.parse(e.data);
    const SEQ = data.seq;
    const isError = data.error || data.errors;
    if (isError) {
      this._rejecters.get(SEQ)(data);
    } else {
      this._resolvers.get(SEQ)(data);
    }
    this._resolvers.delete(SEQ);
    this._rejecters.delete(SEQ);
  }

  private onClose(e: CloseEvent): void {
    this.clear(e);
    this._onclose(e);
  }
  private onError(e: Event): void {
    this.clear(e);
    this._onerror(e);
  }

  get token(): string {
    return this._token;
  }

  set onerror(onerror: (e: Event) => any) {
    this._onerror = onerror;
  }
  set onclose(onclose: (e: CloseEvent) => any) {
    this._onclose = onclose;
  }

  private clear(e: Event): void {
    for (const [_, rejecter] of this._rejecters) {
      rejecter(e);
    }
    this._resolvers.clear();
    this._rejecters.clear();
  }
}

function new_command(token?: string): Object {
  const type = 'new';
  const command = { type };
  if (token) {
    command['token'] = token;
  }
  return command;
}
