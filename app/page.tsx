import { PropertyDetails, fetchAllPropertyDetails } from "@/lib/propertiesApi";
import { Overview } from '@/components/overview';

export default async function Home() {
  const data: PropertyDetails[] = await fetchAllPropertyDetails();

  return (
    <Overview properties={data} />
  )
}
