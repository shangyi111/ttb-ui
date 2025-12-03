
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
  
  // Form fields
  brandName: string = '';
  productClass: string = ''; 
  alcoholContent: number | null = null;
  netContents: string = '';

  // File handling
  verificationResults: any = null;
  selectedFile: File | null = null;
  responseMessage: any = null;
  isLoading: boolean = false;
  
  // Capture the selected file object
  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  // Handle form submission
  onSubmit(): void {
    if (!this.selectedFile) return;
    this.verificationResults = null;
    this.responseMessage = null;
    this.isLoading = true;

    // Use FormData to combine text fields and the binary file
    const formData = new FormData();
    formData.append('brandName', this.brandName);
    formData.append('productClass', this.productClass);
    formData.append('alcoholContent', String(this.alcoholContent)); 
    formData.append('netContents', this.netContents);
    formData.append('labelImage', this.selectedFile, this.selectedFile.name);

   this.http.post(`${environment.apiUrl}/api/verify`, formData)
      .subscribe({
        next: (res: any) => { // Use 'any' for now for simplicity
          this.verificationResults = res; // Store the detailed results
          this.responseMessage = null; // Clear old error message if needed
          this.isLoading = false;
        },
        error: (err) => {
          this.verificationResults = null; // Clear previous results
          this.responseMessage = err.error || { message: 'An unknown error occurred.' };
          this.isLoading = false;
          console.error(err);
        }
      });
  }
}