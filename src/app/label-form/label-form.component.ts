
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'label-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './label-form.component.html',
  styleUrl: './label-form.component.scss'
})
export class LabelFormComponent {
  private http = inject(HttpClient);

  verificationResults: any = null;
  
  // Form fields
  brandName: string = '';
  alcoholContent: number | null = null;

  // File handling
  selectedFile: File | null = null;
  responseMessage: any = null;
  
  // Capture the selected file object
  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  // Handle form submission
  onSubmit(): void {
    if (!this.selectedFile) return;

    // Use FormData to combine text fields and the binary file
    const formData = new FormData();
    formData.append('brandName', this.brandName);
    // Convert number to string for form data payload
    formData.append('alcoholContent', String(this.alcoholContent)); 
    
    // IMPORTANT: The key 'labelImage' MUST match the name in upload.single('labelImage') on the Node.js backend.
    formData.append('labelImage', this.selectedFile, this.selectedFile.name);

   this.http.post(`${environment.apiUrl}/api/verify`, formData)
      .subscribe({
        next: (res: any) => { // Use 'any' for now for simplicity
          this.verificationResults = res; // Store the detailed results
          this.responseMessage = null; // Clear old error message if needed
        },
        error: (err) => {
          this.verificationResults = null; // Clear previous results
          this.responseMessage = err.error || { message: 'An unknown error occurred.' };
          console.error(err);
        }
      });
  }
}