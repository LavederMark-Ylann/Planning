import {Component, OnDestroy, OnInit} from '@angular/core';
import {CalendarService} from '../services/calendar.service';
import {Subscription} from 'rxjs';
import {CustomEvents} from '../modules/CustomEvents';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-liste-activites',
  templateUrl: './liste-activites.component.html',
  styleUrls: ['./liste-activites.component.css']
})
export class ListeActivitesComponent implements OnInit, OnDestroy {

  eventsSub: Subscription;

  events: any[];
  sorted: any[];
  filtered: any[];

  filterTerm = '';

  ngOnInit() {
    this.eventsSub = this.calendarService.eventsSubject.subscribe(
      (events: any[]) => {
        this.events = events;
        this.sorted = this.sortEvents();
        this.searchData();
      }
    );
    this.calendarService.emitEventsSubject();
  }

  constructor(private calendarService: CalendarService, private bar: MatSnackBar) {
  }

  sortEvents() {
    const keys = ['title', 'category']; // Clé primaire
    return this.events.filter(
      (s => o =>
          (k => !s.has(k) && s.add(k))
          (keys.map(k => o[k]).join('|'))
      )
        // tslint:disable-next-line:new-parens
      (new Set)
    );
  }

  searchData() {
    this.filtered = this.sorted.filter((event: CustomEvents) => {
      return event.title.toLowerCase().includes(this.filterTerm.toLowerCase());
    });
  }

  sidenavAddEvent(titre, duree, couleur, categorie) {
    this.calendarService.sidenavAddEvent(titre, duree, couleur, categorie);
  }

  snackbar() {
    this.bar.open('Activité ajoutée !', 'X', {
      duration: 1500,
      horizontalPosition: 'start',
      verticalPosition: 'bottom',
    });
  }

  ngOnDestroy() {
    this.eventsSub.unsubscribe();
  }
}
