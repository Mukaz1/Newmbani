import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { Component, Input, forwardRef, signal, computed } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

export interface SearchableSelectOption {
  label: string;
  value: string;
  description?: string;
}

@Component({
  selector: 'app-searchable-select',
  templateUrl: './searchable-select.html',
  styleUrl: './searchable-select.scss',
  imports: [FormsModule, CdkMenu, CdkMenuTrigger, CdkMenuItem],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchableSelect),
      multi: true,
    },
  ],
})
export class SearchableSelect implements ControlValueAccessor {
  @Input() placeholder = 'Search...';
  @Input() options: SearchableSelectOption[] = [];
  @Input() disabled = false;

  open = signal(false);
  search = signal('');
  value = signal<string | null>(null);
  displayValue = computed(
    () => this.options.find((option) => option.value === this.value())?.label
  );

  filtered = computed(() =>
    this.options.filter((opt) => {
      const word = opt.description
        ? opt.label + ' ' + opt.description
        : opt.label;
      return word.toLowerCase().includes(this.search().toLowerCase());
    })
  );

  private onChange = (value: any) => {
    //
  };
  private onTouched = () => {
    //
  };

  onInput(event: any) {
    event.stopPropagation();
    const value = event.target.value;
    this.search.set(value);
  }

  writeValue(value: string): void {
    this.value.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  toggleDropdown() {
    if (this.disabled) return;
    this.open.set(!this.open());
    this.search.set('');
  }

  select(option: string) {
    this.search.set('');
    this.value.set(option);
    this.onChange(option);
    this.onTouched();
    this.open.set(false);
  }

  handleSearch(value: string) {
    this.search.set(value);
  }
}
