import {Component, OnDestroy, OnInit} from '@angular/core';
import {CalendarService} from '../services/calendar.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-filtres-activites',
  templateUrl: './filtres-activites.component.html',
  styleUrls: ['./filtres-activites.component.css']
})
export class FiltresActivitesComponent implements OnInit, OnDestroy {

  termsToFilter = [];
  termsSub: Subscription;
  filtersSelected = [];
  filtersSub: Subscription;

  constructor(private calendarService: CalendarService) {}

  ngOnInit() {
    // Filtres sélectionnés (tab de bool)
    this.filtersSub = this.calendarService.filtersSelectedSubject.subscribe(
      (filters: any[]) => {
        this.filtersSelected = filters;
      }
    );
    this.calendarService.emitFiltersSubject();
    // Termes à filtrer (tab de string)
    this.termsSub = this.calendarService.filterTermsSubject.subscribe(
      (categories: any[]) => {
        this.termsToFilter = categories;
      }
    );
    this.calendarService.emitFiltersSubject();
  }

  setFilters(index: number) {
    this.calendarService.setFilters(index);
  }

  setSortingTerm(term: string) {
    this.calendarService.setSortingTerm(term);
  }

  ngOnDestroy() {
    this.termsSub.unsubscribe();
    this.filtersSub.unsubscribe();
  }

}
