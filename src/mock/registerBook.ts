interface Slot {
    slot: number;
    subject: string;
    teacher: string;
    slotByLessonPlans: number;
    numberOfAbsent: number;
    memberAbsent: string[];
    title: string;
    note: string;
    rating: string;
  }
  
  interface RegisterBookDetail {
    id: number;
    date: string;
    weekDate: string;
    slots: Slot[];
  }
  
  interface RegisterBookData {
    schoolYear: string;
    fromDate: string;
    toDate: string;
    class: string;
    detail: RegisterBookDetail[];
  }
  
  const registerBooks: { code: number, status: boolean, message: string, data: RegisterBookData } = {
    code: 200,
    status: true,
    message: "ok",
    data: {
      schoolYear: "2023-2024",
      fromDate: "03/04/2024",
      toDate: "15/04/2024",
      class: "12C10",
      detail: [
        {
          id: 1,
          date: "03/04/2024",
          weekDate: "Thứ 2",
          slots: [
            {
              slot: 1,
              subject: "Ngữ Văn",
              teacher: "DaQL",
              slotByLessonPlans: 1,
              numberOfAbsent: 1,
              memberAbsent: ["Quyên ngoài xa "],
              title: "NLXH: Chiếc thuyền ngoài xa",
              note: "Tích cực",
              rating: "A",
            },
            // Rest of the slots...
          ],
        },
        // Rest of the details...
      ],
    },
  };
  
  const registerBook: { code: number, status: boolean, message: string, data: { schoolYear: string, class: string, detail: Slot } } = {
    code: 200,
    status: true,
    message: "ok",
    data: {
      schoolYear: "2023-2024",
      class: "12C10",
      detail: {
        slot: 1,
        subject: "Ngữ Văn",
        teacher: "DaQL",
        slotByLessonPlans: 1,
        numberOfAbsent: 1,
        memberAbsent: ["Quyên"],
        title: "NLXH: Chiếc thuyền ngoài xa",
        note: "Tích cực",
        rating: "A",
      },
    },
  };
  
  export { registerBook, registerBooks };
  