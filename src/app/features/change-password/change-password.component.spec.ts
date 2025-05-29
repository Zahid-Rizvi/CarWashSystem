import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChnagePasswordComponent } from './change-password.component';

describe('ChnagePasswordComponent', () => {
  let component: ChnagePasswordComponent;
  let fixture: ComponentFixture<ChnagePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChnagePasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChnagePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
