import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailOrder } from './detail-order';

describe('DetailOrder', () => {
  let component: DetailOrder;
  let fixture: ComponentFixture<DetailOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailOrder],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailOrder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
