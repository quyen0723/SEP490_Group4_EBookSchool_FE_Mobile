import React, {createContext, useContext, ReactNode} from 'react';

interface LabelContextProps {
  startDateLabel: string;
  endDateLabel: string;
  presentLabel: string;
  absentLabel: string;
}

const AttendanceLabelContext = createContext<LabelContextProps>({
  startDateLabel: 'Ngày bắt đầu',
  endDateLabel: 'Ngày kết thúc',
  presentLabel: 'Có mặt',
  absentLabel: 'Vắng',
});

export const useLabelContext = () => useContext(AttendanceLabelContext);

interface LabelProviderProps {
  children: ReactNode;
  labels: LabelContextProps;
}

export const LabelProvider: React.FC<LabelProviderProps> = ({
  children,
  labels,
}) => {
  return (
    <AttendanceLabelContext.Provider value={labels}>
      {children}
    </AttendanceLabelContext.Provider>
  );
};
