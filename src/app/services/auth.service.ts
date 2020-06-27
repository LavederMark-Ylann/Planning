import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {User} from 'firebase';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User;
  public loggedIn: boolean;

  constructor(public afAuth: AngularFireAuth, public router: Router, private snack: MatSnackBar) {
    this.loggedIn = !!sessionStorage.getItem('user');
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        sessionStorage.setItem('user', this.user.uid.toString());
      } else {
        sessionStorage.removeItem('user');
      }
    });
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then(res => {
          sessionStorage.setItem('user', res.user.uid.toString());
          this.loggedIn = true;
          this.router.navigate(['']); // then snackbar
        },
        err => this.snack.open(err, 'X',
          {
            panelClass: 'bg-warning',
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            duration: 5000
          }));
  }

  register(email, password) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((res) => {
        sessionStorage.setItem('user', res.user.uid.toString());
        this.loggedIn = true;
        this.router.navigate(['']); // then snackbar
      }).catch((error) => {
        this.snack.open(error, 'X',
          {
            panelClass: 'bg-warning',
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            duration: 5000
          });
      });
  }
}
