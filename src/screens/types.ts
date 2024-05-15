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
  WeeklyTimeTable: undefined;
  Attendance: undefined;
  ScoreMain: undefined;
  ScoreFirstYear: undefined;
  ScoreSecondYear: undefined;
  ScoreThirdYear: undefined;
  ScoreFourthYear: undefined;
  Exam: undefined;
  ButtonTopTab: undefined;
  DetailScoreFirstYearOne: undefined;
};

export interface User {
  name: string;
  email: string;
  gender: string;
  dateofbirth: string;
  placeofbirth: string;
  nation: string;
  currentresidence: string;
  martyrson: string;
  namefather: string;
  namemother: string;
  occupationfather: string;
  occupationmother: string;
  nameGuardian: string;
  status: string;
  occipationguardian: string;
  phonemother: string;
  phonefather: string;
  _id: string;
}
