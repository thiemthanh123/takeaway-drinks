import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderLayout } from './shared/header-layout/header-layout';
import { SpinnerService } from '../services/spinner.service';
import { AsyncPipe } from '@angular/common';


@Component({
  imports: [RouterOutlet, HeaderLayout, AsyncPipe],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Tâm Lép TakeAway Drinks');

  constructor(public spinnerService: SpinnerService) {}
}
