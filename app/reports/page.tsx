import ReportStatements from '@/components/report-statements'

export default async function Reports() {
    return (
        <div className="mx-4 md:m-0">
            <ReportStatements reportName={'Energy Audit'} date={'10/10/2023'}/>
            <ReportStatements reportName={'Energy Statement'} date={'8/22/2023'}/>
            <ReportStatements reportName={'Energy Audit'} date={'8/22/2023'}/>
            <ReportStatements reportName={'Energy Audit'} date={'8/10/2023'}/>
        </div>
    )
}