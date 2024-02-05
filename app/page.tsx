"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
import { Landmark, Gauge, Thermometer } from 'lucide-react';
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
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

export default function Home() {
  const [date, setDate] = useState<Date>();
  useEffect(() => {
    setDate(new Date());
  },[]);

  return (
    <div className="grid grid-cols-6 gap-6 h-full mb-6 lg:overflow-y-auto pr-6">
      <Card className='w-full flex flex-col col-span-6 min-h-[500px]'>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Monthly Usage
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

          <CardDescription>Electricity, Water, and Waste</CardDescription>
        </CardHeader>

        <CardContent className='flex-grow'>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid opacity={0.15} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className='col-span-3 min-h-[500px]'>
        <CardHeader>
          <CardTitle>Energy Costs</CardTitle>
          <CardDescription>Total Monthly Costs From All Properties</CardDescription>
        </CardHeader>

        <CardContent>
          <p>Go for the PieChartWithPaddingAngle</p>
        </CardContent>
      </Card>

      <Card className='col-span-3 min-h-[500px]'>
        <CardHeader>
          <CardTitle>Change In Cost</CardTitle>
          <CardDescription>Compare Current and Last Month Costs</CardDescription>
        </CardHeader>

        <CardContent>
          <p>Bar Chart maybe?</p>
        </CardContent>
      </Card>

      <Card className='col-span-2 aspect-square'>
        <CardHeader>
          <CardTitle>Active Elements</CardTitle>
          <CardDescription>Total Amount of Properties & Meters</CardDescription>
        </CardHeader>

        <CardContent className='space-y-4'>
          <p className='flex items-center gap-4 text-lg'><Landmark className='w-12 h-auto' /> 26 Properties</p>
          <p className='flex items-center gap-4 text-lg'><Gauge className='w-12 h-auto' /> 366 Meters</p>
          <p className='flex items-center gap-4 text-lg'><Thermometer className='w-12 h-auto' /> 23 Sub-Meters</p>
        </CardContent>

        <CardFooter className='flex-col items-start'>
          <hr className='w-full mb-4' />
          SOMETHING HERE!!!
          Maybe Connections like Energy Star/PG&E?
          Or we could include some type of information through the form of a paragraph.
        </CardFooter>
      </Card>

      <Card className='col-span-2 aspect-square'>
        <CardHeader>
          <CardTitle>Consumption By Utilities</CardTitle>
          <CardDescription>Find Which Utility You Use The Most</CardDescription>
        </CardHeader>
              
        <CardContent>
          <p>Bar Chart!! Should Have: Electricity, Water, Waste</p>
        </CardContent>
      </Card>

      <Card className='col-span-2 aspect-square'>
        <CardHeader>
          <CardTitle>Carbon Footprint</CardTitle>
          <CardDescription>Monthly Total CO2 Emission</CardDescription>
        </CardHeader>

        <CardContent>
          <p>Open to any graph</p>
        </CardContent>
      </Card>
    </div>
  )
}
