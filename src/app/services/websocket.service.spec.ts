import { TestBed, getTestBed } from '@angular/core/testing';

import { WebsocketService } from './websocket.service';
import { SocketIO, Server } from 'mock-socket';

// tslint:disable:no-unused-expression

describe('WebsocketService', () => {
  let injector: TestBed;
  let service: WebsocketService;
  let mockServer: Server;
  (window as any).MockSocketIo = SocketIO;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WebsocketService,
      ],
    });
    injector = getTestBed();
    service = injector.get(WebsocketService);
    mockServer = new Server('http://localhost:6145');
  });
  afterEach(() => {
    mockServer.close();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.connected).toEqual(false);
    expect(service.socket).toBeUndefined;
  });
  it('Websocket connection fails with no token error callback', async () => {
    spyOn((window as any).MockSocketIo, 'connect').and.callFake(() => {
      return {
        on: (type, callback) => {
          if (type === 'error') {
            callback('No token provided');
          }
        }
      };
    });
    const connected = await service.connect().toPromise();
    expect(connected).toEqual(false);
    expect(service.connected).toEqual(false);
  });
  it('connects to websocket', async () => {
    const connected = await service.connect().toPromise();
    expect(connected).toEqual(true);
    expect(service.socket).toBeDefined();
    expect(service.connected).toEqual(true);
  });
  it('connect and then disconnect from websocket', async (done) => {
    const connected = await service.connect().toPromise();
    expect(connected).toEqual(true);
    expect(service.socket).toBeDefined();
    expect(service.connected).toEqual(true);
    mockServer.close();
    setTimeout(() => {
      expect(service.connected).toEqual(false);
      done();
    }, 20);
  });
});
