import { Component, HostBinding, Input } from '@angular/core';

type Icon = 'chevron-down' | 'check' | 'close';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.css'],
})
export class IconComponent {
  @Input() model: Icon;
}
