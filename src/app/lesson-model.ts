export interface IFillInTheBlank {
  id: number;
  question: string;
  options: string[];
  answer: number;
}
export interface ITrueFalse {
  id: number;
  question: string;
  answer: boolean;
}

export interface IQuiz {
  id: number;
  question: string;
  options: string[];
  answer: number;
}

export interface IShortAnswer {
  id: number;
  question: string;
  answer: string;
}

export interface ILongAnswer {
  id: number;
  question: string;
  answer: string;
}

export interface ILessonJson {
  id: number;
  name: string;
  originalText: string;
  detailedExplanation: string;
  fillInTheBlanks: IFillInTheBlank[];
  matchTheColumns: string;
  trueAndFalse: ITrueFalse[];
  quiz: IQuiz[];
  shortAnswers: IShortAnswer[];
  longAnswer: ILongAnswer[];
}

export interface ILesson {
  id: number;
  name: string;
  originalText: string;
  detailedExplanation: string;
  fillInTheBlanks: string;
  matchTheColumns: string;
  trueAndFalse: string;
  quiz: string;
  shortAnswers: string;
  longAnswer: string;
}
