import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  firstName = '';
  lastName = '';
  backendReady = false;
  backendLoading = false;

  constructor(private router: Router, private http: HttpClient) {
    this.loadUser();
  }

  ngOnInit(): void {
    this.pingBackend();
  }

  pingBackend() {
    this.backendLoading = true;
    this.http.get(environment.backendUrl).subscribe({
      next: () => {
        console.log('Backend is awake');
        this.backendReady = true;
        this.backendLoading = false;
      },
      error: () => {
        console.log('Backend not reachable yet, retrying in 5s...');
        setTimeout(() => this.pingBackend(), 5000); 
      }
    });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  loadUser() {
    if (this.isLoggedIn()) {
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
