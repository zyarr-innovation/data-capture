import { Injectable } from '@angular/core';
import { ILesson, ILessonJson, IMatchTheColumnData } from './lesson-model';

@Injectable({
  providedIn: 'root',
})
export class LessonUtilityService {
  constructor() {}

  getEmptyLesson(): ILesson {
     const newLesson: ILesson = {
          id: 0,
          name: "",
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
      matchTheColumns: [{
        id: 0,
        columna: [],
        columnb: []
      }],
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

  parseQuestionsFillInTheBlank(data: string) {
    try {
      return data
        .split('\n\n')
        .filter((section: any) => section.trim())
        .map((section: any) => {
          const lines = section.trim().split('\n');
          const id = parseInt(lines[0].match(/^(\d+)/)?.[1] || '0', 10);
          const question = lines[0]
            .replace(/^\d+\.\s*/, '')
            .replace(/\*\*/g, '')
            .trim();
          const options = lines
            .slice(1, 5)
            .map((line: any) => line.replace(/^\s*[a-d]\)\s*/, '').trim());
          const answerLine = lines.find((line: any) =>
            line.startsWith('**Answer:**')
          );
          const answer = answerLine
            ? ['a', 'b', 'c', 'd'].indexOf(
                answerLine
                  .match(/\*\*Answer:\*\*\s*([a-d])/i)?.[1]
                  .toLowerCase() || ''
              ) + 1
            : 0;
          return { id, question, options, answer };
        });
    } catch (error) {
      console.error('Error reading file:', error);
      return [];
    }
  }

  parseTrueFalseData(data: string) {
    return data
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .map((line) => {
        const id = parseInt(line.match(/^(\d+)\./)?.[1] || '0', 10);
        const question = line
          .replace(/^\d+\.\s*/, '')
          .replace(/\*\*/g, '')
          .replace(/\s*\(True\)|\(False\)/i, '')
          .trim();
        const answer = /\(True\)/i.test(line) ? true : false;
        return { id, question, answer };
      });
  }

  parseQuizData(data: string) {
    return data
      .split('\n')
      .filter((line: any) => line.trim().length > 0)
      .reduce((acc, line) => {
        if (/^\d+\./.test(line)) {
          const id = parseInt(line.match(/^(\d+)\./)?.[1] || '0', 10);
          const question = line.replace(/^\d+\.\s*/, '').trim();
          acc.push({ id, question, options: [], answer: 0 });
        } else if (/^\s*[A-D]\./.test(line)) {
          const current = acc[acc.length - 1];
          if (current) {
            current.options.push(line.replace(/^\s*[A-D]\.\s*/, '').trim());
          }
        } else if (/^\s*Correct Answer:/.test(line)) {
          const current = acc[acc.length - 1];
          if (current) {
            const answerLetter = line
              .match(/Correct Answer:\s*([A-D])/i)?.[1]
              .toUpperCase();
            current.answer = answerLetter
              ? ['A', 'B', 'C', 'D'].indexOf(answerLetter) + 1
              : 0;
          }
        }
        return acc;
      }, [] as { id: number; question: string; options: string[]; answer: number }[]);
  }

  parseShortQuestionAnswerData(data: string) {
    return data
      .split('\n\n')
      .filter((section) => section.trim().length > 0)
      .map((section, index) => {
        const id = index + 1;
        const questionMatch = section.match(/\s*\*\*Question:\*\*\s*(.+)/i);
        const answerMatch = section.match(/\s*\*\*Answer:\*\*\s*(.+)/i);
        const question = questionMatch ? questionMatch[1].trim() : '';
        const answer = answerMatch ? answerMatch[1].trim() : '';
        return { id, question, answer };
      });
  }

  parseLongQuestionAnswerData(data: string) {
    return data
      .split('\n\n')
      .filter((section) => section.trim().length > 0)
      .map((section, index) => {
        const id = index + 1;
        const questionMatch = section.match(/^\d+\.\s*\*\*(.+?)\*\*/);
        const answerMatch = section.match(/\*\*Answer\*\*:\s*(.+)/i);
        const question = questionMatch ? questionMatch[1].trim() : '';
        const answer = answerMatch ? answerMatch[1].trim() : '';
        return { id, question, answer };
      });
  }

  parseMathTheColumnData (data: string): IMatchTheColumnData[] {
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
        const match = line.match(/^\s*\|\s*[1-4]\.\s+(.+?)\s*\|\s*[A-D]\.\s+(.+?)\s*\|*\s*$/);
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
              answerList.push({ colAIndex: +matches[1], colBIndex: answerNumber });
          }
  
          const reorganizedColumnA: string[] = [];
          const reorganizedColumnB: string[] = [];
  
          answerList.forEach(answer => {
              reorganizedColumnA.push(columnA[answer.colAIndex - 1]); // Adjust for 1-based index
              reorganizedColumnB.push(columnB[answer.colBIndex! - 1]); // Adjust for 1-based index
          });
  
          results.push({
              id: index++,
              columna: reorganizedColumnA,
              columnb: reorganizedColumnB
          });
  
          isTable = false;
          isAnswers = false;
          columnA = [];
          columnB = [];
        }
      }
    });
  
    return results;
  };
}
