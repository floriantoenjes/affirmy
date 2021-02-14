import { Component, OnInit } from '@angular/core';
import {AuthService} from '../shared/services/auth.service';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  showRegistration = false;

  form = new FormGroup({
    email: new FormControl(),
    password: new FormControl(),
    confirmPassword: new FormControl()
  });

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  login(): void {
    const formValue = this.form.value;
    this.authService.login(formValue.email, formValue.password);
  }

  register(): void {
    const formValue = this.form.value;
    if (formValue.password !== formValue.confirmPassword) {
      return;
    }
    // this.authService.register(formValue.email, formValue.password);
  }
}
