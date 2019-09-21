import { Injectable } from '@angular/core';
import { NgZone } from '@angular/core';
import {environment} from './../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class GapiService {
  googleAuth: any;
  constructor(private zone: NgZone) { 
    console.log(gapi);
  }

  loadClient(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.zone.run(() => {
        gapi.load('client:auth2', {
          callback: resolve,
          onerror: reject,
          timeout: 5000, // 5 seconds.
          ontimeout: reject
        });
      });
    });
  }

  initClient(): Promise<any> {
    var API_KEY = environment.API_KEY// Your API key.
    // var DISCOVERY_DOC = // Your discovery doc URL.
    var CLIENT_ID = environment.clientId
    var SCOPES = environment.SCOPES
    var initObj = {
      'apiKey': API_KEY,
      'clientId': CLIENT_ID,
      'scope': SCOPES
      // 'discoveryDocs': [DISCOVERY_DOC],
    };

    return new Promise((resolve, reject) => {
      this.zone.run(() => {
        gapi.client.init(initObj).then((res) => {
          this.googleAuth = gapi.auth2.getAuthInstance();
          resolve({ googleAuth: this.googleAuth, res: res });
        })
          .catch((e) => {
            reject(e);
          });
      });
    });
  }
}