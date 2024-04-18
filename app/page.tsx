import NoAccount from '@/components/noAccount';
import { Overview } from '@/components/overview';
import { fetchData } from "@/lib/fetchAccounts";
import { currentUser } from '@clerk/nextjs';

export default async function Home() {
  const currUser = await currentUser();
  const data = await fetchData({id: currUser?.id});

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