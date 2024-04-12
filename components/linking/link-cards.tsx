"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image'
import { LinkForm } from './link-form';

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface LinkCardsProps {
  src: string,
  api: string,
  companyName: string,
  description: string, 
}


const LinkCards: React.FC<LinkCardsProps> = ({ 
  src,
  api,
  companyName, 
  description, 
}) => {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const linked = await fetch(`http://localhost:3000/api/${api}/linking/`, {
        method: 'GET',
      });
    
      if (linked.status === 200) { 
        const data = await linked.json();
        setUsername(data.username);
      } else {
        console.error("Failed to fetch:", linked.statusText);
      }
    }

    getData();
  }, []);

  //Unlink behavior 
  const onDelete = async () => {
    const response = await fetch(`/api/${api}/delete/`, {
        method: 'POST',
    });

    if (response.ok) {
        toast.success("Account Unlinked!", {
            description: `Your ${companyName} account has been successfully unlinked.`
        });

        setUsername(null);
    } else {
        toast.error("Failed to unlink account!", {
            description: "Please contact us directly if the problem persists."
        });
    }
  };
  
  return (
    <Card className={`flex flex-col col-span-2 ${ username ? "" : "bg-primary-card" } p-6 md:p-8 rounded-lg text-primary-text`}>
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
          <h3 className={`text-lg font-semibold ${ username ? "text-green-400" : "text-red-400"}`}>{ username ? "Linked" : "Not Linked" }</h3>
          <p className="mt-3">{description}</p>
        </div>
      </header>

      
      <CardContent className="p-0 mt-8 h-full">
        { username ? 
          <div className='flex flex-col justify-between h-full'>
            <p className='mx-auto my-auto text-5xl'>{username}</p>
            <Button variant="destructive" type="button" onClick={onDelete}>Unlink Account</Button>
          </div>
          :
          <LinkForm api={api} callback={setUsername} />
        }
        
      </CardContent>
    </Card>
  );
};

export default LinkCards;