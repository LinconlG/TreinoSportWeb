import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarTreinoComponent } from './editar-treino.component';

describe('EditarTreinoComponent', () => {
  let component: EditarTreinoComponent;
  let fixture: ComponentFixture<EditarTreinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarTreinoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarTreinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
