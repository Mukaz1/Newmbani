import { Component, inject, OnInit } from '@angular/core';
import { FileViewer } from '../file-viewer/file-viewer';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { FilesService } from '../../common/services/files.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-view-file-via-modal',
  templateUrl: './view-file-via-modal.html',
  styleUrls: ['./view-file-via-modal.scss'],
  imports: [FileViewer],
})
export class ViewFileViaModal implements OnInit {
  data = inject<{
    url: string;
    fileId: string;
  }>(DIALOG_DATA);
  readonly dialogRef = inject<DialogRef<ViewFileViaModal>>(DialogRef);

  fileName: string | undefined;
  url: string | undefined;
  fileId: string | undefined;
  fileUrl: string | undefined;

  private readonly filesService = inject(FilesService);
  constructor() {
    this.url = this.data.url;
    this.fileId = this.data.fileId;
  }

  ngOnInit() {
    // this.fileId
    if (this.fileId) {
      this.filesService
        .getFile(this.fileId)
        .pipe(take(1))
        .subscribe((response) => {
          this.url = response.data.url;
        });
    }
  }
}
