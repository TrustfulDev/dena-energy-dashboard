import { ReportDetail, fetchAllReports } from "./reportApi";

export async function fetchData({
    id
}: {
    id: string | undefined
}) {
    let data: ReportDetail[] | null;

    try {
        data = await fetchAllReports({ id });
    } catch(err) {
        data = null;
    }
    
    return data;
}