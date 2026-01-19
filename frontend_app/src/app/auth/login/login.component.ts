import { Component, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
 loginData = {
    username: '',
    password: ''
  };

  loginError: string | null = null;
  constructor(private authService: AuthService, private router: Router, private dialog: MatDialog) {}

  onLogin() {
    console.log('Login data:', this.loginData);
    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        console.log('Login successful!', res);
         localStorage.setItem('token', res.access_token);
         localStorage.setItem('username', this.loginData.username);
         localStorage.setItem('firstName', res.firstName);
         localStorage.setItem('lastName', res.lastName);
         this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Login failed!', err);
        this.loginError = 'Invalid credentials. Please try again.';
      }
    });
  }
}

