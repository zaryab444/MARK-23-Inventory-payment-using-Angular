import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export enum Environment {
  Prod = 'prod',
  Staging = 'staging',
  Test = 'test',
  Dev = 'dev',
  Local = 'local',
}
@Injectable({
  providedIn: 'root'
})
export class AppService {
  public hostname = window && window.location && window.location.hostname;
  private _env: Environment;
  private _apiUrl: string;

  get env(): Environment {
    return this._env;
  }

  get apiUrl(): string {
    return this._apiUrl;
  }
  constructor(private readonly _http: HttpClient) { 
    console.log('host', this.hostname)
  }


  init(): Promise<void> {
    console.log('host', this.hostname)
    return new Promise(resolve => {
      // this.getPlgSettings();
      // this.setEnvVariables();
      resolve();
    });
  }

  private setEnvVariables(): void {
    const hostname = window && window.location && window.location.hostname;

    if (/^.*localhost.*/.test(hostname)) {
      this._env = Environment.Local;
      this._apiUrl = '/api';
    } else if (/^dev-app.mokkapps.de/.test(hostname)) {
      this._env = Environment.Dev;
      this._apiUrl = 'https://dev-app.mokkapps.de/api';
    } else if (/^test-app.mokkapps.de/.test(hostname)) {
      this._env = Environment.Test;
      this._apiUrl = 'https://test-app.mokkapps.de/api';
    } else if (/^staging-app.mokkapps.de/.test(hostname)) {
      this._env = Environment.Staging;
      this._apiUrl = 'https://staging-app.mokkapps.de/api';
    } else if (/^prod-app.mokkapps.de/.test(hostname)) {
      this._env = Environment.Prod;
      this._apiUrl = 'https://prod-app.mokkapps.de.de/api';
    } else {
      console.warn(`Cannot find environment for host name ${hostname}`);
    }
  }
}
