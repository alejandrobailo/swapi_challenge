import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  value: boolean;

  constructor() {
    this.value = false;
  }

  handleClick() {
    this.value = !this.value;
  }
}
