import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltresActivitesComponent } from './filtres-activites.component';

describe('FiltresActivitesComponent', () => {
  let component: FiltresActivitesComponent;
  let fixture: ComponentFixture<FiltresActivitesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltresActivitesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltresActivitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
