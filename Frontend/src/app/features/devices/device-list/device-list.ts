import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [CommonModule], // Vital para usar *ngFor y mostrar tus dispositivos
  templateUrl: './device-list.html',
  styleUrl: './device-list.css'
})
export class DeviceListComponent implements OnInit {
  
  // Aquí definirás tu array de dispositivos IoT más adelante
  devices: any[] = [];

  constructor() {}

  ngOnInit(): void {
    // Aquí cargarás la lista de tus sensores desde un servicio
    console.log('Lista de dispositivos cargada');
  }

}