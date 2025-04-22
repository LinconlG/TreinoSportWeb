import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarTreinoComponent } from './criar-treino.component';

describe('CriarTreinoComponent', () => {
  let component: CriarTreinoComponent;
  let fixture: ComponentFixture<CriarTreinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriarTreinoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriarTreinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
