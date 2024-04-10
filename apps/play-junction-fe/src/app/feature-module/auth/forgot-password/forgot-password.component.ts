import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/service/auth/authservice';
import { routes } from '../../../core/helpers/routes';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  public routes = routes;
  form = new FormGroup({
    email: new FormControl('', [
      Validators.email,
      Validators.required,
    ]),
  });

  get f() {
    return this.form.controls;
  }

  constructor(private router: Router, private auth: AuthService) {}
  forgotPassword() {
    if (this.form.valid) {
      this.auth.forgotpassword();
    }else{
      this.form.markAllAsTouched();
    }
  }
  direction() {
    if (this.form.valid) {
      this.router.navigate([routes.login]);
    }
  }
}
