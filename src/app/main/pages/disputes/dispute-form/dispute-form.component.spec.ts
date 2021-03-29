import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisputeFormComponent } from './dispute-form.component';

describe('DisputeFormComponent', () => {
  let component: DisputeFormComponent;
  let fixture: ComponentFixture<DisputeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisputeFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisputeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
