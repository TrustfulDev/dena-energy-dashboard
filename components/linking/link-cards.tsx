"use client";
import { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import Image from 'next/image'

import { LinkForm } from './link-form';

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface LinkCardsProps {
  src: string,
  api: string,
  companyName: string,
  description: string, 
  disabled: boolean
}


const LinkCards: React.FC<LinkCardsProps> = ({ 
  src,
  api,
  companyName, 
  description, 
  disabled
}) => {
  const [username, setUsername] = useState(null);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    const getData = async () => {
      if (disabled) return;

      const linked = await fetch(`/api/${api}/linking/?id=${user?.id}`, {
        method: 'GET',
      });
    
      if (linked.status === 200) { 
        const data = await linked.json();
        setUsername(data.username);
      } else {
        console.error("LINK-CARDS - Failed to fetch:", linked.statusText);
      }
    }

    getData();
  }, []);

  //Unlink behavior 
  const onDelete = async () => {
    const response = await fetch(`/api/${api}/delete/`, {
        method: 'POST',
        body: JSON.stringify(user),
    });

    if (response.ok) {
        toast.success("Account Unlinked!", {
            description: `Your ${companyName} account has been successfully unlinked.`
        });

        setUsername(null);
        router.refresh();
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
          <LinkForm api={api} callback={setUsername} disable={disabled} />
        }
        
      </CardContent>
    </Card>
  );
};

export default LinkCards;