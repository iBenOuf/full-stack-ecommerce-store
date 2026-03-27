import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesReports } from './sales-reports';

describe('SalesReports', () => {
  let component: SalesReports;
  let fixture: ComponentFixture<SalesReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesReports);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
