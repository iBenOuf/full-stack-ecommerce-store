import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSubcategories } from './manage-subcategories';

describe('ManageSubcategories', () => {
  let component: ManageSubcategories;
  let fixture: ComponentFixture<ManageSubcategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageSubcategories]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageSubcategories);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
