import { Injectable } from '@angular/core';
import { BaseApiUrl } from '../../url.constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private apiUrl = `${BaseApiUrl}/api/Feedback/fetch`;

  constructor(private HttpClient: HttpClient) { }

  fetchFeedbacks() {
    return this.HttpClient.get(this.apiUrl);
  }
}
