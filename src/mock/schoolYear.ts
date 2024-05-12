interface SchoolYear {
    schoolYear: string;
    fromDate: string;
    toDate: string;
  }
  
  const schoolYears: { code: number, status: boolean, message: string, data: SchoolYear[] } = {
    code: 200,
    status: true,
    message: "ok",
    data: [
      {
        schoolYear: "2018-2019",
        fromDate: "2/9/2018",
        toDate: "31/5/2019",
      },
      {
        schoolYear: "2019-2020",
        fromDate: "2/9/2019",
        toDate: "31/5/2020",
      },
      {
        schoolYear: "2020-2021",
        fromDate: "2/9/2020",
        toDate: "31/5/2021",
      },
      {
        schoolYear: "2021-2022",
        fromDate: "2/9/2021",
        toDate: "31/5/2022",
      },
      {
        schoolYear: "2022-2023",
        fromDate: "2/9/2022",
        toDate: "31/5/2023",
      },
      {
        schoolYear: "2023-2024",
        fromDate: "2/9/2023",
        toDate: "31/5/2024",
      },
    ],
  };
  
  export { schoolYears };
  