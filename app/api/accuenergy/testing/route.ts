import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

let data: string | null = null;

export async function POST(req: NextRequest, res: NextResponse) {
    if (req.method === 'POST') {
        try {
            const reader = req.body?.getReader();
    
            if (!reader) {
                return new Response("AccuEnergy Test ERROR: No body found!", { status: 400 });
            }

            const { value } = await reader.read();
            data = new TextDecoder().decode(value);
            
            revalidateTag("accuenergy");
            revalidatePath("/test");
            console.log(data);
            return new Response("Success!", { status: 200 });
        } catch (error) {
            console.error('Error processing request:', error);
            return new Response("AccuEnergy Test ERROR: Internal Server Error!", { status: 500 });
        }
    } else {
        //res.setHeader('Allow', ['POST']);
        return new Response("AccuEnergy Test ERROR: Method Not Allowed!", { status: 405 });
    }
}

export async function GET() {
    // DELETE BELOW!!!! This is hardcoded for testing purposes.
    data = `{"device_name":"EHM23081653","device_model":"AcuRev 2110-mV-WEB2","timestamp":["1714720440"],"online":true,"readings":[{"param":"PF","value":["-0.847"]},{"param":"PFa","value":["-0.847"]},{"param":"PFb","value":["1.0"]},{"param":"PFc","value":["1.0"]},{"param":"PF001","value":["1.0"]},{"param":"PF002","value":["1.0"]},{"param":"PF003","value":["1.0"]},{"param":"PF004","value":["-0.847"]},{"param":"PF005","value":["1.0"]},{"param":"PF006","value":["1.0"]},{"param":"PF007","value":["1.0"]},{"param":"PF008","value":["1.0"]},{"param":"PF009","value":["1.0"]},{"param":"PF010","value":["1.0"]},{"param":"PF011","value":["1.0"]},{"param":"PF012","value":["1.0"]},{"param":"PF013","value":["1.0"]},{"param":"PF014","value":["1.0"]},{"param":"PF015","value":["1.0"]},{"param":"PF016","value":["1.0"]},{"param":"PF017","value":["1.0"]},{"param":"PF018","value":["1.0"]},{"param":"PFs1","value":["1.0"]},{"param":"PFs2","value":["1.0"]},{"param":"PFs3","value":["1.0"]},{"param":"PFs4","value":["1.0"]},{"param":"PFs5","value":["1.0"]},{"param":"PFs6","value":["1.0"]},{"param":"EP_IMP_kWh","value":["6.1"]},{"param":"EPa_IMP_kWh","value":["4.5"]},{"param":"EPb_IMP_kWh","value":["1.6"]},{"param":"EPc_IMP_kWh","value":["0.0"]},{"param":"EP001_IMP_kWh","value":["4.5"]},{"param":"EP002_IMP_kWh","value":["1.6"]},{"param":"EP003_IMP_kWh","value":["0.0"]},{"param":"EP004_IMP_kWh","value":["0.0"]},{"param":"EP005_IMP_kWh","value":["0.0"]},{"param":"EP006_IMP_kWh","value":["0.0"]},{"param":"EP007_IMP_kWh","value":["0.0"]},{"param":"EP008_IMP_kWh","value":["0.0"]},{"param":"EP009_IMP_kWh","value":["0.0"]},{"param":"EP010_IMP_kWh","value":["0.0"]},{"param":"EP011_IMP_kWh","value":["0.0"]},{"param":"EP012_IMP_kWh","value":["0.0"]},{"param":"EP013_IMP_kWh","value":["0.0"]},{"param":"EP014_IMP_kWh","value":["0.0"]},{"param":"EP015_IMP_kWh","value":["0.0"]},{"param":"EP016_IMP_kWh","value":["0.0"]},{"param":"EP017_IMP_kWh","value":["0.0"]},{"param":"EP018_IMP_kWh","value":["0.0"]},{"param":"EPs1_IMP_kWh","value":["0.0"]},{"param":"EPs2_IMP_kWh","value":["0.0"]},{"param":"EPs3_IMP_kWh","value":["0.0"]},{"param":"EPs4_IMP_kWh","value":["0.0"]},{"param":"EPs5_IMP_kWh","value":["0.0"]},{"param":"EPs6_IMP_kWh","value":["0.0"]},{"param":"DMD_P_kW","value":["-0.099"]},{"param":"DMD_Pa_kW","value":["-0.099"]},{"param":"DMD_Ia_A","value":["0.978"]},{"param":"DMD_Pb_kW","value":["0.0"]},{"param":"DMD_Ib_A","value":["0.0"]},{"param":"DMD_Pc_kW","value":["0.0"]},{"param":"DMD_Ic_A","value":["0.0"]},{"param":"DMD_P001_kW","value":["0.0"]},{"param":"DMD_I001_A","value":["0.0"]},{"param":"DMD_P002_kW","value":["0.0"]},{"param":"DMD_I002_A","value":["0.0"]},{"param":"DMD_P003_kW","value":["0.0"]},{"param":"DMD_I003_A","value":["0.0"]},{"param":"DMD_P004_kW","value":["-0.099"]},{"param":"DMD_I004_A","value":["0.978"]},{"param":"DMD_P005_kW","value":["0.0"]},{"param":"DMD_I005_A","value":["0.0"]},{"param":"DMD_P006_kW","value":["0.0"]},{"param":"DMD_I006_A","value":["0.0"]},{"param":"DMD_P007_kW","value":["0.0"]},{"param":"DMD_I007_A","value":["0.0"]},{"param":"DMD_P008_kW","value":["0.0"]},{"param":"DMD_I008_A","value":["0.0"]},{"param":"DMD_P009_kW","value":["0.0"]},{"param":"DMD_I009_A","value":["0.0"]},{"param":"DMD_P010_kW","value":["0.0"]},{"param":"DMD_I010_A","value":["0.0"]},{"param":"DMD_P011_kW","value":["0.0"]},{"param":"DMD_I011_A","value":["0.0"]},{"param":"DMD_P012_kW","value":["0.0"]},{"param":"DMD_I012_A","value":["0.0"]},{"param":"DMD_P013_kW","value":["0.0"]},{"param":"DMD_I013_A","value":["0.0"]},{"param":"DMD_P014_kW","value":["0.0"]},{"param":"DMD_I014_A","value":["0.0"]},{"param":"DMD_P015_kW","value":["0.0"]},{"param":"DMD_I015_A","value":["0.0"]},{"param":"DMD_P016_kW","value":["0.0"]},{"param":"DMD_I016_A","value":["0.0"]},{"param":"DMD_P017_kW","value":["0.0"]},{"param":"DMD_I017_A","value":["0.0"]},{"param":"DMD_P018_kW","value":["0.0"]},{"param":"DMD_I018_A","value":["0.0"]},{"param":"DMD_Ps1_kW","value":["0.0"]},{"param":"DMD_Ps2_kW","value":["0.0"]},{"param":"DMD_Ps3_kW","value":["0.0"]},{"param":"DMD_Ps4_kW","value":["0.0"]},{"param":"DMD_Ps5_kW","value":["0.0"]},{"param":"DMD_Ps6_kW","value":["0.0"]},{"param":"Unbl_V","value":["52.4"]}]}`;
    
    return Response.json({ test: data }, { status: 200 });
}