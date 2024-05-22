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
  fullname: string;
  email: string;
  gender: string;
  birthday: string;
  birthplace: string;
  nation: string;
  homeTown: string;
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
