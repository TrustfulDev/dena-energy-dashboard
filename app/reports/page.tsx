import ReportStatements from '@/components/report-statements'
import { fetchData } from "@/lib/fetchReport";

export default async function Reports() {
    const data = await fetchData();

    return (
        <div className="mx-4 md:m-0">
            {
                data?.map((report, index) => {
                    return (
                        <ReportStatements key={index} reportName={report.templateName} date={`${report.timeframe.singlePeriod.periodEndingDate.month} ${report.timeframe.singlePeriod.periodEndingDate.year}`} />
                    )
                })
            }
        </div>
    )
}