import { User } from "./user-type";

export interface Option {
  value: string;
  correct: boolean;
}

export interface Question {
  title: string;
  options: Option[];
}

export interface Answer {
  question: number;
  user: User;
  answer: number;
  secondsLeft: number;
}

export interface Match {
  _id: string;
  title: string;
  titleImage: string;
  questions: Question[];
  owner: User;
  answers: Answer[]; // !TODO:
  currentQuestion: number;
  status: "not-started" | "started" | "finished";
  players: User[];
}
