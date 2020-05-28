import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeActivitesComponent } from './liste-activites.component';

describe('ListeActivitesComponent', () => {
  let component: ListeActivitesComponent;
  let fixture: ComponentFixture<ListeActivitesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeActivitesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeActivitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
