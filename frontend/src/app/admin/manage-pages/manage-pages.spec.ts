import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePages } from './manage-pages';

describe('ManagePages', () => {
  let component: ManagePages;
  let fixture: ComponentFixture<ManagePages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagePages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagePages);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
