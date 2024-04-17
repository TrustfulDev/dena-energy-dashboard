import ReportStatements from '@/components/report-statements'
import { fetchData } from "@/lib/fetchReport";
import NoAccount from '@/components/noAccount';

export default async function Reports() {
    const data = await fetchData();

    //console.log("adasdas", data);

    return (
        <div className="mx-4 md:m-0 overflow-y-auto">
           {data && data.length > 0 ? (
                data.map((report, index) => (
                    <ReportStatements 
                        key={index}
                        reportName={report.templateName}
                        date={`${report.timeframe.singlePeriod.periodEndingDate.month} ${report.timeframe.singlePeriod.periodEndingDate.year}`}
                        downloadUrl={report.downloadUrl || ""}
                    />
                ))
            ) : (
                <NoAccount className='mb-6' />
            )}
        </div>
    )
}