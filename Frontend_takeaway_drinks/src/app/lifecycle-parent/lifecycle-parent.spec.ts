import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LifecycleParent } from './lifecycle-parent';

describe('LifecycleParent', () => {
  let component: LifecycleParent;
  let fixture: ComponentFixture<LifecycleParent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LifecycleParent],
    }).compileComponents();

    fixture = TestBed.createComponent(LifecycleParent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
