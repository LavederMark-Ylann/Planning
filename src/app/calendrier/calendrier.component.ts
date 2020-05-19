import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
} from '@angular/core';
import {ContextMenuComponent, ContextMenuModule} from 'ngx-contextmenu';

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours, setMinutes, setHours,
} from 'date-fns';
import { NgbDropdown} from '@ng-bootstrap/ng-bootstrap';
import {Subject, Subscription} from 'rxjs';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarDateFormatter,
  DAYS_OF_WEEK,
} from 'angular-calendar';
import { CustomDateFormatter } from './custom-date-formatter.provider';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

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

export class CalendrierComponent {

  @ViewChild('basicMenu') public basicMenu: ContextMenuComponent;
  @ViewChild('dayEventMenu') public dayEventMenu: ContextMenuComponent;

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];
  events: CalendarEvent[] = [
    {
      start: setHours(setMinutes(new Date(), 30), 13),
      end: setHours(setMinutes(new Date(), 0), 14),
      title: 'Point sur le stage, non modifiable',
      color: colors.yellow,
      actions: this.actions,
    },
    {
      start: setHours(setMinutes(new Date(), 15), 14),
      end: setHours(setMinutes(new Date(), 20), 15),
      title: 'Evenement déplaçable et redimensionnable',
      color: colors.blue,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
  ];

  view: CalendarView = CalendarView.Week;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  locale = 'fr';

  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;

  weekendDays: number[] = [DAYS_OF_WEEK.SATURDAY, DAYS_OF_WEEK.SUNDAY];

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  refresh: Subject<any> = new Subject();

  activeDayIsOpen = false;


  constructor() { // httpClient pour la récup serveur firebase
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
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    // this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  addEventContext(date: Date): void {
    if (date.getHours() < 8) {
      date.setHours(date.getHours() + 8);
    }
    this.events.push({
      start: date,
      title: 'event',
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
    });
    this.refresh.next();
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
}
