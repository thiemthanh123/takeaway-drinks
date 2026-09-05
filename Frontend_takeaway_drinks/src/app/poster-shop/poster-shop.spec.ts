import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PosterShop } from './poster-shop';

describe('PosterShop', () => {
  let component: PosterShop;
  let fixture: ComponentFixture<PosterShop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosterShop],
    }).compileComponents();

    fixture = TestBed.createComponent(PosterShop);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
