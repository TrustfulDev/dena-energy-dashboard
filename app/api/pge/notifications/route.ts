import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    if (req.method === 'POST') {
        try {
            let data = '';
            const reader = req.body?.getReader();
    
            if (!reader) {
                return new Response("PG&E Notifications ERROR: No Body Found...", { status: 400 });
            }
    
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                data += new TextDecoder().decode(value);
            }

            // If everything goes well, send a success response
            console.log(data);
            return new Response("PG&E Notifications SUCCESS: Data processed successfully...", { status: 200 });
        } catch (error) {
            console.error('Error processing request:', error);
            return new Response("PG&E Notifications ERROR: Internal Server Error...", { status: 500 });
        }
    } else {
        return new Response("PG&E Notifications ERROR: Method Not Allowed...", { status: 405 });
    }
}