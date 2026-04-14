export interface Medicion {
  temperatura: number;
  humedad: number;
  hayLluvia: boolean;
  gasDetectado: boolean;
  esOscuro: boolean;
  dispositivoId: string;
  fecha: Date;
}