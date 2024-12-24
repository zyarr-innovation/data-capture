import { Component, EventEmitter } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { LessonListComponent } from './lesson-list/lesson-list.component';
import { LessonContentComponent } from './lesson-content/lesson-content.component';
import { MatMenuModule } from '@angular/material/menu';
import { LessonService } from './lesson-service';
import { ILessonJson } from './lesson-model';

@Component({
  selector: 'app-root',
  imports: [
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    LessonListComponent,
    LessonContentComponent,
    MatMenuModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'data-capture';
  lessons: ILessonJson[] = [];
  selectedLesson: ILessonJson | null = null;
  selectedFilePath: string = '';

  constructor(private lessonService: LessonService) {}

  ngOnInit() {}

  async createNewLessons() {
    this.lessonService.createNewLesson();
    this.lessons = [];
    this.selectedLesson = null;
  }

  loadLessons() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';

    fileInput.onchange = (event: any) => {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        this.selectedFilePath = selectedFile.path || selectedFile.name;
        this.lessonService.loadLessons(this.selectedFilePath).subscribe(
          (data) => {
            this.lessons = data;
            if (this.lessons.length > 0) {
              this.selectLesson(this.lessons[0]);
            }
            console.log('Lessons loaded successfully!');
          },
          (error) => console.error('Error loading lessons:', error)
        );
      }
    };

    fileInput.click();
  }

  async saveAsLessons() {
    try {
      const newFilePicker = (window as any).showSaveFilePicker;
      if (!newFilePicker) {
        throw new Error(
          'New File Picker API is not supported in this browser.'
        );
      }

      const fileHandle = await newFilePicker({
        types: [
          {
            description: 'JSON Files',
            accept: { 'application/json': ['.json'] },
          },
        ],
      });

      this.selectedFilePath = fileHandle.name;
      const writable = await fileHandle.createWritable();
      const lessonsData = this.lessonService.getAllLessons();
      await writable.write(JSON.stringify({ lessons: lessonsData }, null, 2));
      await writable.close();

      console.log('New lessons file created successfully!');
    } catch (error) {
      console.error('Error creating new lessons file:', error);
    }
  }

  async addLesson() {
    const lessonsData = this.lessonService.addLesson();
    this.lessons.push(lessonsData);
    this.selectedLesson = lessonsData;
  }

  async deleteLesson() {
    const lessonsData = this.lessonService.deleteLesson(
      this.selectedLesson!.id
    );
    const index = this.lessons.findIndex(
      (lesson) => lesson.id === this.selectedLesson!.id
    );

    this.lessons.splice(index, 1);
    if (this.lessons.length) {
      this.selectedLesson = this.lessons[0];
    } else {
      this.selectedLesson = null;
    }
  }

  selectLesson(inputLesson: ILessonJson) {
    this.selectedLesson = inputLesson;
  }

  toggleSidenav(sidenav: any) {
    sidenav.toggle();
  }
}
