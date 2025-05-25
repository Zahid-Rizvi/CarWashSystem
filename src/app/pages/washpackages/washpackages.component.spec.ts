import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WashpackagesComponent } from './washpackages.component';

describe('WashpackagesComponent', () => {
  let component: WashpackagesComponent;
  let fixture: ComponentFixture<WashpackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WashpackagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WashpackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
