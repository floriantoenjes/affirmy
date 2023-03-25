import { Component, OnInit } from '@angular/core';
import {AuthService} from '../shared/services/application/auth.service';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  showRegistration = false;

  form = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('')
  });

  get email(): string {
    return this.form.get('email')?.value;
  }

  get password(): string {
    return this.form.get('password')?.value;
  }

  get confirmPassword(): string {
    return this.form.get('confirmPassword')?.value;
  }

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.loggedInSubject$.subscribe(loggedIn => {
      if (loggedIn) {
        this.router.navigate(['/']).then();
      }
    });
  }

  login(): void {
    if (!this.form.valid) {
      return;
    }
    this.authService.login(this.email, this.password);
  }

  register(): void {
    if (!this.form.valid) {
      return;
    }

    if (this.password !== this.confirmPassword) {
      return;
    }
    this.authService.register(this.email, this.password);
  }

  switchMode(): void {
    const confirmPasswordControl = this.form.get('confirmPassword');

    if (!this.showRegistration) {
      confirmPasswordControl?.setValidators(Validators.required);
      this.form.setValidators(this.confirmPasswordValidator());
      confirmPasswordControl?.updateValueAndValidity();
      this.showRegistration = true;
    } else {
      confirmPasswordControl?.clearValidators();
      this.form.clearValidators();
      confirmPasswordControl?.updateValueAndValidity();
      this.showRegistration = false;
    }
  }

  confirmPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      if (this.password === this.confirmPassword) {
        return null;
      }
      return {passwordsDontMatch: true};
    };
  }
}
