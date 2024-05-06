export type RootNavigationProps = {
    Splash: undefined;
    Login: undefined;
    HomeMain: undefined;
    // Notification: undefined;
    // Profile: undefined;
    ButtonTab: undefined;
    Profile: {user: User};
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
    _id: string;
    // Thêm các trường thông tin khác của người dùng ở đây
  }