import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent implements OnInit {

  errorMessage: string;
  panel = 'login';

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
  }

  tryLogin(email, password) {
    this.authService.login(email, password);
  }

  tryRegister(email, password) {
    this.authService.register(email, password);
  }

  onLogin(form: NgForm) {
    this.tryLogin(form.value.email, form.value.password);
  }

  onRegister(form: NgForm) {
    this.tryRegister(form.value.email, form.value.password);
  }

}
