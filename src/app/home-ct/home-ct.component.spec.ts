import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCtComponent } from './home-ct.component';

describe('HomeCtComponent', () => {
  let component: HomeCtComponent;
  let fixture: ComponentFixture<HomeCtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeCtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeCtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
