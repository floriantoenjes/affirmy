import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {AuthService} from '../shared/services/auth.service';
import {NavbarService} from '../shared/services/navbar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private authService: AuthService, private navbarService: NavbarService) { }

  ngOnInit(): void {
  }

  toggleNavbar(): void {
    this.navbarService.navbarToggled.next();
  }
}
