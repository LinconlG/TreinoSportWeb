import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciamentoTreinoComponent } from './gerenciamento-treino.component';

describe('GerenciamentoTreinoComponent', () => {
  let component: GerenciamentoTreinoComponent;
  let fixture: ComponentFixture<GerenciamentoTreinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciamentoTreinoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciamentoTreinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
