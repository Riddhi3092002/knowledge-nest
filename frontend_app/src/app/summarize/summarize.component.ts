import { Component } from '@angular/core';
import { LearnMateService } from '../services/learn-mate.service';

@Component({
  selector: 'app-summarize',
  templateUrl: './summarize.component.html',
  styleUrl: './summarize.component.css'
})
export class SummarizeComponent {
mode: 'upload' | 'paste' | null = null;
  textInput: string = '';
  summary: string = '';
  loading = false;
  selectedFile: File | null = null;
  selectedFileName: string = '';
  isDragOver = false;


  constructor(private learnmateService: LearnMateService) {}

summarizeText() {
  const trimmedText = this.textInput.trim();
  const wordCount = trimmedText.split(/\s+/).length;

  if (wordCount < 100) {
    alert("Please enter at least 100 words for a meaningful summary.");
    return;
  }
  if (wordCount > 512) {
    alert("Please shorten your input to 512 words or less.");
    return;
  }

  this.loading = true;

  this.learnmateService.summarizeText(trimmedText).subscribe({
    next: (res) => {
      this.summary = res.summary;
      this.loading = false;
    },
    error: (err) => {
      alert(err.error?.detail || "Error summarizing text.");
      this.loading = false;
    }
  });
}

submitFile(): void {
  if (!this.selectedFile) return;

  this.loading = true;

  this.learnmateService.summarizeFile(this.selectedFile).subscribe({
    next: (res) => {
      this.summary = res.summary;
      this.loading = false;
    },
    error: (err) => {
      alert(err.error?.detail || "Error summarizing file.");
      this.loading = false;
    }
  });
}

  

onDragOver(event: DragEvent) {
  event.preventDefault();
  this.isDragOver = true;
}

onDragLeave(event: DragEvent) {
  event.preventDefault();
  this.isDragOver = false;
}

onDrop(event: DragEvent) {
  event.preventDefault();
  this.isDragOver = false;
  if (event.dataTransfer && event.dataTransfer.files.length > 0) {
    const syntheticEvent = {
      target: {
        files: event.dataTransfer?.files
      }
    } as unknown as Event;
    this.onFileSelected(syntheticEvent);
  }
}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
    }
  }

}
