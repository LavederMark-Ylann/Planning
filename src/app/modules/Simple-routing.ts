import {RouterModule, Routes} from '@angular/router';
import {CalendrierComponent} from '../calendrier/calendrier.component';
import { NgModule } from '@angular/core';
import {ListeActivitesComponent} from '../liste-activites/liste-activites.component';
import {AjoutActiviteComponent} from '../ajout-activite/ajout-activite.component';

const routes: Routes = [
  {path: '', redirectTo: '/cal', pathMatch: 'full'},
  {path: 'cal', component: CalendrierComponent},
  {path: 'list', component: ListeActivitesComponent, outlet: 'side'},
  {path: 'add', component: AjoutActiviteComponent, outlet: 'side'},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class SimpleRouting {

}
