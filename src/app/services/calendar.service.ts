import { Subject} from 'rxjs';
import { Injectable } from '@angular/core';
import {CalendarEventAction, CalendarEventTimesChangedEvent} from 'angular-calendar';
import {endOfDay, setHours, setMinutes, startOfDay} from 'date-fns';
import {CustomEvents} from '../modules/CustomEvents';

enum Category {
  Divers = 'Divers',
  TempsLibre = 'Temps Libre',
  Cours = 'Cours',
  Revision = 'Révision',
}

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

@Injectable()
export class CalendarService
{

  eventsSubject = new Subject<any[]>();
  ref = new Subject();

  private actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CustomEvents }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CustomEvents }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];
  private events: CustomEvents[] = [
    {
      start: new Date('2020/06/05 13:30:00'), /* setHours(setMinutes(new Date(), 30), 13) */
      end: new Date('2020/06/05 14:30:00'),   /* setHours(setMinutes(new Date(), 0), 14)  */
      title: 'Point sur le stage, non modifiable',
      color: colors.yellow,
      actions: this.actions,
      category: Category.Cours,
    },
    {
      start: setHours(setMinutes(new Date('2020/06/04 00:00:00'), 0), 14),
      end: setHours(setMinutes(new Date('2020/06/04 00:00:00'), 30), 15),
      title: 'Evènement déplaçable et redimensionnable',
      color: colors.blue,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
      category: Category.Divers,
    },
  ]; // Tous les évènements

  private filterTerms: string[];
  private filteredEvents: CustomEvents[]; // Tous les évènements affichés

  locale = 'fr';

  modalData: {
    action: string;
    event: CustomEvents;
  };

  constructor() {
    this.sortEvents([]);
  }

  emitEventsSubject() {
    this.eventsSubject.next(this.filteredEvents.slice());
  } // A faire après chaque changement du calendrier

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

  addEventContext(date: Date): void {
    if (date.getHours() < 8) {
      date.setHours(8);
    }
    this.events.push({
      start: date,
      title: 'Nouvel évènement',
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      category: Category.Divers,
    });
    this.update();
  }

  handleEvent(action: string, event: CustomEvents): void {
    this.modalData = { event, action };
    this.update();
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'Nouvel évènement',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
        category: Category.Divers,
      },
    ];
    this.update();
  }

  sidenavAddEvent(titre, duree, couleur, categorie): void {
    const checkedCategory = this.checkCategory(categorie);
    const today = setHours(setMinutes(new Date(), 0), 8);
    this.events = [
      ...this.events,
      {
        title: titre,
        start: today,
        end: setMinutes(today, duree),
        color: couleur,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
        category: checkedCategory,
      },
    ];
    this.update();
  }

  checkCategory(categorie) {
    switch (categorie) {
      case 'Cours': case 'cours' : return Category.Cours;
      case 'Revision' : case 'revision' : case 'révision' : case 'Révisions' :   return Category.Revision;
      case 'Temps libre' : case 'temps libre' : case 'Temps Libre' : case 'tempsLibre' : case 'TempsLibre' :
        return Category.TempsLibre;
      default : return Category.Divers;
    }
  }

  sortEvents(keys: string []) {
    this.filterTerms = keys;
    this.filteredEvents = this.events.filter((event: CustomEvents) => {
      return !keys.some(k => event.category.toLowerCase().includes(k.toLowerCase()));
    });
    this.emitEventsSubject();
    this.ref.next();
  }

  update() {
    this.sortEvents(this.filterTerms);
    this.emitEventsSubject();
    this.ref.next();
  }
}
