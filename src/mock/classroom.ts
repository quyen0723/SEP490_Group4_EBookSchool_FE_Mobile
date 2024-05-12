interface Classroom {
    id: number;
    name: string;
    description: string | null;
  }
  
  const classroom: { code: number, status: boolean, message: string, data: Classroom } = {
    code: 200,
    status: true,
    message: "ok",
    data: {
      id: 1,
      name: "Phòng học A1",
      description: "Phòng học", // allow null
    },
  };
  
  const classrooms: { code: number, status: boolean, message: string, data: Classroom[] } = {
    code: 200,
    status: true,
    message: "ok",
    data: [
      {
        id: 1,
        name: "Phòng học A1",
        description: "Phòng học", // allow null
      },
      {
        id: 2,
        name: "Phòng học A1",
        description: "Phòng học", // allow null
      },
      {
        id: 3,
        name: "Phòng học A1",
        description: "Phòng học", // allow null
      },
      {
        id: 4,
        name: "Phòng học A1",
        description: "Phòng học", // allow null
      },
      {
        id: 5,
        name: "Phòng học A1",
        description: "Phòng học", // allow null
      },
    ],
  };
  
  export { classroom, classrooms };
  