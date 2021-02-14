import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {AuthService} from '../shared/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output()
  navOpened = new EventEmitter<boolean>();

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  openNav(): void {
    this.navOpened.next(true);
  }
}
