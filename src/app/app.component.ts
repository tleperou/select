import { Component } from '@angular/core';
import { DropdownItem } from './dropdown/dropdown.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public activeItems: number | number[] = [1];
  public model: DropdownItem[] = [
    { label: 'Insights' },
    { label: 'Insights' },
    { label: 'Many podcasts' },
    { label: 'Many podcasts' },
    { label: 'Reports' },
    { label: 'Many podcasts' },
    { label: 'Reports' },
    { label: 'Reports' },
    { label: 'Many podcasts' },
  ];

  public updateDropdown(index: number | number[]): void {
    this.activeItems = index;
  }

  public get current(): DropdownItem {
    return typeof this.activeItems === 'number'
      ? this.model[this.activeItems]
      : this.model[this.activeItems[0]];
  }

  public get currentItems(): DropdownItem[] {
    const items =
      typeof this.activeItems === 'number'
        ? [this.activeItems]
        : this.activeItems;
    return items.map((i) => this.model[i]);
  }
}
