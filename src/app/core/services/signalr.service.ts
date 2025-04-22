import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  private apiUrl = environment.apiUrl;

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('/jobhub')
      .build();
  }

  connect(): Promise<signalR.HubConnection> {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5072/hubs/job', { withCredentials: true }) // API base URL
      .withAutomaticReconnect()
      .build();

    return this.hubConnection
    .start()
    .then(() => {
        console.log('SignalR connected');
        return this.hubConnection;
    })
    .catch(error => {
        console.error('Error connecting to SignalR', error);
        throw error;
    });
  }

  disconnect(): void{
    if(this.hubConnection){
        this.hubConnection.stop().catch(err => console.error('Error disconnecting from SignalR', err));
    }
  }
}