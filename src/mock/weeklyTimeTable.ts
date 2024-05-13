// KhoaTD: Thời khóa biểu 1 slot
interface StudentWeeklyTimeTableSlot {
  id: number;
  slot: number;
  classRoom: string;
  slotTime: string;
  subject: string;
  slotByLessonPlans: number;
  status: string;
  isAttendance: boolean;
  teacher: string;
}

interface StudentWeeklyTimeTableDateSlot {
  id: number;
  slot: number;
  classRoom: string;
  slotTime: string;
  subject: string;
  slotByLessonPlans: number;
  status: string;
  isAttendance: boolean;
  teacher: string;
}

interface StudentWeeklyTimeTableDate {
  id: number;
  date: string;
  weekDate: string;
  slots: StudentWeeklyTimeTableDateSlot[];
}

interface StudentWeeklyTimeTableDatesSlot {
  id: number;
  slot: number;
  classRoom: string;
  slotTime: string;
  subject: string;
  slotByLessonPlans: number;
  status: string;
  isAttendance: boolean;
  teacher: string;
}

interface StudentWeeklyTimeTableDatesDetail {
  id: number;
  date: string;
  weekDate: string;
  slots: StudentWeeklyTimeTableDatesSlot[];
}

interface StudentWeeklyTimeTableDatesData {
  schoolYear: string;
  semester: string;
  class: string;
  mainTeacher: string;
  fromDate: string;
  toDate: string;
  details: StudentWeeklyTimeTableDatesDetail[];
}

const studentWeeklyTimeTableSlot: {
  code: number;
  status: boolean;
  message: string;
  data: StudentWeeklyTimeTableSlot;
} = {
  code: 200,
  status: true,
  message: 'ok',
  data: {
    id: 1,
    slot: 2,
    classRoom: 'Phòng 12A1',
    slotTime: '7-7h45',
    subject: 'Ngữ Văn',
    slotByLessonPlans: 4,
    status: 'Not-started',
    isAttendance: false,
    teacher: 'DaQL',
  },
};

const studentWeeklyTimeTableDate: {
  code: number;
  status: boolean;
  message: string;
  data: StudentWeeklyTimeTableDate;
} = {
  code: 200,
  status: true,
  message: 'ok',
  data: {
    id: 1,
    date: '13/05/2024',
    weekDate: 'Thứ 2',
    slots: [
      {
        id: 1,
        slot: 2,
        classRoom: 'Phòng 12A1',
        slotTime: '7-7h55 ',
        subject: 'Ngữ Văn',
        slotByLessonPlans: 4,
        status: 'Not-started',
        isAttendance: false,
        teacher: 'DaQL',
      },
      {
        id: 2,
        slot: 3,
        classRoom: 'Phòng 12A1',
        slotTime: '7-7h55 ',
        subject: 'Ngữ Văn',
        slotByLessonPlans: 4,
        status: 'Not-started',
        isAttendance: false,
        teacher: 'DaQL',
      },
    ],
  },
};
interface StudentWeeklyTimeTableDatesDetail {
  id: number;
  date: string;
  weekDate: string;
  slots: StudentWeeklyTimeTableDatesSlot[];
}

interface StudentWeeklyTimeTableDatesData {
  schoolYear: string;
  semester: string;
  class: string;
  mainTeacher: string;
  fromDate: string;
  toDate: string;
  details: StudentWeeklyTimeTableDatesDetail[];
}

const studentWeeklyTimeTableDates: {
  code: number;
  status: boolean;
  message: string;
  data: StudentWeeklyTimeTableDatesData;
} = {
  code: 200,
  status: true,
  message: 'ok',
  data: {
    schoolYear: '2023-2024',
    semester: 'HK1',
    class: '12C10',
    mainTeacher: 'KhanhVH',
    fromDate: '13/05/2024',
    toDate: '19/09/2024',
    details: [
      {
        id: 1,
        date: '13/05/2024',
        weekDate: 'Mon',
        slots: [
          {
            id: 1,
            slot: 1,
            classRoom: 'Sân B1',
            slotTime: '7-7h45',
            subject: 'Chào cờ',
            slotByLessonPlans: 4,
            status: 'Not-started',
            isAttendance: false,
            teacher: 'Nhiều giáo viên',
          },
          {
            id: 2,
            slot: 2,
            classRoom: 'Phòng 12A1',
            slotTime: '7h50-8h35',
            subject: 'Ngữ Văn',
            slotByLessonPlans: 4,
            status: 'Not-started',
            isAttendance: false,
            teacher: 'HuongLH',
          },
          {
            id: 3,
            slot: 3,
            classRoom: 'Sân B1',
            slotTime: '9h-9h45',
            subject: 'Ngữ Văn',
            slotByLessonPlans: 4,
            status: 'Not-started',
            isAttendance: false,
            teacher: 'HuongLH',
          },
          {
            id: 4,
            slot: 4,
            classRoom: 'Phòng 12A1',
            slotTime: '9h50-10h35',
            subject: 'Tin học',
            slotByLessonPlans: 4,
            status: 'Not-started',
            isAttendance: false,
            teacher: 'HuongLH',
          },
          {
            id: 5,
            slot: 5,
            classRoom: 'Phòng 12A1',
            slotTime: '10h45-11h30',
            subject: 'Lịch sử',
            slotByLessonPlans: 4,
            status: 'Not-started',
            isAttendance: false,
            teacher: 'DaQL',
          },
        ],
      },
      // {
      //   id: 2,
      //   date: '14/05/2024',
      //   weekDate: 'Tue',
      //   slots: [
      //     {
      //       id: 1,
      //       slot: 1,
      //       classRoom: 'Phòng 12A1',
      //       slotTime: '7-7h45',
      //       subject: 'Toán 1',
      //       slotByLessonPlans: 4,
      //       status: 'Not-started',
      //       isAttendance: false,
      //       teacher: 'HuongLH',
      //     },
      //     {
      //       id: 2,
      //       slot: 2,
      //       classRoom: 'Phòng 12A1',
      //       slotTime: '7h50-8h35',
      //       subject: 'Toán 2',
      //       slotByLessonPlans: 4,
      //       status: 'Not-started',
      //       isAttendance: false,
      //       teacher: 'DaQL',
      //     },
      //   ],
      // },
      {
        id: 3,
        date: '15/05/2024',
        weekDate: 'Wed',
        slots: [
          {
            id: 1,
            slot: 1,
            classRoom: 'Phòng âm nhạc',
            slotTime: '7-7h45',
            subject: 'Lịch sử 1',
            slotByLessonPlans: 4,
            status: 'Not-started',
            isAttendance: false,
            teacher: 'HuongLH',
          },
          {
            id: 2,
            slot: 2,
            classRoom: 'Phòng 12A1',
            slotTime: '7h50-8h35',
            subject: 'Lịch sử 2',
            slotByLessonPlans: 4,
            status: 'Not-started',
            isAttendance: false,
            teacher: 'HuongLH',
          },
        ],
      },
      {
        id: 4,
        date: '16/05/2024',
        weekDate: 'Thu',
        slots: [
          {
            id: 1,
            slot: 1,
            classRoom: 'Phòng 12A1',
            slotTime: '7-7h45',
            subject: 'Hóa 1',
            slotByLessonPlans: 4,
            status: 'Not-started',
            isAttendance: false,
            teacher: 'DaQL',
          },
          {
            id: 2,
            slot: 2,
            classRoom: 'Phòng 12A1',
            slotTime: '7h50-8h35',
            subject: 'Hóa 2',
            slotByLessonPlans: 4,
            status: 'Not-started',
            isAttendance: false,
            teacher: 'HuongLH',
          },
        ],
      },
      {
        id: 5,
        date: '17/05/2024',
        weekDate: 'Fri',
        slots: [
          {
            id: 1,
            slot: 1,
            classRoom: 'Phòng 12A1',
            slotTime: '7-7h45',
            subject: 'Tin học 1',
            slotByLessonPlans: 4,
            status: 'Not-started',
            isAttendance: false,
            teacher: 'HuongLH',
          },
          {
            id: 2,
            slot: 2,
            classRoom: 'Phòng 12A1',
            slotTime: '7h50-8h35',
            subject: 'Tin học 2',
            slotByLessonPlans: 4,
            status: 'Not-started',
            isAttendance: false,
            teacher: 'HuongLH',
          },
        ],
      },
      {
        id: 6,
        date: '18/05/2024',
        weekDate: 'Sat',
        slots: [
          {
            id: 1,
            slot: 1,
            classRoom: 'Phòng 10A2',
            slotTime: '7-7h45',
            subject: 'Địa lý 1',
            slotByLessonPlans: 4,
            status: 'Not-started',
            isAttendance: false,
            teacher: 'HuongLH',
          },
          {
            id: 2,
            slot: 2,
            classRoom: 'Phòng 12A1',
            slotTime: '7h50-8h35',
            subject: 'Địa lý 2',
            slotByLessonPlans: 4,
            status: 'Not-started',
            isAttendance: false,
            teacher: 'DaQL',
          },
        ],
      },
      {
        id: 7,
        date: '19/05/2024',
        weekDate: 'Sun',
        slots: [
          {
            id: 1,
            slot: 1,
            classRoom: 'Sân A1',
            slotTime: '7-7h45',
            subject: 'SHCN',
            slotByLessonPlans: 4,
            status: 'Not-started',
            isAttendance: false,
            teacher: 'HuongLH',
          },
        ],
      },
    ],
  },
};

export {
  studentWeeklyTimeTableSlot,
  studentWeeklyTimeTableDate,
  studentWeeklyTimeTableDates,
};
