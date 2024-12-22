import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { ILesson, LessonService } from '../lesson-service';

@Component({
  selector: 'app-lesson-content',
  imports: [CommonModule, MatTabsModule, FormsModule],
  templateUrl: './lesson-content.component.html',
  styleUrl: './lesson-content.component.css',
})
export class LessonContentComponent {
  @Input() lessonName: ILesson | null = null;
  lessonContent: ILesson | null = null;

  constructor(private lessonService: LessonService) {}

  ngOnInit(): void {
    if (this.lessonName) {
      // Do something when the component initializes with a lesson
      console.log('Lesson onInit:', this.lessonName);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lessonName']) {
      const currentLesson = changes['lessonName'].currentValue;
      if (currentLesson) {
        // Handle any logic when the lesson changes
        this.lessonContent = this.lessonService.getLessonById(
          this.lessonName!.id
        );
        console.log('Lesson changed:', currentLesson);
      } else {
        // Handle case where lesson is null
        this.lessonContent = null;
        console.log('Lesson is null or removed');
      }
    }
  }
}
