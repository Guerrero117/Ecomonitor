export interface Log {
  id?: string;        // En Angular usamos string para el ID de Mongo
  level: string;
  message: string;
  source: string;
  timestamp: Date;    // En lugar de DateTime usamos Date
}