import { Overview } from '@/components/overview';
import { fetchData } from "@/lib/fetchAccounts";

export default async function Home() {
  const data = await fetchData();

  return (
    <>
      {data ? 
        <Overview properties={data} />
        :
        <div>Oops! It seems like you don&apos;t have any accounts linked with us! Please navigate to the Account Linking tab and link at least one account.</div>
      }
    </>
  )
}
