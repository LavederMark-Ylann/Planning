import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {endOfDay, setHours, setMinutes, startOfDay} from 'date-fns';
import {CustomEvents} from '../modules/CustomEvents';
import {HttpClient} from '@angular/common/http';
import * as firebase from 'firebase';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import * as ical2json from 'ical2json';
import iCalDateParser from 'ical-date-parser';

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
export class CalendarService {

  eventsSubject = new Subject<any[]>();
  ref = new Subject();

  filtersSelected = [false, false, false, false];
  filtersSelectedSubject = new Subject<any[]>();

  events: CustomEvents[]; // Tous les évènements

  filterTerms: string[];
  filterTermsSubject = new Subject<any[]>();

  filteredEvents: CustomEvents[]; // Tous les évènements affichés

  locale = 'fr';

  modalData: {
    action: string;
    event: CustomEvents;
  };
  snack: MatSnackBar;

  constructor(private httpClient: HttpClient, snack: MatSnackBar) {
    this.events = [];
    this.snack = snack;
    this.getEventsPerso();
    this.getCours();
  }

  emitTermsSubject() {
    this.filterTermsSubject.next(this.filterTerms);
  }

  emitFiltersSubject() {
    this.filtersSelectedSubject.next(this.filtersSelected);
  }

  emitEventsSubject() {
    this.eventsSubject.next(this.filteredEvents.slice());
  } // A faire après chaque changement du calendrier

  eventTimesChanged({event, newStart, newEnd}) {
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
    this.events.push({
      identifiant: Math.max(Math.max.apply(Math, this.events.map((o) => o.identifiant + 1)), 0),
      start: date,
      end: setHours(date, date.getHours() + 1),
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

  handleEvent(action: string, event: CustomEvents) {
    this.modalData = {event, action};
    this.update();
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        identifiant: Math.max.apply(Math, this.events.map((o) => o.identifiant + 1)),
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

  newEvent(data) {
    return {
      identifiant: data.identifiant,
      title: data.title,
      start: new Date(data.start),
      end: new Date(data.end),
      color: data.color,
      draggable: data.draggable,
      resizable: data.resizable,
      category: data.category,
    };
  }

  deleteEvent(eventToDelete) {
    this.events = this.events.filter((event) => event.identifiant !== eventToDelete.event.identifiant);
    this.update();
  }

  sidenavAddEvent(titre, duree, couleur, categorie): void {
    const checkedCategory = this.checkCategory(categorie);
    const today = setMinutes(new Date(), 0);
    this.events = [
      ...this.events,
      {
        identifiant: Math.max.apply(Math, this.events.map((o) => o.identifiant + 1)),
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
      case 'Cours':
      case 'cours' : /* Les élèves ne peuvent pas rajouter de cours, uniquement des révisions */
      case 'Revision' :
      case 'revision' :
      case 'révision' :
      case 'Révision' :
        return Category.Revision;
      case 'Temps libre' :
      case 'temps libre' :
      case 'Temps Libre' :
      case 'tempslibre' :
      case 'TempsLibre' :
        return Category.TempsLibre;
      default :
        return Category.Divers;
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

  setFilters(index: number) {
    this.filtersSelected[index] = !this.filtersSelected[index];
  }

  setSortingTerm(term: string) {
    if (this.filterTerms.includes(term)) {
      this.filterTerms = this.filterTerms.filter(e => e !== term);
    } else {
      this.filterTerms.push(term);
    }
    this.emitTermsSubject();
    this.sortEvents(this.filterTerms);
  }

  getEventsPerso() {
    firebase.auth().onAuthStateChanged((u) => {
      if (u) {
        firebase.database().ref('PlanningPerso').child(u.uid).once('value').then((snapshot) => {
          snapshot.forEach((item) => {
            this.events.push(this.newEvent(item.val()));
          });
          this.sortEvents([]);
          this.ref.next();
        });
      }
    });
  }

  getCours() {
    const url = './assets/uploads/' + sessionStorage.getItem('user') + '.ics';
    this.httpClient.get(url, { responseType: 'text' })
      .subscribe(d => {
        const jsonizedICal = ical2json.convert(d);
        for (const event of jsonizedICal.VCALENDAR[0].VEVENT) {
          if (event['DTSTART;TZID=Europe/Paris'] && !event.DTSTART) {
            event.DTSTART = event['DTSTART;TZID=Europe/Paris'] + 'Z';
            event.DTEND = event['DTEND;TZID=Europe/Paris'] + 'Z';
          }
          this.events.push(this.newEvent(
            {
              identifiant: Math.max(Math.max.apply(Math, this.events.map((o) => o.identifiant + 1)), 0),
              title: event.SUMMARY,
              color: colors.blue,
              start: new Date(iCalDateParser(event.DTSTART)),
              end: new Date(iCalDateParser(event.DTEND)),
              category: Category.Cours,
            }
          ));
        }
        this.ref.next();
      },
        () => this.snack.open('Il semble que vous n\'ayez pas de iCal enregistré. Vous pouvez en enregistrer un dans les paramètres disponibles dans le menu latéral', 'X',
          {
            panelClass: 'bg-warning',
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            duration: 0
          }));
  }

  saveEvents() {
    const toSave = this.sortDataToSend([Category.Revision, Category.TempsLibre, Category.Divers]);
    // On envoie tout sauf les cours
    firebase.auth().onAuthStateChanged((u) => {
      if (u) {
        firebase.database().ref('PlanningPerso').child(u.uid).set(toSave).then(() => {
        });
      }
    });
  }

  sortDataToSend(keys: string[]) {
    const array = this.events.filter((event: CustomEvents) => {
      return keys.some(k => event.category.toLowerCase().includes(k.toLowerCase()));
    });
    const ret = [];
    for (const event of array) {
      ret.push(
        {
          identifiant: event.identifiant,
          title: event.title,
          start: event.start.toString(),
          end: event.end.toString(),
          color: event.color,
          draggable: event.draggable,
          resizable: event.resizable,
          category: event.category,
        }
      );
    }
    return ret;
  }

  snackbar(message: string, hPos: MatSnackBarHorizontalPosition, vPos: MatSnackBarVerticalPosition, classe?: string) {
    this.snack.open(message, 'X', {
      panelClass: classe,
      duration: 1500,
      horizontalPosition: hPos,
      verticalPosition: vPos,
    });
  }

  snackSave() {

  }

  saveCours() {
    this.httpClient
      .put('https://emploi-du-temps-a6bb9.firebaseio.com/Cours/cours.json',
        this.sortEvents([Category.Divers, Category.TempsLibre, Category.Revision]))
      .subscribe(
        () => {
          console.log('Sauvegarde réussie');
        },
        (error) => {
          console.log('Erreur :' + error);
        }
      );
  }
}
