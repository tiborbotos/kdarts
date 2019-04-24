import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { X01gamePageComponent } from './x01game-page.component';

describe('X01gamePageComponent', () => {
  let component: X01gamePageComponent;
  let fixture: ComponentFixture<X01gamePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ X01gamePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(X01gamePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
