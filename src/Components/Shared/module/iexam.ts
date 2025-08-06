export interface Iexam {
  questions: any;
  id?: number;
  title:string;
  time:number;
  numberOfQuestions:number;
  difficulty:string;
  available:boolean;
  completed:boolean;
  examTime:number;
  numOfStudents:number
}
