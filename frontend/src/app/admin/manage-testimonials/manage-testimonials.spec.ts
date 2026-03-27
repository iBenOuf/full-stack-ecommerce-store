import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTestimonials } from './manage-testimonials';

describe('ManageTestimonials', () => {
  let component: ManageTestimonials;
  let fixture: ComponentFixture<ManageTestimonials>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageTestimonials]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageTestimonials);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
