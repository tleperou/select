import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type DropdownItem = {
  label: string;
  id?: string;
};

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
})
export class DropdownComponent {
  private _hover?: number;
  private _shift?: boolean;
  public show$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private hover$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private position: 'bottom' | '' = '';
  private triggerWidth!: string;

  @ViewChild('listEl') listEl: ElementRef;
  @Input() active: number | number[] = 0;
  @Input() chevron: boolean = true;
  @Input() placeholder: string = 'Select';
  @Input() model: DropdownItem[] = [];
  @Input() multiple: boolean = false;
  @Output() select: EventEmitter<number | number[]> = new EventEmitter();

  // host class names

  @HostBinding('class.bottom')
  public get atBottom(): boolean {
    return this.show$.getValue() && this.position === 'bottom';
  }
  @HostBinding('class.open')
  public get open(): boolean {
    return this.show$.getValue();
  }
  @HostBinding('class.multiple')
  public get multipleOn(): boolean {
    return this.multiple;
  }
  @HostBinding('class.empty')
  public get empty(): boolean {
    return !this.activeToArray.length;
  }
  @HostBinding('style.--active')
  public get propActiveItem(): number {
    return this.activeToArray[0];
  }
  @HostBinding('style.--trigger-width')
  public get propTriggerWidth(): string {
    return this.triggerWidth;
  }
  @HostBinding('style.user-select')
  public get unselect(): string {
    return this._shift ? 'none' : '';
  }

  // host events

  @HostListener('document:keyup.arrowup') arrowup = () => this.focusPrev();
  @HostListener('document:keyup.arrowdown') arrowdown = () => this.focusNext();
  @HostListener('document:keyup.escape') escape = () => this.hide();
  @HostListener('document:keydown.shift') shift = () => (this._shift = true);
  @HostListener('document:keyup.shift') unshift = () => (this._shift = false);
  @HostListener('mouseover') mouseover = () => this.hover$.next(true);
  @HostListener('mouseleave') mouseleave = () => {
    this.hover$.next(false);
    setTimeout(() => !this.hover$.getValue() && this.hide(), 200);
  };
  @HostListener('touchstart') touchstart = () => this.toggle();
  @HostListener('touchend') touchend = () => this.hide();

  // life cycles

  constructor(private el: ElementRef) {}

  //

  public itemClicked(i: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    // emit / reset width
    this.show$.getValue()
      ? this.select.emit(this.getNewActive(i))
      : this.widthTrigger();

    // keyboard componiance
    this._hover = i;
    this.focus(this._hover);

    this.toggle();
  }

  public toggle(): void {
    // fix unfix list
    setTimeout(() => this.leftView() && this.fixList(), 100);
    !this.show$.getValue() && this.unfixList();

    this.show$.getValue() ? !this.multiple && this.hide() : this.show();
  }

  //

  public isActive(i: number): boolean {
    return this.activeToArray.indexOf(i) >= 0;
  }

  public isHover(i: number): boolean {
    return this._hover === i;
  }

  public get hover(): number | null {
    return this._hover;
  }

  public get activeToArray(): number[] {
    return Array.isArray(this.active) ? this.active : [this.active];
  }

  //

  private show(): void {
    this.show$.next(true);
  }

  private hide(): void {
    this.show$.next(false);
    this.widthTrigger('min-content');
  }

  private getNewActive(i: number): number[] {
    if (!this.multiple) return [i];

    if (!this._shift || !this._hover) {
      return this.isActive(i)
        ? this.activeToArray.filter((n) => n !== i)
        : [...this.activeToArray, i];
    }

    // select with shift
    const next = [];
    const from = this._hover < i ? this._hover : i;
    const to = this._hover > i ? this._hover : i;
    for (let n = from; n <= to; n++) {
      next.push(n);
    }

    // unselect with shift
    if (next.every((e) => this.activeToArray.indexOf(e) >= 0)) {
      return this.activeToArray.filter((a) => next.indexOf(a) < 0);
    }

    return next;
  }

  private widthTrigger(force?: 'min-content'): void {
    this.triggerWidth = this.el.nativeElement.clientWidth
      ? `${force || this.el.nativeElement.clientWidth + 'px'}`
      : 'min-content';
  }

  private leftView(): boolean {
    return this.listEl.nativeElement.getBoundingClientRect().top < 0;
  }

  private fixList(): void {
    this.position = 'bottom';
  }

  private unfixList(): void {
    this.position = '';
  }

  private focusPrev(): void {
    this._hover = this._hover - 1 < 0 ? this.model.length - 1 : this._hover - 1;
    this.focus(this._hover);
  }

  private focusNext(): void {
    this._hover = this._hover + 1 >= this.model.length ? 0 : this._hover + 1;
    this.focus(this._hover);
  }

  private focus(i: number): void {
    const child = this.listEl.nativeElement.children[i]?.children[1];
    const el = child || this.listEl.nativeElement.children[i]?.children[0];
    el.focus();
  }
}
