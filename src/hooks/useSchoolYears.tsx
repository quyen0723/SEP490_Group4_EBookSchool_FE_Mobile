import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SchoolYear {
  id: string;
  year: string;
}

const fetchSchoolYears = async (): Promise<SchoolYear[]> => {
  const schoolYearsString = await AsyncStorage.getItem('userSchoolYears');
  if (!schoolYearsString) {
    throw new Error('No school years data found');
  }
  return JSON.parse(schoolYearsString);
};

export const useSchoolYears = (): UseQueryResult<SchoolYear[], Error> => {
  return useQuery<SchoolYear[], Error>({
    queryKey: ['schoolYears'],
    queryFn: fetchSchoolYears,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    // cacheTime đã bị bỏ, không cần sử dụng
    // keepPreviousData: true có thể sử dụng để giữ dữ liệu trước đó trong khi fetching mới
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    // keepPreviousData: true,
  });
};

// export const useSchoolYears = () => {
//   return useQuery({
//     queryKey: ['schoolYears'],
//     queryFn: fetchSchoolYears,
//     staleTime: Infinity, // Data will never be considered stale
//     // cacheTime: 1000 * 60 * 60 * 24, // This line should be removed as it's not a valid option
//   });
// };
