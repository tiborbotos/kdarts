import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DartKeyboardComponent } from './dart-keyboard.component';

describe('DartKeyboardComponent', () => {
  let component: DartKeyboardComponent;
  let fixture: ComponentFixture<DartKeyboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DartKeyboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DartKeyboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
