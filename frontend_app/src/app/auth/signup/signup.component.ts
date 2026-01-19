import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  signupData = {
    username: '',
    password: '',
    firstName: '',
    lastName: '',
  };

  signupSuccess: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSignup() {
    this.authService.signup(this.signupData).subscribe({
      next: (res) => {
        console.log('Signup successful!', res);
        this.signupSuccess = 'Signup successful! Please log in to continue.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1800);
      },
      error: (err) => {
        console.error('Signup failed!', err);
      },
    });
  }
}
