import React from 'react';
import Image from 'next/image'
import { LinkForm } from './link-form';
import { auth } from '@clerk/nextjs';

import {
  Card,
  CardContent,
} from "@/components/ui/card"

interface LinkCardsProps {
  src: string,
  api: string,
  companyName: string,
  description: string, 
}

const getData = async(api: String) => {
  //const { userId } = auth();

  const linked = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/${api}/linking/`, {
    method: 'GET',
    
  });

  //console.log("LLLLLLLLLLLLLLLL", userId);

  if (linked.status === 200) { 
    const data = await linked.json();
    //console.log("Username:", data.Username);
    console.log("sdasda", data.username);
    return data.username;

  } else {
    
    console.error("Failed to fetch:", linked.statusText);
  }

}


const LinkCards: React.FC<LinkCardsProps> = async ({ 
  src,
  api,
  companyName, 
  description, 
}) => {

  const data = await getData(api);

  console.log(data);
  
  return (
    <Card className='flex flex-col col-span-2 bg-primary-card p-6 md:p-8 rounded-lg text-primary-text'>
      <header className="grid grid-cols-4 gap-4">
        <div className="w-full h-auto col-span-1">
            <Image
              src={src}
              className='object-cover'
              alt='Logo'
            />
        </div>

        <div className="col-span-3">
          <h2 className="text-xl font-bold md:pt-2 min-w-[181px]">{companyName}</h2>
          <h3 className="text-lg font-semibold text-red-400">Not Linked</h3>
          <p className="mt-3">{description}</p>
        </div>
      </header>

      
      <CardContent className="p-0 mt-8">
        <LinkForm api={api} company={companyName} />
      </CardContent>
    </Card>
  );
};

export default LinkCards;