interface Score {
  key: string;
  value: string;
  indexCol: number;
  semester: string;
}

interface Subject {
  subject: string;
  average: string;
  scores: Score[];
}

interface StudentScores {
  fullName: string;
  schoolYear: string;
  className: string;
  details: Subject[];
}

const studentScore: {
  code: number;
  status: boolean;
  message: string;
  data: StudentScores;
} = {
  code: 200,
  status: true,
  message: 'ok',
  data: {
    fullName: 'Nguyễn Văn A',
    schoolYear: '2024-2025',
    className: '',
    details: [
      {
        subject: 'Hãy tính điểm môn cần tính',
        average: '-1',
        scores: [
          {
            key: '1 Tiết',
            value: '',
            indexCol: 1,
            semester: 'Học kỳ I',
          },
          {
            key: '15p',
            value: '',
            indexCol: 1,
            semester: 'Học kỳ I',
          },
          {
            key: '15p',
            value: '',
            indexCol: 2,
            semester: 'Học kỳ I',
          },
          {
            key: 'Cuối kỳ',
            value: '',
            indexCol: 1,
            semester: 'Học kỳ I',
          },
          {
            key: 'Miệng',
            value: '',
            indexCol: 1,
            semester: 'Học kỳ I',
          },
          {
            key: 'Miệng',
            value: '',
            indexCol: 2,
            semester: 'Học kỳ I',
          },
          {
            key: '1 Tiết',
            value: '',
            indexCol: 1,
            semester: 'Học kỳ II',
          },
          {
            key: '15p',
            value: '',
            indexCol: 1,
            semester: 'Học kỳ II',
          },
          {
            key: '15p',
            value: '',
            indexCol: 2,
            semester: 'Học kỳ II',
          },
          {
            key: 'Cuối kỳ',
            value: '',
            indexCol: 1,
            semester: 'Học kỳ II',
          },
          {
            key: 'Miệng',
            value: '',
            indexCol: 1,
            semester: 'Học kỳ II',
          },
          {
            key: 'Miệng',
            value: '',
            indexCol: 2,
            semester: 'Học kỳ II',
          },
        ],
      },
    ],
  },
};

export {studentScore};
