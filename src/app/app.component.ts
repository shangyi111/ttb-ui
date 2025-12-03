import { Component } from '@angular/core';
import { LabelFormComponent } from './label-form/label-form.component';

@Component({
  selector: 'app-root',
  imports: [LabelFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ttb-verifier-app';
}
