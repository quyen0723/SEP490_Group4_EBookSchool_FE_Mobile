interface Student {
  id: number;
  fullName: string;
  class?: string;
  birthday: string;
  birthplace: string;
  gender: string;
  nation: string;
  isMartyrs: boolean;
  address: string;
  homeTown?: string;
  avater?: string;
  fatherFullName?: string;
  fatherProfession?: string;
  fatherPhone?: string;
  motherFullName?: string;
  motherProfession?: string;
  motherPhone?: string;
}

const student: {
  code: number;
  status: boolean;
  message: string;
  data: Student;
} = {
  code: 200,
  status: true,
  message: 'ok',
  data: {
    id: 1,
    fullName: 'Nguyễn Lê Văn A',
    class: '12A2',
    birthday: '01/01/2024',
    birthplace: 'Ninh Kiều, Cần Thơ',
    gender: 'Nam',
    nation: 'Kinh',
    isMartyrs: false,
    address: 'Ninh Kiều, Cần Thơ',
    homeTown: 'Bình Thủy, Cần Thơ',
    avater: 'http://',
    fatherFullName: 'Nguyễn Văn B',
    fatherProfession: 'Bác sĩ',
    fatherPhone: '0123456789',
    motherFullName: 'Lê Thị C',
    motherProfession: 'Giáo Viên',
    motherPhone: '0987654321',
  },
};

const students: {
  code: number;
  status: boolean;
  message: string;
  data: Student[];
} = {
  code: 200,
  status: true,
  message: 'ok',
  data: [
    {
      id: 1,
      fullName: 'Nguyễn Lê Văn A',
      birthday: '01/01/2024',
      birthplace: 'Ninh Kiều, Cần Thơ',
      gender: 'Nam',
      nation: 'Kinh',
      isMartyrs: false,
      address: 'Ninh Kiều, Cần Thơ',
    },
    {
      id: 2,
      fullName: 'Nguyễn Lê Văn A',
      birthday: '01/01/2024',
      birthplace: 'Ninh Kiều, Cần Thơ',
      gender: 'Nam',
      nation: 'Kinh',
      isMartyrs: false,
      address: 'Ninh Kiều, Cần Thơ',
    },
    {
      id: 3,
      fullName: 'Nguyễn Lê Văn A',
      birthday: '01/01/2024',
      birthplace: 'Ninh Kiều, Cần Thơ',
      gender: 'Nam',
      nation: 'Kinh',
      isMartyrs: false,
      address: 'Ninh Kiều, Cần Thơ',
    },
    {
      id: 4,
      fullName: 'Nguyễn Lê Văn A',
      birthday: '01/01/2024',
      birthplace: 'Ninh Kiều, Cần Thơ',
      gender: 'Nam',
      nation: 'Kinh',
      isMartyrs: false,
      address: 'Ninh Kiều, Cần Thơ',
    },
    {
      id: 5,
      fullName: 'Nguyễn Lê Văn A',
      birthday: '01/01/2024',
      birthplace: 'Ninh Kiều, Cần Thơ',
      gender: 'Nam',
      nation: 'Kinh',
      isMartyrs: false,
      address: 'Ninh Kiều, Cần Thơ',
    },
  ],
};

export {student, students};
