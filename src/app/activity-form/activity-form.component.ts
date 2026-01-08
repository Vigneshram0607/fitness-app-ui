import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-activity-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './activity-form.component.html',
  styleUrl: './activity-form.component.scss'
})
export class ActivityFormComponent {

  isAdded = false;
  activityForm = new FormGroup({
    activityType: new FormControl('RUNNING', { nonNullable: true, validators: Validators.required }),
    caloriesBurned: new FormControl(null, [Validators.required, Validators.min(1)]),
    duration: new FormControl(null, [Validators.required, Validators.min(1)]),
    date: new FormControl(this.getTodayDate(), { nonNullable: true, validators: Validators.required })
  });

  onSubmit() {
    console.log(this.activityForm);
    if (this.activityForm.valid) {
      const formValues = this.activityForm.getRawValue();
      const postData = {
        userId: '742e2f3e-b243-4329-8c6b-e6a23a96baa2',
        type: formValues.activityType,
        duration: formValues.duration,
        caloriesBurned: formValues.caloriesBurned,
        startTime: this.formatToIsoDateTime(formValues.date),
        additionalMetrics: {}
      };
      console.log(postData);
      this.isAdded = true;
      setTimeout(() => {
        this.isAdded = false;
      }, 2000);
    }
  }

  private getTodayDate(): string {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  }

  private formatToIsoDateTime(dateStr: string): string {
    return `${dateStr}T00:00:00`;
  }
}
