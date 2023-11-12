/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Image from 'next/image'

interface LinkCardsProps {
  img: HTMLImageElement;
  companyName: string;
  description: string, 
  list: string[];
}

const LinkCards: React.FC<LinkCardsProps> = ({ img, companyName, description, list }) => {
  const logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Energy_Star_logo.svg/1200px-Energy_Star_logo.svg.png';

  return (
    <div className='flex flex-col mt-6 bg-[#37373F] p-8 rounded-lg text-white w-[70vh] h-[80vh]'>
     <div className='flex justify -start'>
      {/* Image Holder */}
      <div className="flex">
        {/* <img
          src={logoUrl}
          alt=""
          className="w-32 h-32" 
        /> */}
        <Image
        src={img}
        width={140}
        height={140}
        alt=''
        />
        
      </div>

      {/* Info Container */}
      <div className="ml-12 h-32">
        {/* Header 1 */}
        <h2 className="text-xl font-bold mb-2 pt-2">{companyName}</h2>

        {/* Header 2 */}
        <h3 className="text-lg font-semibold mb-4">Welcome</h3>

        <p>{description}</p>
      </div>
    </div>
        {/*Div for Header and List */}
    <div className="mt-10">
      <h4 className="text-lg font-semibold mb-2">Benefits</h4>
      <ul className="list-disc pl-4 text-lg">
        <li className='pt-4'>Item 1</li>
        <li className='pt-4'>Item 2</li>
        <li className='pt-4'>Item 3</li>
        <li className='pt-4'>Item 4</li>
        <li className='pt-4'>Item 5</li>
        </ul>
    </div>
    <div className='mt-auto ml-auto bg-[#A6ABFF] p-4 rounded-lg h-10 w-40 flex items-center'>
      <button className='flex items-center text-black '> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
      </svg>Sign in</button>
    </div>
  </div>

  );
};

export default LinkCards;
