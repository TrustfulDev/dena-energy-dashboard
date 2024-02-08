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
    name: 'February 2',
    "EPA SAMPLE OFFICE": 4000,
    "EPA SAMPLE LABORATORY": 2400,
  },
  {
    name: 'February 7',
    "EPA SAMPLE OFFICE": 3000,
    "EPA SAMPLE LABORATORY": 1398,
  },
  {
    name: 'February 12',
    "EPA SAMPLE OFFICE": 2000,
    "EPA SAMPLE LABORATORY": 9800,
  },
  {
    name: 'February 17',
    "EPA SAMPLE OFFICE": 2780,
    "EPA SAMPLE LABORATORY": 3908,
  },
  {
    name: 'February 22',
    "EPA SAMPLE OFFICE": 1890,
    "EPA SAMPLE LABORATORY": 4800,
  },
  {
    name: 'February 27',
    "EPA SAMPLE OFFICE": 2390,
    "EPA SAMPLE LABORATORY": 3800,
  },
  {
    name: 'February 29',
    "EPA SAMPLE OFFICE": 3490,
    "EPA SAMPLE LABORATORY": 4300,
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
            Overall Electricity Usage
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
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </CardTitle>

          <CardDescription>Electricity Usage From All Properties (kWh)</CardDescription>
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
              <Tooltip contentStyle={{ backgroundColor: "#000"}} />
              <Legend />
              <Line type="monotone" dataKey="EPA SAMPLE LABORATORY" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="EPA SAMPLE OFFICE" stroke="#82ca9d" />
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
