import React from 'react';

interface ReportStatementsProps {
    reportName: string;
    date: string;
  }
  

  const ReportStatements: React.FC<ReportStatementsProps> = ({ reportName, date }) => {

    return (
        <div className="bg-[#242529] mt-6">
            <div className="flex justify-start">
            <h1 className="text-white">{reportName}</h1>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-auto">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
</svg>

            </div>
            <p className="text-[#FDFDFE] text-sm pb-4">{date}</p>
            <hr className="border border-white"/>
            
        </div>
    );
};

export default ReportStatements;