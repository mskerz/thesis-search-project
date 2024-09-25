import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { FilePreviewService } from 'src/app/services/filepreview.service';

@Component({
  selector: 'app-pdfviewer',
  templateUrl: './pdfviewer.component.html',
  styleUrls: ['./pdfviewer.component.scss']
})
export class PdfviewerComponent implements OnInit {
  pdfUrl!: SafeResourceUrl;
  error: string | null = null;

  constructor(
    private filePreview: FilePreviewService,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: { filePath: string }
  ) {}

  ngOnInit(): void {
   }

 
}
