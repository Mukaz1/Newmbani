import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  SimpleChanges,
  OnChanges,
  HostListener,
  inject,
} from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Subject, take, takeUntil } from 'rxjs';
import { SettingsService } from '../../settings/services/settings.service';
import { DialogRef } from '@angular/cdk/dialog';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataLoading } from '../../common/components/data-loading/data-loading';
import { HttpResponseInterface, Settings } from '@newmbani/types';

@Component({
  selector: 'app-file-viewer',
  templateUrl: './file-viewer.html',
  styleUrls: ['./file-viewer.scss'],
  imports: [DataLoading, FormsModule, ReactiveFormsModule],
})
export class FileViewer implements OnInit, OnChanges {
  @Input() isModal = false;
  @HostListener('window:resize')
  onResize() {
    this.calculateWidth();
  }
  src: SafeResourceUrl | null = null;
  loaderMessage = 'Please wait as we load the file for you';
  destroy$ = new Subject();
  @Input({ required: true }) url: string | undefined | null;
  mode = '#view=Fit';
  settings: Settings | undefined;
  public innerHeight = 0;
  public innerWidth = 0;

  private readonly sanitizer = inject(DomSanitizer);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  public readonly dialogRef = inject(DialogRef<FileViewer>);
  private readonly settingsService = inject(SettingsService);
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['url']) {
      this.url = changes['url'].currentValue;
      this.changeDetectorRef.detectChanges();
      this.renderPDF();
    }

    if (changes['isModal']) {
      this.isModal = changes['isModal'].currentValue;
      this.changeDetectorRef.detectChanges();
    }
  }
  ngOnInit(): void {
    this.calculateWidth();
    this.settingsService
      .getSettings()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: HttpResponseInterface) => {
          this.settings = res.data;
          this.changeDetectorRef.detectChanges();
        },
      });
  }
  calculateWidth() {
    this.innerWidth = window.innerWidth - (this.isModal ? 20 : 20);
    this.innerHeight = window.innerHeight - 68;
    this.changeDetectorRef.detectChanges();
  }
  renderPDF() {
    if (!this.url) {
      return;
    }
    this.cleanup();
    const url = this.url + this.mode;
    setTimeout(() => {
      this.src = this.bypassAndSanitize(url);
      this.changeDetectorRef.detectChanges();
    }, 50);
  }
  closeModal(event: Event) {
    event.preventDefault();
    this.dialogRef.close(undefined);
  }
  modeChanged(event: string) {
    this.mode = event;
    this.renderPDF();
  }

  cleanup() {
    this.src = null;
    this.changeDetectorRef.detectChanges();
  }

  bypassAndSanitize(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
