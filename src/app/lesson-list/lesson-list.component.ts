import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { LessonService } from '../lesson-service';
import { ILesson } from '../lesson-model';

@Component({
  selector: 'app-lesson-list',
  imports: [CommonModule, MatListModule],
  templateUrl: './lesson-list.component.html',
  styleUrl: './lesson-list.component.css',
})
export class LessonListComponent {
  @Input() lessons: ILesson[] = [];
  @Input() selectedLesson: ILesson | null = null;
  @Output() lessonSelected = new EventEmitter<ILesson>();

  selectLesson(lesson: ILesson) {
    this.lessonSelected.emit(lesson);
  }

  isSelected(currentLesson: ILesson): boolean {
    return this.selectedLesson?.id === currentLesson.id;
  }
}
