import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ILesson } from './lesson-model';

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  lessons: any[] = [];
  constructor(private http: HttpClient) {}

  loadLessons(filePath: string): Observable<ILesson[]> {
    return this.http.get<{ lessons: ILesson[] }>(filePath).pipe(
      map((data) => {
        this.lessons = data.lessons || [];
        return this.lessons;
      })
    );
  }

  getLessonById(id: number): ILesson {
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

  addLesson(): ILesson {
    const newLesson: ILesson = {
      id: this.lessons.length + 1,
      name: `Lesson ${this.lessons.length + 1}`,
      originalText: '',
      detailedExplanation: '',
      fillInTheBlanks: '',
      matchTheColumns: '',
      trueAndFalse: '',
      quiz: '',
      shortAnswers: '',
      longAnswer: '',
    };
    this.lessons.push(newLesson);
    return newLesson;
  }

  deleteLesson(id: number) {
    const index = this.lessons.findIndex((lesson) => lesson.id === id);
    this.lessons.splice(index, 1);
  }

  saveLessons(jsonFilePath: string): Observable<void> {
    return this.http.post<void>(jsonFilePath, { lessons: this.lessons });
  }
}
