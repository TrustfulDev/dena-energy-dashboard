import { ReportDetail, fetchAllReports } from "./reportApi";

export async function fetchData() {
    let data: ReportDetail[] | null;

    try {
        data = await fetchAllReports();
        //console.log('ssssss', data);

    } catch(err) {
        data = null;
        //console.log('ssssss', data);

    }
    
    return data;
}