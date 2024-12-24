import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { ILessonJson } from '../lesson-model';

@Component({
  selector: 'app-lesson-list',
  imports: [CommonModule, MatListModule],
  templateUrl: './lesson-list.component.html',
  styleUrl: './lesson-list.component.css',
})
export class LessonListComponent {
  @Input() lessons: ILessonJson[] = [];
  @Input() selectedLesson: ILessonJson | null = null;
  @Output() lessonSelected = new EventEmitter<ILessonJson>();

  selectLesson(lesson: ILessonJson) {
    this.lessonSelected.emit(lesson);
  }

  isSelected(currentLesson: ILessonJson): boolean {
    return this.selectedLesson?.id === currentLesson.id;
  }
}
