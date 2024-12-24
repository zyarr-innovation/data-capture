import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ILessonJson } from './lesson-model';
import { LessonUtilityService } from './lesson-utility.service';

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  lessons: any[] = [];
  constructor(private http: HttpClient,
    private lessonUtilityService: LessonUtilityService
  ) {}

  loadLessons(filePath: string): Observable<ILessonJson[]> {
    return this.http.get<{ lessons: ILessonJson[] }>("./" + filePath).pipe(
      map((data) => {
        this.lessons = data.lessons || [];
        return this.lessons;
      })
    );
  }

  getLessonById(id: number): ILessonJson {
    const lesson = this.lessons.find((lesson) => lesson.id === id);
    return lesson;
  }

  getAllLessons() {
    return this.lessons;
  }

  createNewLesson() {
    this.lessons = [];
    return this.lessons;
  }

  addLesson(): ILessonJson {
    const newLesson = this.lessonUtilityService.getEmptyLessonJson();
    newLesson.id = this.lessons.length + 1;
    newLesson.name = `Lesson ${this.lessons.length + 1}`;
    this.lessons.push(newLesson);
    return newLesson;
  }

  deleteLesson(id: number) {
    const index = this.lessons.findIndex((lesson) => lesson.id === id);
    this.lessons.splice(index, 1);
  }

}
