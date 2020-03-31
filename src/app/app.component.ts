import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  value: boolean;
  initialColor: string;

  constructor() {
    this.value = false;
    this.initialColor = localStorage.getItem('color-mode')
    
    if(this.initialColor){
      document.documentElement.setAttribute('color-mode', this.initialColor);
    }
  }

  handleClick() {
    this.value = !this.value;
  }

  toggleColor(e) {
    if (e.currentTarget.classList.contains('light')) {
      document.documentElement.setAttribute('color-mode', 'light');
      localStorage.setItem('color-mode', 'light');
      return;
    }

    document.documentElement.setAttribute('color-mode', 'dark');
    localStorage.setItem('color-mode', 'dark');
  }
}
