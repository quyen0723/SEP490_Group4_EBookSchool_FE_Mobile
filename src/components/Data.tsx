export type ItemType = {
  id: string;
  title: string;
  image: any; // Change the type to 'any'
};

export type SectionType = {
  title: string;
  data: ItemType[];
};

export const sectionByStudent: SectionType[] = [
  {
    title: 'Thông báo',
    data: [
      {
        image: require('../assets/images/icons/Notification.png'),
        id: '1',
        title: 'Thông báo',
      },
    ],
  },
  {
    title: 'Truy cập thông tin',
    data: [
      {
        image: require('../assets/images/icons/Calendar.png'),
        id: '2',
        title: 'Thời khóa biểu',
      },
      {
        image: require('../assets/images/icons/Exam.png'),
        id: '3',
        title: 'Tính điểm',
      },
      // Add more access items here if needed
    ],
  },
  {
    title: 'Báo cáo',
    data: [
      {
        image: require('../assets/images/icons/Attendance.png'),
        id: '4',
        title: 'Điểm danh',
      },
      {
        image: require('../assets/images/icons/Point.png'),
        id: '5',
        title: 'Điểm',
      },
      // Add more report items here if needed
    ],
  },
];

export const sectionByParent: SectionType[] = [
  {
    title: 'Thông báo',
    data: [
      {
        image: require('../assets/images/icons/Notification.png'),
        id: '1',
        title: 'Thông báo',
      },
    ],
  },
  {
    title: 'Truy cập thông tin',
    data: [
      {
        image: require('../assets/images/icons/Calendar.png'),
        id: '2',
        title: 'Thời khóa biểu',
      },
      // Add more access items here if needed
    ],
  },
  {
    title: 'Báo cáo',
    data: [
      {
        image: require('../assets/images/icons/Attendance.png'),
        id: '4',
        title: 'Điểm danh',
      },
      {
        image: require('../assets/images/icons/Point.png'),
        id: '5',
        title: 'Điểm',
      },
      // Add more report items here if needed
    ],
  },
];

export const sectionByTeacher: SectionType[] = [
  {
    title: 'Thông báo',
    data: [
      {
        image: require('../assets/images/icons/Notification.png'),
        id: '1',
        title: 'Thông báo',
      },
    ],
  },
  {
    title: 'Truy cập thông tin',
    data: [
      {
        image: require('../assets/images/icons/Calendar.png'),
        id: '2',
        title: 'Thời khóa biểu',
      },
      // Add more access items here if needed
    ],
  },
  {
    title: 'Báo cáo',
    data: [
      {
        image: require('../assets/images/icons/Attendance.png'),
        id: '4',
        title: 'Điểm danh',
      },
      // Add more report items here if needed
    ],
  },
];
export const sectionNull: SectionType[] = [
  {
    title: 'Thông báo',
    data: [
      {
        image: require('../assets/images/icons/Notification.png'),
        id: '1',
        title: 'Thông báo',
      },
    ],
  },
];
