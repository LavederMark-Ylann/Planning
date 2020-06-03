import { CalendarEvent } from 'angular-calendar';

export interface CustomEvents extends CalendarEvent {
  colorEvent?: string;
  category?: string;
  identifiant: number;
}
