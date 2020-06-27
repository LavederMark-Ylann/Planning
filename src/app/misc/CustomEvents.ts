import { CalendarEvent } from 'angular-calendar';

export interface CustomEvents extends CalendarEvent {
  category?: string;
  identifiant: number;
}
