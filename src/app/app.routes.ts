import { Routes } from '@angular/router';
import { LessonListComponent } from './lesson-list/lesson-list.component';
import { LessonContentComponent } from './lesson-content/lesson-content.component';

export const routes: Routes = [
  { path: '', component: LessonListComponent },
  { path: 'lesson/:id', component: LessonContentComponent },
];
