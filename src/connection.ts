export default class Connection {
  private _socket: WebSocket;
  private _key: string;
  public onerror: (e: Event) => void;
  public onclose: (e: CloseEvent) => void;

  constructor(key: string, socket: WebSocket) {
    socket.onmessage = this.onMessage.bind(this);
    socket.onerror = this.onError.bind(this);
    socket.onclose = this.onClose.bind(this);
    this._socket = socket;
    this._key = key;
  }

  static open(key?: string): Promise<Connection> {
    return new Promise((resolve, reject) => {
      const socket = new WebSocket(`ws://${location.host}/c`);
      socket.onopen = (e) => {
        socket.onmessage = (e: MessageEvent) => {
          const { key } = JSON.parse(e.data);
          resolve(new Connection(key, socket));
        };
        socket.onclose = (e) => {
          reject(e);
        };
        socket.onerror = (e) => {
          reject(e);
        };
        socket.send(JSON.stringify(new_command(key)));
      };
    });
  }

  onMessage(e: MessageEvent): void {
  }

  onClose(e: CloseEvent): void {
    this.onclose(e);
  }
  onError(e: Event): void {
    this.onerror(e);
  }

  get key(): string {
    return this._key;
  }
}

function new_command(key?: string): Object {
  const type = 'new';
  const command = { type };
  if (key) {
    command['key'] = key;
  }
  return command;
}
