import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-activity-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './activity-form.component.html',
  styleUrl: './activity-form.component.scss'
})
export class ActivityFormComponent {
  userId: string = '';
  isAdded: boolean = false;
  activityForm!: FormGroup;

  constructor(private authService: AuthService,
    public apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId() || '';

    this.isAdded = false;
    this.activityForm = new FormGroup({
      activityType: new FormControl('RUNNING', { nonNullable: true, validators: Validators.required }),
      caloriesBurned: new FormControl(null, [Validators.required, Validators.min(1)]),
      duration: new FormControl(null, [Validators.required, Validators.min(1)]),
      date: new FormControl(this.getTodayDate(), { nonNullable: true, validators: Validators.required })
    });
  }

  onSubmit() {
    console.log(this.activityForm);
    if (this.activityForm.valid) {
      const formValues = this.activityForm.getRawValue();
      const postData = {
        userId: this.userId,
        type: formValues.activityType,
        duration: formValues.duration,
        caloriesBurned: formValues.caloriesBurned,
        startTime: this.formatToIsoDateTime(formValues.date),
        additionalMetrics: {}
      };
      console.log(postData);
      this.isAdded = true;
      this.apiService.addActivity(postData).subscribe(
        (response) => {
          console.log('Activity added successfully:', response);
          setTimeout(() => {
            this.isAdded = false;
          }, 2000);
          this.activityForm.reset();
        },
        (error) => {
          console.error('Error adding activity:', error);
        }
      );

    }
  }

  private getTodayDate(): string {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  }

  private formatToIsoDateTime(dateString: string): string {
  if (!dateString) return '';

  const now = new Date();
  
  // Extract current time components
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');

  // Combine the form date with the current time
  // Result example: "2026-01-16T08:45:30"
  return `${dateString}T${hh}:${mm}:${ss}`;
}

  
}
