import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, Input, TemplateRef, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-toggle-input',
  imports:[NgClass,NgTemplateOutlet],
  templateUrl: './toggle-input.html',
  styleUrl: './toggle-input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleInput),
      multi: true,
    },
  ],
})
export class ToggleInput  implements ControlValueAccessor {
  /** Display labels */
  @Input() onLabel = 'On';
  @Input() offLabel = 'Off';

  /** Styling options */
  @Input() color = 'blue';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() shape: 'rounded' | 'square' = 'rounded';
  @Input() customClass = '';
  @Input() disabled = false;
  @Input() style: Record<string, any> = {};

  /** Label templates */
  @ContentChild('onTemplate') onTemplate?: TemplateRef<any>;
  @ContentChild('offTemplate') offTemplate?: TemplateRef<any>;

  /** Internal value */
  @Input({required:true}) value = false;
  ripple = false;

  /** Form ControlValueAccessor */
  private onChange: (value: boolean) => void = () => {
    // 
  };
  private onTouched: () => void = () => {
    // 
  };

  writeValue(value: boolean): void {
    this.value = !!value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggle() {
    if (this.disabled) return;
    this.value = !this.value;
    this.onChange(this.value);
    this.onTouched();
  }

 

  /** Label logic */
  get currentLabel(): string {
    return this.value ? this.onLabel : this.offLabel;
  }

  /** Tailwind dynamic classes */
  get colorClass(): string {
    return this.value ? `bg-${this.color}-600` : 'bg-gray-300';
  }

  get shapeClass(): string {
    return this.shape === 'rounded' ? 'rounded-full' : 'rounded-md';
  }

  get sizeClass(): string {
    switch (this.size) {
      case 'sm':
        return 'w-8 h-4';
      case 'lg':
        return 'w-14 h-7';
      default:
        return 'w-11 h-6';
    }
  }

  get knobSizeClass(): string {
    switch (this.size) {
      case 'sm':
        return 'w-3.5 h-3.5';
      case 'lg':
        return 'w-6 h-6';
      default:
        return 'w-5 h-5';
    }
  }

  get knobTranslate(): string {
    switch (this.size) {
      case 'sm':
        return this.value ? 'translate-x-4' : 'translate-x-0';
      case 'lg':
        return this.value ? 'translate-x-7' : 'translate-x-0';
      default:
        return this.value ? 'translate-x-5' : 'translate-x-0';
    }
  }

  // /** Accessibility */
  // @HostListener('keydown.enter', ['$event'])
  // @HostListener('keydown.space', ['$event'])
  // onKeydown(event: KeyboardEvent) {
  //   event.preventDefault();
  //   this.toggle();
  // }
}