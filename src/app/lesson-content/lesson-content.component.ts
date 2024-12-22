import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { LessonService } from '../lesson-service';
import { ILesson, ILessonJson } from '../lesson-model';
import { MatIconModule } from '@angular/material/icon';
import { LessonUtilityService } from '../lesson-utility.service';

@Component({
  selector: 'app-lesson-content',
  imports: [
    CommonModule,
    MatTabsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './lesson-content.component.html',
  styleUrl: './lesson-content.component.css',
})
export class LessonContentComponent {
  @Input() lessonName: ILesson | null = null;
  lessonContent: ILesson | null = null;
  lessonJsonContent: ILessonJson | null = null;

  constructor(
    private lessonService: LessonService,
    private lessonUtility: LessonUtilityService
  ) {}

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

  onConvert(activeTabIndex: number | null): void {
    if (null == activeTabIndex) {
      return;
    }

    if (null == this.lessonJsonContent) {
      this.lessonJsonContent = this.lessonUtility.getEmptyLessonJson();
    }

    const tabMappings = [
      'originalText',
      'detailedExplanation',
      'fillInTheBlanks',
      'matchTheColumns',
      'trueAndFalse',
      'quiz',
      'shortAnswers',
      'longAnswer',
    ];

    const activeTabKey = tabMappings[activeTabIndex];
    switch (activeTabKey) {
      case 'originalText':
        if (this.lessonContent?.originalText) {
          this.lessonJsonContent.originalText = this.lessonContent.originalText;
        }
        break;
      case 'detailedExplanation':
        if (this.lessonContent?.detailedExplanation) {
          this.lessonJsonContent.detailedExplanation =
            this.lessonContent.detailedExplanation;
        }
        break;
      case 'fillInTheBlanks':
        if (this.lessonContent?.fillInTheBlanks) {
          this.lessonJsonContent.fillInTheBlanks =
            this.lessonUtility.parseQuestionsFillInTheBlank(
              this.lessonContent.fillInTheBlanks
            );
        }
        break;
      case 'matchTheColumns':
      case 'trueAndFalse':
        if (this.lessonContent?.trueAndFalse) {
          this.lessonJsonContent.trueAndFalse =
            this.lessonUtility.parseTrueFalseData(
              this.lessonContent.trueAndFalse
            );
        }
        break;
      case 'quiz':
        if (this.lessonContent?.quiz) {
          this.lessonJsonContent.quiz = this.lessonUtility.parseQuizData(
            this.lessonContent.quiz
          );
        }
        break;
      case 'shortAnswers':
        if (this.lessonContent?.shortAnswers) {
          this.lessonJsonContent.shortAnswers =
            this.lessonUtility.parseShortQuestionAnswerData(
              this.lessonContent.shortAnswers
            );
        }
        break;
      case 'longAnswer':
        if (this.lessonContent?.longAnswer) {
          this.lessonJsonContent.longAnswer =
            this.lessonUtility.parseLongQuestionAnswerData(
              this.lessonContent.longAnswer
            );
        }
        break;
    }
  }
}
