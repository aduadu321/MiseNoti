import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  // Navigation methods
  goToLogin(): void {
    console.log('Navigating to login page...');
    this.router.navigate(['/login']);
  }

  goToRegister(): void {
    console.log('Navigating to register page...');
    this.router.navigate(['/register']);
  }

  goToProgramare(): void {
    console.log('Navigating to programare page...');
    this.router.navigate(['/programare']);
  }

  goToTeste(): void {
    console.log('Navigating to teste page...');
    this.router.navigate(['/teste']);
  }

  goToServicii(): void {
    console.log('Navigating to servicii page...');
    this.router.navigate(['/servicii']);
  }

  goToContact(): void {
    console.log('Navigating to contact page...');
    this.router.navigate(['/contact']);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
