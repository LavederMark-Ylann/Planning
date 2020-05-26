import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CalendrierComponent } from './calendrier/calendrier.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import { SidenavComponent } from './sidenav/sidenav.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {UrlSerializer} from '@angular/router';
import {AuthGuard} from './services/authguard.service';
import {AuthService} from './services/auth.service';
import {HttpClientModule} from '@angular/common/http';
import { ContextMenuModule } from 'ngx-contextmenu';
import { ListeActivitesComponent } from './liste-activites/liste-activites.component';
import { AjoutActiviteComponent } from './ajout-activite/ajout-activite.component';
import { SimpleRouting } from './modules/Simple-routing';
import { Serializer } from './modules/Serializer';
import {CalendarService} from './services/calendar.service';
import {ColorPickerModule} from 'ngx-color-picker';

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent,
    CalendrierComponent,
    SidenavComponent,
    ListeActivitesComponent,
    AjoutActiviteComponent,
  ],
  imports: [
    BrowserModule,
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
  ],
  providers: [AuthService, AuthGuard,
    { provide: UrlSerializer,
      useClass: Serializer },
    CalendarService,
    ],
  bootstrap: [AppComponent]
})

export class AppModule { }

