import { EventEmitter, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';

@Injectable()
export class SignalRService {
    messageReceived = new EventEmitter<any>();
    connectionEstablished = new EventEmitter<Boolean>();

    private connectionIsEstablished = false;
    private _hubConnection: HubConnection;

    public init(hubUrl: string): void {
        this.createConnection(hubUrl);
        this.registerOnServerEvents();
        this.startConnection();
    }

    protected createConnection(connection: string) {
        this._hubConnection = new HubConnectionBuilder()
            .withUrl(connection)
            .build();
    }

    protected startConnection(): any {
        this._hubConnection
            .start()
            .then(() => {
                this.connectionIsEstablished = true;
                console.log('Hub connection started');
                this.connectionEstablished.emit(true);
            })
            .catch(err => {
                console.log('Error while establishing connection, retrying...');
                setTimeout(this.startConnection(), 5000);
            });
    }

    protected registerOnServerEvents(): void {
        this._hubConnection.on('Receive', (message: any) => {
            this.messageReceived.emit(message);
        });
    }

    public invokeOnServerEvent(serverMethod: string, value: string): void {
        this._hubConnection.send(serverMethod, value);
    }

    public registerAdditionalEvent<T>(eventName: string, emitter: EventEmitter<T>): void {
        this._hubConnection.on(eventName, (message: T) => {
            emitter.emit(message);
        });
    }
}
