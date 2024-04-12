import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReportStatementsProps {
  reportName: string;
  date: string;
  downloadUrl: string;

}

const ReportStatements: React.FC<ReportStatementsProps> = ({ 
  reportName, 
  date,
  downloadUrl,

}) => {

  //console.log('ppppppppp', downloadUrl);

  return (
    <>
      <div className="flex justify-between">
        <div className="justify-start">
          <h1 className="text-primary-text">{reportName}</h1>
          <p className="text-primary-text text-opacity-75 text-sm pb-4">{date}</p>
        </div>
        
        <Button asChild size="icon" variant="ghost"><a href={downloadUrl} download><Download /></a></Button> 
        
      </div>
      <hr className="bg-white border-none h-[1px] mb-4"/>
    </>
  );
};

export default ReportStatements;