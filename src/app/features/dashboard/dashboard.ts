import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule], // Necesario para usar *ngIf, *ngFor, pipes, etc.
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
    // Aquí inicializarás los datos de tu monitor de IoT
    console.log('Dashboard inicializado');
  }

}
