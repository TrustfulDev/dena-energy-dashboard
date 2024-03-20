import NoAccount from '@/components/noAccount';
import { Overview } from '@/components/overview';
import { fetchData } from "@/lib/fetchAccounts";

export default async function Home() {
  const data = await fetchData();

  return (
    <>
      {data ? 
        <Overview properties={data} />
        :
        <NoAccount className='mb-6' />
      }
    </>
  )
}
