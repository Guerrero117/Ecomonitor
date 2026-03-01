import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sensor-list',
  standalone: true,
  imports: [CommonModule], // Obligatorio para usar directivas como *ngIf y *ngFor en los sensores
  templateUrl: './sensor-list.html',
  styleUrl: './sensor-list.css'
})
export class SensorListComponent implements OnInit {

  // Ejemplo de estructura para tus sensores IoT
  sensors: any[] = [];

  constructor() {}

  ngOnInit(): void {
    // Aquí conectarás con tu servicio para obtener las lecturas de los sensores
    console.log('SensorListComponent inicializado: Listo para recibir datos de monitoreo.');
  }

}