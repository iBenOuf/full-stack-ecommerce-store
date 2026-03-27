import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAddresses } from './my-addresses';

describe('MyAddresses', () => {
  let component: MyAddresses;
  let fixture: ComponentFixture<MyAddresses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyAddresses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyAddresses);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
