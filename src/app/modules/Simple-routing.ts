import {RouterModule, Routes} from '@angular/router';
import {CalendrierComponent} from '../calendrier/calendrier.component';
import { NgModule } from '@angular/core';
import {ListeActivitesComponent} from '../liste-activites/liste-activites.component';
import {AjoutActiviteComponent} from '../ajout-activite/ajout-activite.component';
import {FiltresActivitesComponent} from '../filtres-activites/filtres-activites.component';
import {ConnexionComponent} from '../connexion/connexion.component';
import {AuthGuard} from '../services/authguard.service';
import {ConfigurationComponent} from '../configuration/configuration.component';
import {LoggedInGuardService} from '../services/loggedInGuard.service';

const routes: Routes = [
  {path: '', component: CalendrierComponent, canActivate: [AuthGuard]},
  {path: 'list', component: ListeActivitesComponent, outlet: 'side', canActivate: [AuthGuard]},
  {path: 'add', component: AjoutActiviteComponent, outlet: 'side', canActivate: [AuthGuard]},
  {path: 'filter', component: FiltresActivitesComponent, outlet: 'side', canActivate: [AuthGuard]},
  {path: 'settings', component: ConfigurationComponent, outlet: 'side', canActivate: [AuthGuard]},
  {path: 'login', component: ConnexionComponent, canActivate: [LoggedInGuardService]},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class SimpleRouting {

}
