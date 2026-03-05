import {
  Component,
  Input,
  output,
  input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Spinner } from '../spinner/spinner';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-button',
  imports: [Spinner, NgClass],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button implements OnChanges {
  readonly type = input<'submit' | 'button' | 'reset'>('button');
  readonly showIcon = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly spinnerSize = input<string>('18px');
  readonly formValid = input<boolean>(true);
  readonly showLabel = input<boolean>(true); // Add showLabel input
  @Input() isLoading = false;
  @Input() label = 'Submit';
  @Input() styles = '';
  @Input() icon = 'bi bi-send';
  readonly iconPosition = input<'left' | 'right'>('right');
  readonly buttonClicked = output<boolean>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['label']) {
      this.label = changes['label'].currentValue;
    }
    if (changes['styles']) {
      const styles = changes['styles'].currentValue;
      const classList: string[] = [];
      styles.split(' ').forEach((className: string) => {
        classList.push(`${className}`);
      });
      this.styles = classList.join(' ');
    }
  }

  /**
   * Emit the event that the button has been clicked
   * @param event
   */
  buttonClickedEvent(event: Event) {
    if (this.type() !== 'submit') {
      event.preventDefault();
    }
    // emit the event
    this.buttonClicked.emit(true);
  }
}
