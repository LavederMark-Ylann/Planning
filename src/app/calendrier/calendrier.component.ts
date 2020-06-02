import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
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

@Component({
  selector: 'app-calendrier',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './calendrier.component.html',
  styleUrls: ['./calendrier.component.css'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
  styles: [
    `
      div:not(.cal-draggable):not(.resize-active) > mwl-calendar-week-view-event > div {
        background: repeating-linear-gradient(
          -45deg,
          #AAA,
          #AAA 2px,
          transparent 2px,
          transparent 12px)
      }
    `,
  ],
})

export class CalendrierComponent implements OnInit, OnDestroy {

  @ViewChild('basicMenu') public basicMenu: ContextMenuComponent;
  @ViewChild('dayEventMenu') public dayEventMenu: ContextMenuComponent;

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
