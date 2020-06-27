import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFichierComponent } from './upload-fichier.component';

describe('UploadFichierComponent', () => {
  let component: UploadFichierComponent;
  let fixture: ComponentFixture<UploadFichierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadFichierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFichierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
