import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedInSubject$ = new Subject<boolean>();

  constructor(private httpClient: HttpClient) {
  }

  login(email: string, password: string): void {
    this.httpClient.post('https://192.168.2.106:5001/WeatherForecast/login',
      {
        email,
        password
      },
      {
        observe: 'response',
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
      }).subscribe(res => {
        const body = res.body as any;
        const token = body.token;

        this.setJwt(token);

        console.log(this.decodeJwt(token));

        this.loggedInSubject$.next(true);
    });
  }

  register(email: string, password: string): void {
    this.httpClient.post('https://192.168.2.106:5001/WeatherForecast/register',
      {
        email,
        password
      },
      {
        observe: 'response',
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
      }).subscribe(res => {
      const body = res.body as any;
      console.log('REGISTERED', res);
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.loggedInSubject$.next(false);
  }

  isLoggedIn(): boolean {
    return !!this.getJwt();
  }

  getJwt(): string | null {
    return localStorage.getItem('token');
  }

  setJwt(token: string): void {
    localStorage.setItem('token', token);
  }

  decodeJwt(token: string): object {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }
}
