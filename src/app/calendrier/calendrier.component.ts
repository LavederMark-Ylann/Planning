import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, } from '@angular/core';
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
  @ViewChild('dayEventMenu') public dayEventMenu: ContextMenuComponent;

  eventsSub: Subscription;

  events: any[];

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
      (events: any[]) => {
        this.events = events;
      }
    );
    this.calendarService.emitEventsSubject();
  }

  constructor(private calendarService: CalendarService) {
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
    this.calendarService.eventTimesChanged({allDay: false, type: undefined, event, newStart, newEnd});
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.calendarService.handleEvent(action, event);
  }

  addEvent(): void {
    this.calendarService.addEvent();
  }

  addEventContext(date: Date): void {
    this.calendarService.addEventContext(date);
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  ngOnDestroy() {
    this.eventsSub.unsubscribe();
  }
}
