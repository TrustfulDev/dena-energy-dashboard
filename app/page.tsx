"use client";
import { 
  BarChart, 
  Bar, 
  XAxis,
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useState, useEffect } from 'react';
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const data = [
  {
    name: 'Building A',
    electricity: 4000,
    water: 2400,
    amt: 2400,
  },
  {
    name: 'Building B',
    electricity: 3000,
    water: 1398,
    amt: 2210,
  },
  {
    name: 'Building C',
    electricity: 2000,
    water: 9800,
    amt: 2290,
  },
  {
    name: 'Building D',
    electricity: 2780,
    water: 3908,
    amt: 2000,
  },
  {
    name: 'Building E',
    electricity: 1890,
    water: 4800,
    amt: 2181,
  },
  {
    name: 'Building F',
    electricity: 2390,
    water: 3800,
    amt: 2500,
  },
  {
    name: 'Building G',
    electricity: 3490,
    water: 4300,
    amt: 2100,
  },
];

export default function Home() {
  const [date, setDate] = useState<Date>();
  useEffect(() => {
    setDate(new Date());
  },[]);

  return (
    <div className="flex gap-6 h-full mb-6 md:overflow-y-auto">
      <Card className='w-full flex flex-col flex-grow h-full'>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Daily Values - December 2023
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </CardTitle>

          <CardDescription>Electricity, Water, Heating, Garbage...</CardDescription>

          <CardContent className='p-0 pt-4 flex gap-8'>
            <div>
              <p className='text-accent-faded text-sm'>ELECTRICITY USE</p>
              <h3 className='text-2xl'>1,569 kWh</h3>
            </div>

            <div>
              <p className='text-accent-faded text-sm'>CARBON FOOTPRINT</p>
              <h3 className='text-2xl'>51,265 t C0<span className='text-base'>2e</span></h3>
            </div>

            <div>
              <p className='text-accent-faded text-sm'>EXPENSES</p>
              <h3 className='text-2xl'>$123,510</h3>
            </div>
          </CardContent>
        </CardHeader>
        <CardContent className='flex-grow'>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="electricity" stackId="a" fill="#82ca9d" />
              <Bar dataKey="water" stackId="a" fill="#8884d8" />
              <Bar dataKey="amt" stackId="a" fill="#50c89d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
          <CardDescription>Test description for test card</CardDescription>
        </CardHeader>

      </Card>
    </div>
  )
}
