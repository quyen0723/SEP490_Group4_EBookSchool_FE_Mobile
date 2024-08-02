import React, {createContext, useContext, useState, ReactNode} from 'react';

interface TabContextType {
  currentTab: string | null;
  setCurrentTab: (tab: string | null) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export const TabProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [currentTab, setCurrentTab] = useState<string | null>(null);

  return (
    <TabContext.Provider value={{currentTab, setCurrentTab}}>
      {children}
    </TabContext.Provider>
  );
};

export const useTab = (): TabContextType => {
  const context = useContext(TabContext);
  if (context === undefined) {
    throw new Error('useTab must be used within a TabProvider');
  }
  return context;
};
