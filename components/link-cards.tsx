import React from 'react';
import Image from 'next/image'
import { NavBtn } from "@/components/navigation/nav-btns";
import { Link } from "lucide-react";

interface LinkCardsProps {
  src: string;
  companyName: string;
  description: string, 
  list: string[];
}

const LinkCards: React.FC<LinkCardsProps> = ({ 
  src, 
  companyName, 
  description, 
  list 
}) => {
  return (
    <div className='flex flex-col flex-1 bg-primary-card p-6 md:p-8 rounded-lg text-primary-text'>
      <header className="flex">
        <div className="min-w-[80px] md:min-w-[100px] max-w-[145px]">
            <Image
              src={src}
              layout="responsive"
              width={140}
              height={140}
              objectFit="cover"
              alt=''
            />
        </div>

        <div className="ml-4">
          <h2 className="text-xl font-bold md:mb-2 md:pt-2 min-w-[181px]">{companyName}</h2>
          <h3 className="text-lg font-semibold text-red-400">Not Linked</h3>
        </div>
      </header>

      <p className="mt-4">{description}</p>
      
      <div className="mt-6">
        <h4 className="text-lg font-semibold">Linking Steps</h4>
        <ul className="list-decimal pl-4 text-lg">
          { list.map((item, index) => {
            return (
              <li key={index} className="mt-2">{item}</li>
            )
          })}
        </ul>
      </div>

      <NavBtn 
        Icon={Link}
        text="Link Account"
        link=""
        active={true}
        className="bg-primary-cta text-primary-bg ml-auto md:mt-auto mt-6 hover:bg-secondary-cta hover:text-primary-bg"
      />
    </div>
  );
};

export default LinkCards;