import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {User} from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User;
  public loggedIn: boolean;

  constructor(public afAuth: AngularFireAuth, public router: Router) {
    this.loggedIn = !!sessionStorage.getItem('user');
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        sessionStorage.setItem('user', JSON.stringify(this.user));
      } else {
        sessionStorage.setItem('user', null);
      }
    });
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then(res => {
          sessionStorage.setItem('user', JSON.stringify(res.user.uid));
          this.loggedIn = true;
          this.router.navigate(['']); // then snackbar
        },
        err => console.log(err));
  }

  register(email, password) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((res) => {
        sessionStorage.setItem('user', JSON.stringify(res.user.uid));
        this.loggedIn = true;
        this.router.navigate(['']); // then snackbar
      }).catch((error) => {
        console.log(error.message);
      });
  }
}
