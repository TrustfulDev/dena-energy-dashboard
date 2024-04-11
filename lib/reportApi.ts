import { initializePool } from '@/utils/database';
import { auth } from '@clerk/nextjs/server';
import { rejects } from 'assert';
import { resolve } from 'path';
import xml2js from 'xml2js';


interface Report{
    id: string;
    hint: string;
}

export interface ReportDetail {
    id: string;
    type: string;
    timeframe: {
        singlePeriod: {
            periodEndingDate: {
                month: string;
                year: string;
            };
        };
    };
    templateId: string;
    templateName: string;
    properties: string[];
    reportGenerationStatus: string;
    downloadUrl?: string;
}

async function fetchReport(id: string): Promise<Report[]> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${baseUrl}/api/energystar/report?id=${id}`);
    const xml = await response.text();
    const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });


    return new Promise((resolve, reject) => {
        parser.parseString(xml, (err: any, result: any) => {
            if (err) {
                console.error("fetchReport FAILED... No account?");
                reject(err);
            } else {
                const report: Report[] = result.response.links.link;
                resolve(report);
            }
        });
    });
}

async function fetchReportDetail(reportId: string, userId: string): Promise<ReportDetail> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${baseUrl}/api/energystar/report_detail?id=${reportId}&userId=${userId}`);
    const downloadResponse = await fetch(`${baseUrl}/api/energystar/report_download?id=${reportId}&userId=${userId}`);
    const downloadUrl = downloadResponse.url;

    const xml = await response.text();
    const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });

    return new Promise((resolve, reject) => {
        parser.parseString(xml, (err, result) => {
            if (err) {
                console.error("Failed to fetch report detail for report ID:", reportId, err);
                reject(err);
            } else {
                const detail = result.report;
                const reportDetail: ReportDetail = {
                    id: detail.id,
                    type: detail.type,
                    timeframe: {
                        singlePeriod: {
                            periodEndingDate: {
                                month: detail?.timeframe?.singlePeriod?.periodEndingDate?.month || 'Unknown',
                                year: detail?.timeframe?.singlePeriod?.periodEndingDate?.year || 'Unknown',
          
                            }
                        }
                    },
                    templateId: detail.templateId,
                    templateName: detail.templateName,
                    properties: Array.isArray(detail.properties.id) ? detail.properties.id : [detail.properties.id],
                    reportGenerationStatus: detail.reportGenerationStatus,
                    downloadUrl: downloadUrl,


                };
                resolve(reportDetail);
            }
        });
    });
    
}


export async function fetchAllReports(): Promise<ReportDetail[]> {
    const { userId } = auth();
    //console.log("what about here, ", userId);
    await initializePool();
    const reports = await fetchReport(userId || "");
    
    const reportDetailsPromises = reports.map(report => fetchReportDetail(report.id, userId || ""));

    return await Promise.all(reportDetailsPromises);
}