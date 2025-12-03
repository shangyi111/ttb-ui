import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms'; // Required for ngModel tests

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let compiled: HTMLElement;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // We only need to import the standalone component itself
      imports: [AppComponent,HttpClientTestingModule,FormsModule],
      // Note: No need for providers here unless AppComponent itself uses services.
    }).compileComponents();
    
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges(); // Detect changes to render the template content
    compiled = fixture.nativeElement as HTMLElement;
  });

  // --- 1. Should Create Test (Required) ---
  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  // --- 2. Test Relevant Structure (New/Modified) ---
  it('should render the LabelFormComponent in its template', () => {
    // 
    // Rationale: Since AppComponent's primary role is to host the LabelFormComponent,
    // we test for the presence of the component's selector ('app-label-form').
    //
    const labelFormComponent = compiled.querySelector('label-form');
    
    expect(labelFormComponent).toBeTruthy();
  });
});