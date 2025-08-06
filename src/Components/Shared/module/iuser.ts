export interface Iuser {
  id?: any;
  name:string;
  password:string
  email:string;
  courseName?:string;
  studentId:number;
  available:boolean;
  completed:boolean;
  completedExams?: {
    examTitle: string;
    score: number;
  }[];
}
