import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { FeedbackService } from './feedback.service';
import { ToastrService } from 'ngx-toastr';

type Feedback = {
  trackingNum: string | undefined;
  name: string | undefined;
  surname: string | undefined;
  email: string | undefined;
  tel: string | undefined;
  rating: number | undefined;
  message: string | undefined;
}

@Component({
  selector: 'app-feedback',
  imports: [NgIf, MatIconModule, NgClass, FormsModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css',
  standalone: true
})
export class FeedbackComponent {
  public stepNum: number;
  public moods: number[];
  public selectedMood: number | undefined;
  public trackingNumber: string | undefined;
  public name: string | undefined;
  public surname: string | undefined;
  public email: string | undefined;
  public tel: string | undefined;
  public message: string | undefined;

  constructor(private feedbackService: FeedbackService, private toastr: ToastrService) {
    this.stepNum = 1;
    this.moods = [1, 2, 3, 4, 5];
    this.selectedMood;
    this.trackingNumber;
    this.name;
    this.surname;
    this.email;
    this.tel;
    this.message;
  }

  setStepNum(step: number) {
    this.stepNum = step;
  }

  setMood(mood: number) {
    this.selectedMood = mood;
  }

  submitFeedback(): void {
    const feedback: Feedback = {
      trackingNum: this.trackingNumber,
      name: this.name,
      surname: this.surname,
      email: this.email,
      tel: this.tel || undefined,
      rating: this.selectedMood,
      message: this.message
    };

    this.feedbackService.createFeedback(feedback).subscribe({
      next: () => {
        this.toastr.success('Değerlendirme başarıyla gönderildi!');
        this.resetForm();
      },
      error: (error) => {
        console.error('Feedback submission error:', error);
        this.toastr.error('Değerlendirme gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
        this.resetForm();
      }
    });
  }

  resetForm(): void {
    this.stepNum = 1;
    this.trackingNumber = '';
    this.name = '';
    this.surname = '';
    this.email = '';
    this.tel = '';
    this.selectedMood = undefined;
    this.message = '';
  }
}