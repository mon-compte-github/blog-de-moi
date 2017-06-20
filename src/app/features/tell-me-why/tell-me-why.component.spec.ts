/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TellMeWhyComponent } from './tell-me-why-me.component';

describe('ContactMeComponent', () => {
  let component: TellMeWhyComponent;
  let fixture: ComponentFixture<TellMeWhyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TellMeWhyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TellMeWhyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
