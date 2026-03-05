import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  input,
  output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Editor, NgxEditorModule, Toolbar, Validators } from 'ngx-editor';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-text-editor',
  imports: [NgxEditorModule, FormsModule, ReactiveFormsModule],
  templateUrl: './text-editor.html',
  styleUrl: './text-editor.scss',
})
export class TextEditor implements OnInit, OnDestroy, OnChanges {
  readonly resetForm = input<boolean>(false);
  html = '';
  editor = new Editor({});

  toolbar: Toolbar = [
    // default value
    ['undo', 'redo'],
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['horizontal_rule', 'format_clear', 'indent', 'outdent'],
    ['superscript', 'subscript'],
  ];

  form = new FormGroup({
    editorContent: new FormControl('', Validators.required()),
  });

  readonly value = input<string | null>(null);
  readonly addBorder = input<boolean>(false);
  readonly getEditorInput = output<string | undefined>();
  destroy$ = new Subject();

  ngOnInit(): void {
    this.editor = new Editor({
      keyboardShortcuts: true,
      history: true,
      inputRules: true,
    });

    // emit the values
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      const editorContent = data.editorContent || '';
      const value: string | undefined =
        editorContent === '<p></p>' ? undefined : editorContent;
      this.getEditorInput.emit(value);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['resetForm'] !== undefined &&
      changes['resetForm'].currentValue === true
    ) {
      this.reset();
    }
  }
  reset() {
    this.form.reset();
  }
  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
