import {ScoreByStudentsBySubjectsData} from '../mock/score';

export type RootNavigationProps = {
  Splash: undefined;
  Login: undefined;
  HomeMain: undefined;
  // Notification: undefined;
  // Profile: undefined;
  ButtonTab: undefined;
  Profile: {user: User};
  Notification: undefined;
  NotificationDetail: undefined;
  WeeklyTimeTableMain: {timeTableData: any};
  WeeklyTimeTableMainTeacher: undefined;
  WeeklyTimeTable: undefined;
  WeeklyTimeTableTeacher: undefined;
  Attendance: undefined;
  ScoreMain: undefined;
  ScoreFirstYear: undefined;
  ScoreSecondYear: undefined;
  ScoreThirdYear: undefined;
  ScoreFourthYear: undefined;
  Calculate: {scores: ScoreByStudentsBySubjectsData} | undefined;
  ButtonTopTab: undefined;
  DetailScoreFirstYearOne: undefined;
  AttendanceFirstYear: undefined;
  DetailAttendanceFirst: undefined;
  DetailAttendanceSubject: undefined;
  DetailAttendanceTeacher: undefined;
};

export interface User {
  fullname: string;
  email: string;
  gender: string;
  birthday: string;
  birthplace: string;
  nation: string;
  address: string;
  fatherFullName: string;
  motherFullName: string;
  fatherProfession: string;
  motherProfession: string;
  nameGuardian: string;
  status: string;
  occipationguardian: string;
  motherPhone: string;
  fatherPhone: string;
  id: string;
  isMartyrs: boolean;
}
export interface Slot {
  id: string;
  slot: number;
  classroom: string;
  slotTime: string;
  subject: string;
  slotByLessonPlans: number;
  status: string;
  isAttendance: boolean;
  teacher: string;
}

export interface DayDetail {
  id: string;
  date: string;
  weekDate: string;
  slots: Slot[];
}

// export interface TimeTableData {
//   success: boolean;
//   message: string;
//   statusCode: number;
//   data: {
//     schoolYear: string;
//     class: string;
//     mainTeacher: string;
//     fromDate: string;
//     toDate: string;
//     semester: string;
//     details: DayDetail[];
//   };
// }
export interface TimeTableData {
  schoolYear: string;
  class: string;
  mainTeacher: string;
  fromDate: string;
  toDate: string;
  semester: string;
  details: DayDetail[];
}
