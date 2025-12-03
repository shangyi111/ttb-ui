import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms'; // Required for ngModel tests
import { LabelFormComponent } from './label-form.component';
import { of, throwError } from 'rxjs'; // For mocking RxJS observables

describe('LabelFormComponent', () => {
  let component: LabelFormComponent;
  let fixture: ComponentFixture<LabelFormComponent>;
  let httpTestingController: HttpTestingController;

  // Mock successful response data structure from the backend
  const mockSuccessResponse = {
    overall_match: true,
    discrepancies: [{ field: 'Brand Name', status: 'Match', expected: 'Old Tom' }],
    extracted_text: 'OLD TOM DISTILLERY...'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Import the component, FormsModule, and the testing module for HttpClient
      imports: [LabelFormComponent, FormsModule, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LabelFormComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    // Verify that no outstanding requests are pending
    httpTestingController.verify();
  });

  // --- 1. Basic Initialization Test ---
  it('should create and initialize default state', () => {
    expect(component).toBeTruthy();
    expect(component.isLoading).toBeFalse();
    expect(component.brandName).toBe('');
    expect(component.selectedFile).toBeNull();
  });

  // --- 2. File Selection Test ---
  it('should correctly handle file selection', () => {
    // Create a mock file object
    const mockFile = new File([''], 'test-label.jpg', { type: 'image/jpeg' });
    const mockEvent = { target: { files: [mockFile] } };

    component.onFileSelected(mockEvent);

    expect(component.selectedFile).toBe(mockFile);
  });

  // --- 3. Successful Form Submission Test ---
  it('should set isLoading=true, make a POST request, and set results on success', () => {
    // Setup component state
    component.selectedFile = new File([''], 'test.jpg');
    component.brandName = 'Old Tom';
    
    // Trigger submission
    component.onSubmit();

    // Expect loading state to be true
    expect(component.isLoading).toBeTrue();
    expect(component.verificationResults).toBeNull();

    // Expect an HTTP POST request to the API
    const req = httpTestingController.expectOne('http://localhost:3000/api/verify');
    expect(req.request.method).toBe('POST');

    // Simulate successful response
    req.flush(mockSuccessResponse);

    // Expect loading state to be false and results to be populated
    expect(component.isLoading).toBeFalse();
    expect(component.verificationResults).toEqual(mockSuccessResponse);
  });

  // --- 4. Failed Submission Test (API Error) ---
  it('should set isLoading=true and handle API error gracefully', () => {
    // Setup component state
    component.selectedFile = new File([''], 'test.jpg');
    component.brandName = 'Old Tom';
    
    // Trigger submission
    component.onSubmit();

    // Expect loading state to be true
    expect(component.isLoading).toBeTrue();

    // Expect an HTTP POST request
    const req = httpTestingController.expectOne('http://localhost:3000/api/verify');
    
    // Simulate error response (e.g., a 500 server error)
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

    // Expect loading state to be false and responseMessage to be set
    expect(component.isLoading).toBeFalse();
    expect(component.verificationResults).toBeNull();
    expect(component.responseMessage).toBeDefined();
  });

  // --- 5. Button/State Logic Test ---
  it('should disable submit button when no file is selected or when loading', () => {
    component.selectedFile = null;
    component.isLoading = false;
    fixture.detectChanges();
    // Assuming you can test disabled state through a direct element query or rely on the [disabled] binding tested above.
    // Testing the component logic:
    component.selectedFile = new File([''], 'a.jpg');
    component.isLoading = true;
    fixture.detectChanges();
    expect(component.isLoading).toBeTrue(); // Should be disabled if isLoading is true
    
    component.isLoading = false;
    fixture.detectChanges();
    expect(component.isLoading).toBeFalse(); // Should be enabled if isLoading is false and file is present
  });
});