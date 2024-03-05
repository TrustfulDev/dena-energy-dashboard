"use client"

import LinkCards from '@/app/linking/components/link-cards'
import React, { useState, useEffect } from 'react';
import { json } from 'stream/consumers';

export default function Linking() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameFeedback, setUsernameFeedback] = useState('');
    const [passwordFeedback, setPasswordFeedback] = useState('');

    //unlink button
    const [buttonFeedback, setButtonFeedback] = useState('');


    //unlink behavior 
    const handleButtonClick = async () => {
        const response = await fetch('/api/energystar/testlink/', {
            method: 'POST',
        });

        if (response.ok) {
            //print something

        } else {
            setButtonFeedback('Error: Unable to complete the action');
        }
    };

    return (
        
        <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-6 h-full m-4 md:mb-6 md:mx-0 mt-0 md:flex-wrap md:overflow-y-auto">

            
            <LinkCards 
                src=""
                companyName="Energy Star Portfolio Manager"
                description="Energy Star is a program run by the U.S. Environmental Protection Agency and U.S. Department of Energy that promotes energy efficiency."
                list={["Login to your Energy Star Portfolio Manager", "Go to the Sharing Tab", "Step 3", "Step 4", "Step 5"]}
            />

            <LinkCards 
                src=""
                companyName="Pacific Gas and Electric Company"
                description="Pacific Gas and Electric Company (PG&E) is one of the largest combined natural gas and electric companies in the United States."
                list={["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"]}
            />

            {/* unlink button */}
            <button onClick={handleButtonClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                .........Unlink
            </button>
      
        </div> 

        
    )
}





  