import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import { CalendarService } from '../services/calendar.service';

@Component({
  selector: 'app-ajout-activite',
  templateUrl: './ajout-activite.component.html',
  styleUrls: ['./ajout-activite.component.css']
})

export class AjoutActiviteComponent implements OnInit {

  constructor(private calendarService: CalendarService) { }

  public color = '#2889e9'; // couleur de base du color picker

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    const titre = form.value.nom;
    let duree = form.value.duree;
    const couleur = this.getColors(this.color);
    const categorie = form.value.categorie;
    if (duree === '') { duree = 75; }
    this.calendarService.sidenavAddEvent(titre, duree, couleur, categorie);
  }

  getColors(couleur: string) {
    const sec = '#' + couleur.replace(/^#/, '')
      .replace(/../g, color =>
        ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + 50))
          .toString(16)).substr(-2));
    return {primary: couleur, secondary: sec.toUpperCase()};
  }

}
