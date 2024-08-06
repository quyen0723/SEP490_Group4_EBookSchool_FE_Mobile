import {useQuery, UseQueryResult} from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fetchTimeTable = async ({
  queryKey,
}: {
  queryKey: [string, string, string, string];
}) => {
  const [_, userId, year, monday] = queryKey;
  const accessToken = await AsyncStorage.getItem('accessToken');
  const roles = JSON.parse((await AsyncStorage.getItem('userRoles')) || '[]');
  let url = '';

  console.log('ROLEEEEEEEEEEE: ' + roles);
  console.log('USERIDDDDDDDDD: ' + userId);
  console.log('YEARRRRRRRRRRR: ' + year);
  console.log('MONDAYYYYYYYYY: ' + monday);

  if (roles.includes('Student')) {
    url = `https://orbapi.click/api/Schedules/Student?studentID=${userId}&schoolYear=${year}&fromDate=${monday}`;
  } else if (roles.includes('Subject Teacher') || roles.includes('Admin')) {
    url = `https://orbapi.click/api/Schedules/SubjectTeacher?teacherID=${userId}&schoolYear=${year}&fromDate=${monday}`;
  } else if (roles.includes('HomeroomTeacher')) {
    url = `https://orbapi.click/api/Schedules/HomeroomTeacher?teacherID=${userId}&schoolYear=${year}&fromDate=${monday}`;
  }

  if (url) {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const textResponse = await response.text();
    console.log('API Response:', textResponse);
    if (textResponse === 'Không tìm thấy lớp học') {
      return {data: null, message: 'Không tìm thấy lớp học'};
    }
    return {data: JSON.parse(textResponse), message: ''};
  }
  throw new Error('No valid role found for fetching timetable');
};

// export const useFetchTimeTable = (
//   userId: string,
//   year: string,
//   monday: string,
// ) => {
//   return useQuery({
//     queryKey: ['timetable', userId, year, monday],
//     queryFn: fetchTimeTable,
//     enabled: !!userId && !!year && !!monday,
//     refetchOnMount: false,
//     refetchOnWindowFocus: false,
//     staleTime: 1000 * 60 * 60,
//     cacheTime: 1000 * 60 * 60 * 24 * 7, // 7 days
//     keepPreviousData: true,
//   });
// };

export const useFetchTimeTable = (
  userId: string,
  year: string,
  monday: string,
): UseQueryResult<any, Error> => {
  return useQuery({
    queryKey: ['timetable', userId, year, monday],
    queryFn: fetchTimeTable,
    enabled: !!userId && !!year && !!monday,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60 * 24 * 7, // 7 days
    keepPreviousData: true,
  });
};
