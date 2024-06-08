import React, {createContext, useContext, ReactNode} from 'react';

interface LabelContextProps {
  startDateLabel: string;
  endDateLabel: string;
  tbcmLabel: string;
  hanhKiemLabel: string;
  rankLabel: string;
}

const ScoreLabelContext = createContext<LabelContextProps>({
  startDateLabel: 'Ngày bắt đầu',
  endDateLabel: 'Ngày kết thúc',
  tbcmLabel: 'TBCM',
  hanhKiemLabel: 'Hạnh kiểm',
  rankLabel: 'Hạng',
});

export const useLabelContext = () => useContext(ScoreLabelContext);

interface LabelProviderProps {
  children: ReactNode;
  labels: LabelContextProps;
}

export const LabelProvider: React.FC<LabelProviderProps> = ({
  children,
  labels,
}) => {
  return (
    <ScoreLabelContext.Provider value={labels}>
      {children}
    </ScoreLabelContext.Provider>
  );
};
