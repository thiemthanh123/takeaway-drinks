import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LifecycleChild } from './lifecycle-child';

describe('LifecycleChild', () => {
  let component: LifecycleChild;
  let fixture: ComponentFixture<LifecycleChild>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LifecycleChild],
    }).compileComponents();

    fixture = TestBed.createComponent(LifecycleChild);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
