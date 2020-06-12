import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { NgModule} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CalendrierComponent } from './calendrier/calendrier.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SidenavComponent } from './sidenav/sidenav.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {UrlSerializer} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import { ContextMenuModule } from 'ngx-contextmenu';
import { ListeActivitesComponent } from './liste-activites/liste-activites.component';
import { AjoutActiviteComponent } from './ajout-activite/ajout-activite.component';
import { SimpleRouting } from './modules/Simple-routing';
import { Serializer } from './modules/Serializer';
import {CalendarService} from './services/calendar.service';
import {ColorPickerModule} from 'ngx-color-picker';
import { FiltresActivitesComponent } from './filtres-activites/filtres-activites.component';
import {CapitalizeFirstLetterPipe} from './modules/CapitalizeFirstLetterPipe';
import {MatSnackBar} from '@angular/material/snack-bar';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { ConnexionComponent } from './connexion/connexion.component';
import * as firebase from 'firebase/app';
import {AuthService} from './services/auth.service';
import {AuthGuard} from './services/authguard.service';
import {MatTooltipModule} from '@angular/material/tooltip';

firebase.initializeApp(environment.firebase);
registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent,
    CalendrierComponent,
    SidenavComponent,
    ListeActivitesComponent,
    AjoutActiviteComponent,
    FiltresActivitesComponent,
    CapitalizeFirstLetterPipe,
    ConnexionComponent,

  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    NgbModule,
    FormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    HttpClientModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    ContextMenuModule.forRoot({
      useBootstrap4: true,
    }),
    SimpleRouting,
    ColorPickerModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    MatTooltipModule,
  ],
  providers: [
    { provide: UrlSerializer,
      useClass: Serializer },
    CalendarService,
    MatSnackBar,
    AuthService,
    AuthGuard,
    ],
  bootstrap: [AppComponent]
})

export class AppModule {}
