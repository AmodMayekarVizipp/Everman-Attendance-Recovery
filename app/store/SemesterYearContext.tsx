import React, { createContext, ReactNode, useContext, useState } from 'react';

interface SemesterYearContextType {
  semester: string;
  year: string;
  setSemester: (semester: string) => void;
  setYear: (year: string) => void;
}

const SemesterYearContext = createContext<SemesterYearContextType | undefined>(undefined);

const SemesterYearProvider = ({ children }: { children: ReactNode }) => {
  const [semester, setSemester] = useState('');
  const [year, setYear] = useState('');

  return (
    <SemesterYearContext.Provider value={{ semester, year, setSemester, setYear }}>
      {children}
    </SemesterYearContext.Provider>
  );
};

export const useSemesterYear = () => {
  const context = useContext(SemesterYearContext);
  if (!context) {
    throw new Error('useSemesterYear must be used within a SemesterYearProvider');
  }
  return context;
};

export default SemesterYearProvider;
