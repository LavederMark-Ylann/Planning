import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ContextMenuComponent} from 'ngx-contextmenu';

import {isSameDay, isSameMonth, } from 'date-fns';
import {Subscription} from 'rxjs';
import {
  CalendarDateFormatter,
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
  DAYS_OF_WEEK,
} from 'angular-calendar';
import {CustomDateFormatter} from './custom-date-formatter.provider';
import {CalendarService} from '../services/calendar.service';
import {CustomEvents} from '../modules/CustomEvents';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-calendrier',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendrier.component.html',
  styleUrls: ['./calendrier.component.css'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
})

export class CalendrierComponent implements OnInit, OnDestroy {

  @ViewChild('basicMenu') public basicMenu: ContextMenuComponent;
  @ViewChild('eventMenu') public eventMenu: ContextMenuComponent;

  eventsSub: Subscription;

  events: CustomEvents[];

  view: CalendarView = CalendarView.Week;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  locale = 'fr';

  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;

  weekendDays: number[] = [DAYS_OF_WEEK.SATURDAY, DAYS_OF_WEEK.SUNDAY];

  refresh = this.calendarService.ref;

  activeDayIsOpen = false;

  ngOnInit() {
    this.eventsSub = this.calendarService.eventsSubject.subscribe(
      (filteredEvents: any[]) => {
        this.events = filteredEvents;
      }
    );
  }

  constructor(private calendarService: CalendarService, private bar: MatSnackBar) {
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.activeDayIsOpen = !((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0);
      this.viewDate = date;
    }
  }

  eventTimesChanged({
                      event,
                      newStart,
                      newEnd,
                    }: CalendarEventTimesChangedEvent): void {
    this.calendarService.eventTimesChanged({ event, newStart, newEnd});
  }

  handleEvent(action: string, event): void {
    this.calendarService.handleEvent(action, event);
  }

  addEvent(): void {
    this.calendarService.addEvent();
  }

  addEventContext(date: Date): void {
    this.calendarService.addEventContext(date);
  }

  deleteEvent(eventToDelete) {
    if (!eventToDelete.event.draggable) {
      this.snackbar('Impossible de modifier un cours', 'bg-danger');
    }
    else {
      this.calendarService.deleteEvent(eventToDelete);
    }
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  snackbar(message: string, classe?: string) {
    this.bar.open(message, 'X', {
      panelClass: classe,
      duration: 1500,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  save() {
    this.calendarService.saveEvents();
    this.snackbar('Sauvegardé !', 'bg-success');
  }

  ngOnDestroy() {
    this.eventsSub.unsubscribe();
  }
}
