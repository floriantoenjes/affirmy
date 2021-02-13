import { Component, OnInit } from '@angular/core';
import {AuthService} from '../shared/services/auth.service';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form = new FormGroup({
    email: new FormControl(),
    password: new FormControl()
  });

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  login(): void {
    const formValue = this.form.value;
    this.authService.login(formValue.email, formValue.password);
  }
}
