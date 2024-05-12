interface ScoreDetail {
  key: string;
  value: number;
}

interface StudentScore {
  id: number;
  fullName: string;
  average: number;
  study: string;
  conduct: string;
  rank: number;
  detailScores: ScoreDetail[];
}

interface ScoreByStudentsBySubjectsData {
  class: string;
  schoolYear: string;
  teacher: string;
  semester: string;
  scores: StudentScore[];
}

interface CustomScoreDetail {
  key: string;
  value: number;
}

interface CustomStudentScore {
  id: number;
  fullName: string;
  average: number;
  rank: number;
  scores: CustomScoreDetail[];
}

interface CustomScoreByStudentsBySubjectData {
  subject: string;
  semester: string;
  class: string;
  schoolYear: string;
  teacherName: string;
  score: CustomStudentScore[];
}
interface CustomScoreByStudentData {
  id: number;
  fullName: string;
  average: number;
  study: string;
  conduct: string;
  rank: number;
  class: string;
  note: string;
  schoolYear: string;
  semester: string;
  scores: {
    subject: string;
    scoreDetail: CustomScoreDetail[];
    average?: number; // Optional average score
  }[];
}

interface CustomScoreByStudentBySubjectData {
  id: number;
  fullName: string;
  average: number;
  rank: number;
  class: string;
  subject: string;
  schoolYear: string;
  semester: string;
  scores: CustomScoreDetail[];
}

// Bảng điểm tất cả môn của cả lớp
const scoreByStudentsBySubjects: {
  code: number;
  status: boolean;
  message: string;
  data: ScoreByStudentsBySubjectsData;
} = {
  code: 200,
  status: true,
  message: 'ok',
  data: {
    class: '12A1',
    schoolYear: '2023-2024',
    teacher: 'Lê Thị B',
    semester: 'Học kì 1',
    scores: [
      {
        id: 1,
        fullName: 'Nguyễn Lê Văn A',
        average: 10,
        study: 'Giỏi',
        conduct: 'Tốt',
        rank: 1,
        detailScores: [
          {
            key: 'Toán',
            value: 10,
          },
          {
            key: 'Lý',
            value: 10,
          },
          {
            key: 'Hóa',
            value: 10,
          },
          {
            key: 'Sinh',
            value: 10,
          },
        ],
      },
      {
        id: 2,
        fullName: 'Nguyễn Lê Văn A',
        average: 10,
        study: 'Giỏi',
        conduct: 'Tốt',
        rank: 1,
        detailScores: [
          {
            key: 'Toán',
            value: 10,
          },
          {
            key: 'Lý',
            value: 10,
          },
          {
            key: 'Hóa',
            value: 10,
          },
          {
            key: 'Sinh',
            value: 10,
          },
        ],
      },
      {
        id: 3,
        fullName: 'Nguyễn Lê Văn A',
        average: 10,
        study: 'Giỏi',
        conduct: 'Tốt',
        rank: 1,
        detailScores: [
          {
            key: 'Toán',
            value: 10,
          },
          {
            key: 'Lý',
            value: 10,
          },
          {
            key: 'Hóa',
            value: 10,
          },
          {
            key: 'Sinh',
            value: 10,
          },
        ],
      },
    ],
  },
};

// Điểm 1 môn của cả lớp
const scoreByStudentsBySubject: {
  code: number;
  status: boolean;
  message: string;
  data: CustomScoreByStudentsBySubjectData;
} = {
  code: 200,
  status: true,
  message: 'ok',
  data: {
    subject: 'Toán',
    semester: 'Học kì 1',
    class: '12A2',
    schoolYear: '2023-2024',
    teacherName: 'Nguyên Thị B',
    score: [
      {
        id: 1,
        fullName: 'Nguyễn Lê Văn A',
        average: 10,
        rank: 1,
        scores: [
          {
            key: 'Kiểm tra miệng',
            value: 10,
          },
          {
            key: 'Kiểm tra miệng',
            value: 10,
          },
          {
            key: 'Kiểm tra 15 phút',
            value: 10,
          },
          {
            key: 'Kiểm tra 1 tiết',
            value: 10,
          },
          {
            key: 'Kiểm tra cuối kì',
            value: 10,
          },
        ],
      },
      {
        id: 1,
        fullName: 'Nguyễn Lê Văn A',
        average: 10,
        rank: 1,
        scores: [
          {
            key: 'Kiểm tra miệng',
            value: 10,
          },
          {
            key: 'Kiểm tra miệng',
            value: 10,
          },
          {
            key: 'Kiểm tra 15 phút',
            value: 10,
          },
          {
            key: 'Kiểm tra 1 tiết',
            value: 10,
          },
          {
            key: 'Kiểm tra cuối kì',
            value: 10,
          },
        ],
      },
      {
        id: 2,
        fullName: 'Nguyễn Lê Văn B',
        average: 10,
        rank: 1,
        scores: [
          {
            key: 'Kiểm tra miệng',
            value: 10,
          },
          {
            key: 'Kiểm tra miệng',
            value: 10,
          },
          {
            key: 'Kiểm tra 15 phút',
            value: 10,
          },
          {
            key: 'Kiểm tra 1 tiết',
            value: 10,
          },
          {
            key: 'Kiểm tra cuối kì',
            value: 10,
          },
        ],
      },
    ],
  },
};

// Điểm 1 môn của cả lớp môn tiếng anh (Ví dụ)
const scoreByStudentsBySubjectEnlish: {
  code: number;
  status: boolean;
  message: string;
  data: CustomScoreByStudentsBySubjectData;
} = {
  code: 200,
  status: true,
  message: 'ok',
  data: {
    subject: 'Ngoại ngữ',
    semester: 'Học kì 1',
    class: '12A2',
    schoolYear: '2023-2024',
    teacherName: 'Nguyên Thị B',
    score: [
      {
        id: 1,
        fullName: 'Nguyễn Lê Văn A',
        average: 10,
        rank: 1,
        scores: [
          {
            key: 'Kiểm tra miệng',
            value: 10,
          },
          {
            key: 'Kiểm tra 15 phút',
            value: 10,
          },
          {
            key: 'Kiểm tra 1 tiết',
            value: 10,
          },
          {
            key: 'Kiểm tra cuối kì',
            value: 10,
          },
          {
            key: 'Kiểm tra cuối kì',
            value: 10,
          },
          {
            key: 'Kiểm tra cuối kì',
            value: 10,
          },
          {
            key: 'Kiểm tra cuối kì',
            value: 10,
          },
          {
            key: 'Kiểm tra cuối kì',
            value: 9,
          },
        ],
      },
      {
        id: 2,
        fullName: 'Nguyễn Lê Văn A',
        average: 10,
        rank: 1,
        scores: [
          {
            key: 'Kiểm tra miệng',
            value: 10,
          },
          {
            key: 'Kiểm tra 15 phút',
            value: 10,
          },
          {
            key: 'Kiểm tra 1 tiết',
            value: 10,
          },
          {
            key: 'Kiểm tra cuối kì',
            value: 10,
          },
          {
            key: 'Kiểm tra cuối kì',
            value: 10,
          },
          {
            key: 'Kiểm tra cuối kì',
            value: 10,
          },
          {
            key: 'Kiểm tra cuối kì',
            value: 10,
          },
          {
            key: 'Kiểm tra cuối kì',
            value: 9,
          },
        ],
      },
      {
        id: 3,
        fullName: 'Nguyễn Lê Văn A',
        average: 10,
        rank: 1,
        scores: [
          {
            key: 'Kiểm tra miệng',
            value: 10,
          },
          {
            key: 'Kiểm tra 15 phút',
            value: 10,
          },
          {
            key: 'Kiểm tra 1 tiết',
            value: 10,
          },
          {
            key: 'Kiểm tra cuối kì',
            value: 10,
          },
          {
            key: 'Kiểm tra cuối kì',
            value: 10,
          },
          {
            key: 'Kiểm tra cuối kì',
            value: 10,
          },
          {
            key: 'Kiểm tra cuối kì',
            value: 10,
          },
          {
            key: 'Kiểm tra cuối kì',
            value: 9,
          },
        ],
      },
    ],
  },
};

// Điểm tất cả môn của 1 đứa
const scoreByStudent: {
  code: number;
  status: boolean;
  message: string;
  data: CustomScoreByStudentData;
} = {
  code: 200,
  status: true,
  message: 'ok',
  data: {
    id: 1,
    fullName: 'Nguyễn Lê Văn A',
    average: 10,
    study: 'Giỏi',
    conduct: 'Tốt',
    rank: 1,
    class: '12A1',
    note: 'Thông minh',
    schoolYear: '2023-2024',
    semester: 'Học kì 1',
    scores: [
      {
        subject: 'Toán',
        average: 10,
        scoreDetail: [
          {
            key: 'Kiểm tra miệng',
            value: 10,
          },
          {
            key: 'Kiểm tra miệng',
            value: 10,
          },
          {
            key: 'Kiểm tra 15 phút',
            value: 10,
          },
          {
            key: 'Kiểm tra 15 phút',
            value: 10,
          },
          {
            key: 'Kiểm tra 1 tiết',
            value: 10,
          },
          {
            key: 'Kiểm tra cuối kì',
            value: 10,
          },
        ],
      },
      {
        subject: 'Văn',
        scoreDetail: [
          {
            key: 'Kiểm tra miệng',
            value: 10,
          },
          {
            key: 'Kiểm tra miệng',
            value: 10,
          },
          {
            key: 'Kiểm tra miệng',
            value: 10,
          },
          {
            key: 'Kiểm tra 15 phút',
            value: 10,
          },
          {
            key: 'Kiểm tra 1 tiết',
            value: 10,
          },
          {
            key: 'Kiểm tra cuối kì',
            value: 10,
          },
        ],
      },
      {
        subject: 'Anh',
        scoreDetail: [
          {
            key: 'Kiểm tra miệng',
            value: 10,
          },
          {
            key: 'Kiểm tra 15 phút',
            value: 10,
          },
          {
            key: 'Kiểm tra 1 tiết',
            value: 10,
          },
          {
            key: 'Kiểm tra cuối kì',
            value: 10,
          },
        ],
      },
    ],
  },
};

// Điểm 1 môn của 1 đứa
const scoreByStudentBySubject: {
  code: number;
  status: boolean;
  message: string;
  data: CustomScoreByStudentBySubjectData;
} = {
  code: 200,
  status: true,
  message: 'ok',
  data: {
    id: 1,
    fullName: 'Nguyễn Lê Văn A',
    average: 10,
    rank: 1,
    class: '12A1',
    subject: 'Toán',
    schoolYear: '2023-2024',
    semester: 'Học kì 1',
    scores: [
      {
        key: 'Kiểm tra miệng',
        value: 10,
      },
      {
        key: 'Kiểm tra miệng',
        value: 10,
      },
      {
        key: 'Kiểm tra 15 phút',
        value: 10,
      },
      {
        key: 'Kiểm tra 15 phút',
        value: 10,
      },
      {
        key: 'Kiểm tra 1 tiết',
        value: 10,
      },
      {
        key: 'Kiểm tra cuối kì',
        value: 10,
      },
    ],
  },
};

export {
  scoreByStudent,
  scoreByStudentBySubject,
  scoreByStudentsBySubject,
  scoreByStudentsBySubjectEnlish,
  scoreByStudentsBySubjects,
};
