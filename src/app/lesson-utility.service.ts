import { Injectable } from '@angular/core';
import {
  IFillInTheBlank,
  ILesson,
  ILessonJson,
  ILongAnswer,
  IMatchTheColumnData,
  IQuiz,
  IShortAnswer,
  ITrueFalse,
} from './lesson-model';

@Injectable({
  providedIn: 'root',
})
export class LessonUtilityService {
  constructor() {}

  getEmptyLesson(): ILesson {
    const newLesson: ILesson = {
      id: 0,
      name: '',
      originalText: '',
      detailedExplanation: '',
      fillInTheBlanks: '',
      matchTheColumns: '',
      trueAndFalse: '',
      quiz: '',
      shortAnswers: '',
      longAnswer: '',
    };

    return newLesson;
  }

  getEmptyLessonJson(): ILessonJson {
    return {
      id: 0,
      name: 'lesson',
      originalText: '',
      detailedExplanation: '',
      fillInTheBlanks: [
        {
          id: 0,
          question: '',
          options: [],
          answer: 0,
        },
      ],
      matchTheColumns: [
        {
          id: 0,
          columna: [],
          columnb: [],
        },
      ],
      trueAndFalse: [
        {
          id: 0,
          question: '',
          answer: false,
        },
      ],
      quiz: [
        {
          id: 0,
          question: '',
          options: [],
          answer: 0,
        },
      ],
      shortAnswers: [
        {
          id: 0,
          question: '',
          answer: '',
        },
      ],
      longAnswer: [
        {
          id: 0,
          question: '',
          answer: '',
        },
      ],
    } as ILessonJson;
  }

  parseQuestionsFillInTheBlankOrQuiz(
    fileContent: string
  ): IFillInTheBlank[] | IQuiz[] | any[] {
    try {
      fileContent = fileContent.replace(/\*\*/g, '');

      const uniqueQuestions: any = [];
      return fileContent
        .split('\r\n\r\n')
        .filter((section: any) => section.trim())
        .map((section: any) => {
          const sectionLines = section.trim().split('\n');

          //------------------------------| id
          const id = parseInt(
            sectionLines[0].match(/^(\d+)\./)?.[1] || '0',
            10
          );
          if (id == 0) {
            console.log(
              'Id is zero parsing problem, neglecting section: ' + section
            );
            return {};
          }

          //------------------------------| question
          const question = sectionLines[0].replace(/^\d+\.\s*/, '').trim();

          const isDuplicate = uniqueQuestions.includes(question);
          if (isDuplicate) {
            console.log('Duplicate question, neglecting section: ' + section);
            return {};
          } else {
            uniqueQuestions.push(question);
          }

          //------------------------------| options
          const options = sectionLines
            .slice(1, 5)
            .map((line: any) =>
              line.replace(/^\s*[a-d|A-D][\)|\.]\s*/, '').trim()
            );

          //------------------------------| answer
          const answerLine = sectionLines.find((line: any) =>
            line.includes('Answer:')
          );
          console.log(answerLine.match(/\s*Answer:\s*([a-d|A-D])/i));

          const answer = answerLine
            ? ['a', 'b', 'c', 'd'].indexOf(
                answerLine
                  .match(/\s*Answer:\s*([a-d|A-D])/i)?.[1]
                  .toLowerCase() || ''
              ) + 1
            : 0;

          //------------------------------| return object
          return { id, question, options, answer } as IFillInTheBlank | IQuiz;
        })
        .filter((item) => Object.keys(item).length !== 0);
    } catch (error) {
      console.error('Error reading file:', error);
      return [];
    }
  }

  parseTrueFalseData(fileContent: string): ITrueFalse[] | any[] {
    const uniqueQuestions: any = [];
    fileContent = fileContent.replace(/\*\*/g, '');

    return fileContent
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .map((line) => {
        //------------------------------| id
        const id = parseInt(line.match(/^(\d+)\./)?.[1] || '0', 10);
        if (id == 0) {
          console.log('Id is zero parsing problem, neglecting line: ' + line);
          return {};
        }

        const question = line
          .replace(/^\d+\.\s*/, '')
          .replace(/\s*\(True\)|\(False\)/i, '')
          .trim();

        const isDuplicate = uniqueQuestions.includes(question);
        if (isDuplicate) {
          console.log('Duplicate question, neglecting line: ' + line);
          return {};
        } else {
          uniqueQuestions.push(question);
        }

        const answer = /\(True\)/i.test(line) ? true : false;
        return { id, question, answer };
      })
      .filter((item) => Object.keys(item).length !== 0);
  }

  parseShortLongQAData(
    fileContent: string
  ): IShortAnswer[] | ILongAnswer[] | any[] {
    const uniqueQuestions: any = [];
    fileContent = fileContent.replace(/\*\*/g, '');

    return fileContent
      .split('\r\n\r\n')
      .filter((section) => section.trim().length > 0)
      .map((section, index) => {
        const id = parseInt(section.match(/^(\d+)\./)?.[1] || '0', 10);
        if (id == 0) {
          console.log(
            'Id is zero parsing problem, neglecting section: ' + section
          );
          return {};
        }

        const questionSection = section.split(/^\d+\./);
        const qaSection = questionSection[1].split('Answer:');

        let question = qaSection[0].trim();
        if (question.startsWith('Question:')) {
          question = question.replace('Question:', '').trim();
        }

        const answer = qaSection[1].trim();
        const isDuplicate = uniqueQuestions.includes(question);
        if (isDuplicate) {
          console.log('Duplicate question, neglecting section: ' + section);
          return {};
        } else {
          uniqueQuestions.push(question);
        }

        return { id, question, answer };
      })
      .filter((item) => Object.keys(item).length !== 0);
  }

  parseMathTheColumnData(data: string): IMatchTheColumnData[] {
    const lines = data.split('\n');

    let columnA: string[] = [];
    let columnB: string[] = [];
    const results: IMatchTheColumnData[] = [];

    let isTable = false;
    let isAnswers = false;
    let index = 1;

    lines.forEach((line) => {
      if (line.includes('Column A') && line.includes('Column B')) {
        isTable = true;
        return;
      }

      if (isTable) {
        const match = line.match(
          /^\s*\|\s*[1-4]\.\s+(.+?)\s*\|\s*[A-D]\.\s+(.+?)\s*\|*\s*$/
        );
        if (match) {
          columnA.push(match[1].trim());
          columnB.push(match[2].trim());
        }
      }

      if (line.startsWith('**Answers:**')) {
        isAnswers = true;
        return;
      }

      if (isAnswers) {
        const regex = /\s*(\d)\s*-\s*([A-D])\s*,*\s*/g;
        const answerMatch = line.match(regex);
        if (answerMatch) {
          let matches;
          const answerList = [];
          while ((matches = regex.exec(line)) !== null) {
            const answerNumber = { A: 1, B: 2, C: 3, D: 4 }[matches[2]];
            answerList.push({
              colAIndex: +matches[1],
              colBIndex: answerNumber,
            });
          }

          const reorganizedColumnA: string[] = [];
          const reorganizedColumnB: string[] = [];

          answerList.forEach((answer) => {
            reorganizedColumnA.push(columnA[answer.colAIndex - 1]); // Adjust for 1-based index
            reorganizedColumnB.push(columnB[answer.colBIndex! - 1]); // Adjust for 1-based index
          });

          results.push({
            id: index++,
            columna: reorganizedColumnA,
            columnb: reorganizedColumnB,
          });

          isTable = false;
          isAnswers = false;
          columnA = [];
          columnB = [];
        }
      }
    });

    return results;
  }
}
