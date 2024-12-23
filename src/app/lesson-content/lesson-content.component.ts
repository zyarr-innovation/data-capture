import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
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
  @Input()
  lessonName: ILesson | null = null;

  @Output()
  scrollPercentageChange = new EventEmitter<number>();

  lessonContent: ILesson | null = null;
  lessonJsonContent: ILessonJson | null = null;

  @ViewChild('leftoriginalText')
  leftoriginalText!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('rightoriginalText')
  rightoriginalText!: ElementRef<HTMLTextAreaElement>;

  @ViewChild('leftdetailedExplanation')
  leftdetailedExplanation!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('rightdetailedExplanation')
  rightdetailedExplanation!: ElementRef<HTMLTextAreaElement>;

  @ViewChild('leftfillInTheBlanks')
  leftfillInTheBlanks!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('rightfillInTheBlanks')
  rightfillInTheBlanks!: ElementRef<HTMLTextAreaElement>;

  @ViewChild('leftmatchTheColumns')
  leftmatchTheColumns!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('rightmatchTheColumns')
  rightmatchTheColumns!: ElementRef<HTMLTextAreaElement>;

  @ViewChild('lefttrueAndFalse')
  lefttrueAndFalse!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('righttrueAndFalse')
  righttrueAndFalse!: ElementRef<HTMLTextAreaElement>;

  @ViewChild('leftquiz')
  leftquiz!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('rightquiz')
  rightquiz!: ElementRef<HTMLTextAreaElement>;

  @ViewChild('leftshortAnswers')
  leftshortAnswers!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('rightshortAnswers')
  rightshortAnswers!: ElementRef<HTMLTextAreaElement>;

  @ViewChild('leftlongAnswer')
  leftlongAnswer!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('rightlongAnswer')
  rightlongAnswer!: ElementRef<HTMLTextAreaElement>;

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

  onScrollLeft(elementName: string): void {
    let sourceElement = this.leftoriginalText.nativeElement;
    let targetElement = this.rightoriginalText.nativeElement;
    switch (elementName) {
      case 'detailedExplanation':
        sourceElement = this.leftdetailedExplanation.nativeElement;
        targetElement = this.rightdetailedExplanation.nativeElement;
        break;
      case 'fillInTheBlanks':
        sourceElement = this.leftfillInTheBlanks.nativeElement;
        targetElement = this.rightfillInTheBlanks.nativeElement;
        break;
      case 'matchTheColumns':
        sourceElement = this.leftmatchTheColumns.nativeElement;
        targetElement = this.rightmatchTheColumns.nativeElement;
        break;
      case 'trueAndFalse':
        sourceElement = this.lefttrueAndFalse.nativeElement;
        targetElement = this.righttrueAndFalse.nativeElement;
        break;
      case 'quiz':
        sourceElement = this.leftquiz.nativeElement;
        targetElement = this.rightquiz.nativeElement;
        break;
      case 'shortAnswers':
        sourceElement = this.leftshortAnswers.nativeElement;
        targetElement = this.rightshortAnswers.nativeElement;
        break;
      case 'longAnswer':
        sourceElement = this.leftoriginalText.nativeElement;
        targetElement = this.rightoriginalText.nativeElement;
        break;
    }
    const scrollPercentage =
      (sourceElement.scrollTop /
        (sourceElement.scrollHeight - sourceElement.clientHeight)) *
      100;

    targetElement.scrollTop =
      ((targetElement.scrollHeight - targetElement.clientHeight) *
        scrollPercentage) /
      100;
  }
}
