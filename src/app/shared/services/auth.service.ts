import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  login(): void {
    this.httpClient.post('https://192.168.2.106:5001/WeatherForecast/login',
      {
        email: 'alex@test.com',
        password: 'P@ssw0rd'
      },
      {
        observe: 'response',
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
      }).subscribe(res => {
        const body = res.body as any;
        const token = body.token;

        console.log(this.decodeJWT(token));

        this.router.navigate(['']);
    });
  }

  decodeJWT(token: string): object {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }
}
