import { Injectable } from '@angular/core';
import { BaseApiUrl } from '../../url.constants';
import { HttpClient } from '@angular/common/http';

type Feedback = {
  trackingNum: string | undefined;
  name: string | undefined;
  surname: string | undefined;
  email: string | undefined;
  tel: string | undefined;
  rating: number | undefined;
  message: string | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  private apiUrl = `${BaseApiUrl}/api/Feedback`;

  constructor(private HttpClient: HttpClient) { }

  createFeedback(feedback: Feedback) {
    const feebackData = {
      trackingNum: feedback.trackingNum,
      name: feedback.name,
      surname: feedback.surname,
      email: feedback.email,
      phone: feedback.tel,
      rating: feedback.rating,
      message: feedback.message,
      date: new Date().toISOString()
    }

    return this.HttpClient.post(this.apiUrl, feebackData);
  }

}