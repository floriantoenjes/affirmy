import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../services/auth.service';
import {DateTime} from 'luxon';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const loggedIn = this.authService.isLoggedIn();
    let jwt = this.authService.getJwt() as any;
    if (jwt) {
      jwt = this.authService.decodeJwt(jwt);
      if (+jwt.exp < DateTime.local().toSeconds()) {
        this.authService.logout();
        return false;
      }
    }

    if (!loggedIn) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }

}
