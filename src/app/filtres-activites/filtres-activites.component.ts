import { Component, OnInit } from '@angular/core';
import {CalendarService} from '../services/calendar.service';

@Component({
  selector: 'app-filtres-activites',
  templateUrl: './filtres-activites.component.html',
  styleUrls: ['./filtres-activites.component.css']
})
export class FiltresActivitesComponent implements OnInit {

  categoriesToFilter = [];
  diversSelected = false;
  coursSelected = false;
  tempsLibreSelected = false;
  revisionSelected = false;

  constructor(private calendarService: CalendarService) {

  }

  ngOnInit() {}

  setSortingTerm(term) {
    if (this.categoriesToFilter.includes(term)) {
      this.categoriesToFilter = this.categoriesToFilter.filter(e => e !== term);
    }
    else {
      this.categoriesToFilter.push(term);
    }
    this.sort();
  }

  sort() {
    this.calendarService.sortEvents(this.categoriesToFilter);
  }

}
