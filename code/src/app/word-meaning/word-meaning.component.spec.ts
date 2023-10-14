import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordMeaningComponent } from './word-meaning.component';

describe('WordMeaningComponent', () => {
  let component: WordMeaningComponent;
  let fixture: ComponentFixture<WordMeaningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WordMeaningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordMeaningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
