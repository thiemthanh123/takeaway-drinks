import {
  Component,
  Input,
  OnInit,
  OnChanges,
  DoCheck,
  AfterContentInit,
  AfterContentChecked,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'app-lifecycle-child',
  standalone: true,
  templateUrl: './lifecycle-child.html',
  styleUrl: './lifecycle-child.css'
})
export class LifecycleChild implements
  OnInit,
  OnChanges,
  DoCheck,
  AfterContentInit,
  AfterContentChecked,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy {

  @Input() productName: string = '';

  constructor() {
    console.log('🟢 1. constructor');
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('🟡 2. ngOnChanges');
    console.log(changes);
  }

  ngOnInit(): void {
    console.log('🔵 3. ngOnInit');
  }

  ngDoCheck(): void {
    console.log('🟠 ngDoCheck');
  }

  ngAfterContentInit(): void {
    console.log('🟣 4. ngAfterContentInit');
  }

  ngAfterContentChecked(): void {
    console.log('🟤 ngAfterContentChecked');
  }

  ngAfterViewInit(): void {
    console.log('🔷 5. ngAfterViewInit');
  }

  ngAfterViewChecked(): void {
    console.log('⚪ ngAfterViewChecked');
  }

  ngOnDestroy(): void {
    console.log('🔴 ngOnDestroy');
  }
}