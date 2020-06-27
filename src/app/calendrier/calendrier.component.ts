import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ContextMenuComponent} from 'ngx-contextmenu';

import {isSameDay, isSameMonth} from 'date-fns';
import {interval, Subscription} from 'rxjs';
import {
  CalendarDateFormatter,
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
  DAYS_OF_WEEK,
} from 'angular-calendar';
import {CustomDateFormatter} from './custom-date-formatter.provider';
import {CalendarService} from '../services/calendar.service';
import {CustomEvents} from '../misc/CustomEvents';

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

  autoSave: Subscription; // déclencheur de sauvegarde automatique

  visible: boolean;

  ngOnInit() {
    this.eventsSub = this.calendarService.eventsSubject.subscribe(
      (filteredEvents: any[]) => {
        this.events = filteredEvents;
      }
    );
    const source = interval(30000);
    this.autoSave = source.subscribe(() => {
      this.calendarService.saveEvents();
      this.visible = true;
      this.refresh.next();
      setTimeout(() => {
        this.visible = false;
        this.refresh.next();
      }, 2500);
    });
    // Sauvegarde toutes les 30 secondes
  }

  constructor(private calendarService: CalendarService) {
  }

  dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
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
    this.calendarService.eventTimesChanged({event, newStart, newEnd});
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
      this.calendarService.snackbar('Impossible de supprimer un cours', 'end', 'top', 'bg-danger');
    } else {
      this.calendarService.deleteEvent(eventToDelete);
    }
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  save() {
    this.calendarService.saveEvents();
  }

  ngOnDestroy() {
    this.eventsSub.unsubscribe();
  }
}
