import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { FeedbackService } from './feedback/feedback.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AppComponent,
  ],
  providers: [FeedbackService]
})
export class AppModule { }
