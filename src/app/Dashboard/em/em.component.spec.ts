import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmComponent } from './em.component';

describe('EmComponent', () => {
  let component: EmComponent;
  let fixture: ComponentFixture<EmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
