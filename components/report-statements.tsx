import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReportStatementsProps {
  reportName: string;
  date: string;
}

const ReportStatements: React.FC<ReportStatementsProps> = ({ 
  reportName, 
  date 
}) => {
  // Implement downloads here

  return (
    <>
      <div className="flex justify-between">
        <div className="justify-start">
          <h1 className="text-primary-text">{reportName}</h1>
          <p className="text-primary-text text-opacity-75 text-sm pb-4">{date}</p>
        </div>

        <Button size="icon" variant="ghost"><Download /></Button>
      </div>
      <hr className="bg-white border-none h-[1px] mb-4"/>
    </>
  );
};

export default ReportStatements;