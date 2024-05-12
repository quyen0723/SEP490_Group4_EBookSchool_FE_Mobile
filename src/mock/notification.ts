export interface NotificationContent {
  header: string;
  body: string;
  footer: string;
}

export interface NotificationItem {
  id: number;
  title: string | null;
  startDate: string;
  thumbNail: string;
  content: string;
}

export interface NotificationsResponse {
  code: number;
  status: boolean;
  message: string;
  data: NotificationItem[];
}

const notification: NotificationItem = {
  id: 1,
  title: 'Thông báo lịch nghỉ tết năm 2024',
  startDate: '03/04/2024',
  thumbNail: 'link hình',
  content: 'Nghỉ tết',
};

const notifications: NotificationsResponse = {
  code: 200,
  status: true,
  message: 'ok',
  data: [
    {
      id: 1,
      title: 'Thông báo lịch nghỉ tết năm 2024',
      startDate: '03/04/2024',
      thumbNail: 'link hình',
      content: 'Nghỉ tết',
    },
    {
      id: 2,
      title: 'Thông báo lịch nghỉ tết năm 2024',
      startDate: '03/04/2024',
      thumbNail: 'link hình',
      content: 'Nghỉ tết',
    },
    {
      id: 3,
      title: 'Thông báo lịch nghỉ tết năm 2024',
      startDate: '03/04/2024',
      thumbNail: 'link hình',
      content: 'Nghỉ tết',
    },
    {
      id: 4,
      title: 'Thông báo lịch nghỉ tết năm 2024',
      startDate: '03/04/2024',
      thumbNail: 'link hình',
      content: 'Nghỉ tết',
    },
    {
      id: 5,
      title: 'Thông báo lịch nghỉ tết năm 2024',
      startDate: '03/04/2024',
      thumbNail: 'link hình',
      content: 'Nghỉ tết',
    },
    {
      id: 6,
      title: 'Thông báo lịch nghỉ tết năm 2024',
      startDate: '03/04/2024',
      thumbNail: 'link hình',
      content: 'Nghỉ tết',
    },
  ],
};

export {notification, notifications};
