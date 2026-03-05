import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  inject,
  PLATFORM_ID,
  input,
  output,
  Input,
  computed,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FileSizePipe } from '../../pipes/file-size.pipe';
import { FileMimeType } from '@newmbani/types';

@Component({
  selector: 'app-file-uploader',
  imports: [FileSizePipe],
  templateUrl: './file-uploader.html',
  styleUrl: './file-uploader.scss',
})
export class FileUploader {
  private readonly sanitizer = inject(DomSanitizer);

  readonly multiple = input.required<boolean>();
  readonly description = input(
    'SVG, PNG, JPG or GIF (MAX. 800x400px, Max upload size: 5 MB)'
  );
  @Input({ required: true }) fileTypes: Array<FileMimeType[]> = [];

  files = signal<File[] | []>([]);
  readonly filesSelected = output<File[]>();
  urls: SafeUrl[] | ArrayBuffer[] = [];
  blobURLs: string[] | ArrayBuffer[] = [];

  totalFileSize = computed(() =>
    Number(
      (
        this.files().reduce((acc, file) => acc + (file.size || 0), 0) /
        (1024 * 1024)
      ).toFixed(4)
    )
  );

  platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);

  /**
   * Emit files when selected
   *
   * @param {*} event
   * @memberof FileUploader
   */
  onFilesSelected(event: any) {
    this.onFileChanges(event.target.files);
  }
  onDragOver(event: any) {
    event.preventDefault();
  }

  /**
   * Add new files to the existing files array if not already present.
   * Doesn't replace existing files. Files are considered "the same" if name and size are the same.
   */
  private onFileChanges(files: FileList | File[]) {
    const newFiles: File[] = Array.from(files);

    // Find the files that are not present yet (by name and size)
    const filesToAdd = newFiles.filter((newFile) => {
      return !this.files().some(
        (file) =>
          file.name === newFile.name &&
          file.size === newFile.size &&
          file.lastModified === newFile.lastModified
      );
    });
    // Add filesToAdd to files
    const updatedFiles = [...this.files(), ...filesToAdd];
    this.files.set(updatedFiles);

    this.prepareFiles();
    this.filesSelected.emit(this.files());
  }
  // From drag and drop
  onDropSuccess(event: any) {
    event.preventDefault();
    this.onFileChanges(event.dataTransfer.files);
    // notice the "dataTransfer" used instead of "target"
  }

  removeFile(i: number) {
    this.files.update((currentFiles) =>
      currentFiles.filter((_, index) => index !== i)
    );

    // Do not add already existing files again.
    this.prepareFiles();
    this.filesSelected.emit(this.files());
  }

  prepareFiles() {
    // Reset URL arrays since new files could be added
    this.urls = [];
    this.blobURLs = [];

    if (this.files()) {
      for (let i = 0; i < this.files().length; i++) {
        const file: File = this.files()[i];

        const reader = new FileReader();

        reader.readAsDataURL(file); // read file as data url

        reader.onload = (event) => {
          if (event.target && event.target.result) {
            // called once readAsDataURL is completed
            this.blobURLs.push(event.target.result as any);
          }
        };

        const reader2 = new FileReader();
        reader2.onload = (e: any) => {
          const blob = new Blob([file], {
            type: file.type,
          });
          const url = this.isBrowser ? window.URL.createObjectURL(blob) : '';

          this.urls.push(this.sanitizer.bypassSecurityTrustUrl(url) as any);
        };
        reader2.readAsDataURL(file);
      }
    }
  }
}
