import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import { CalendarService } from '../services/calendar.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-ajout-activite',
  templateUrl: './ajout-activite.component.html',
  styleUrls: ['./ajout-activite.component.css']
})

export class AjoutActiviteComponent implements OnInit {

  constructor(private calendarService: CalendarService, private bar: MatSnackBar) { }

  public color = '#2889e9'; // couleur de base du color picker

  math = Math; // Fonctions de calcul pour le front

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

  snackbar() {
    this.bar.open('Activité ajoutée !', 'X', {
      panelClass: 'bg-success',
      duration: 1500,
      horizontalPosition: 'start',
      verticalPosition: 'bottom',
    });
  }

}
