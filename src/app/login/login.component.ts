import { Component, OnInit } from '@angular/core';
import {AuthService} from '../shared/services/auth.service';
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

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.loggedInSubject$.subscribe(loggedIn => {
      if (loggedIn) {
        this.router.navigate(['/']);
      }
    });
  }

  login(): void {
    if (!this.form.valid) {
      return;
    }
    const formValue = this.form.value;
    this.authService.login(formValue.email, formValue.password);
  }

  register(): void {
    if (!this.form.valid) {
      return;
    }

    const formValue = this.form.value;
    if (formValue.password !== formValue.confirmPassword) {
      return;
    }
    this.authService.register(formValue.email, formValue.password);
  }

  switchMode(): void {
    if (!this.showRegistration) {
      this.form.get('confirmPassword')?.setValidators(Validators.required);
      this.form.setValidators(this.confirmPasswordValidator());
      this.form.get('confirmPassword')?.updateValueAndValidity();
      this.showRegistration = true;
    } else {
      this.form.get('confirmPassword')?.clearValidators();
      this.form.clearValidators();
      this.form.get('confirmPassword')?.updateValueAndValidity();
      this.showRegistration = false;
    }
  }

  confirmPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      if (this.form.get('password')?.value === this.form.get('confirmPassword')?.value) {
        return null;
      }
      return {passwordsDontMatch: true};
    };
  }
}
