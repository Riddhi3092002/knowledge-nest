import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  firstName = '';
  lastName = '';

  constructor(private router: Router) {
    this.loadUser();
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  loadUser() {
    if(this.isLoggedIn()) {
      this.firstName = localStorage.getItem('firstName') || '';
      this.lastName = localStorage.getItem('lastName') || '';
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  goToProfile() {
    // this.router.navigate(['/profile']);
  }

  user() {
    console.log('User logged in:', this.isLoggedIn());
  }
}