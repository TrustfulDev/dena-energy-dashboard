"use client"
// Components
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,TooltipProps } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
interface Reading {
  param: string;
  value: string[];
  timestamp: string;
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// Custom tooltip function
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  
  if (active && payload && payload.length > 0) {
    const value = payload[0].value;
    return (
      <div className="custom-tooltip backdrop-blur-md text-neutral-200 p-4 font-bold rounded-sm" >
        <p className="label">{`Time: ${label}`}</p>
        <p className="intro">{`Usage: ${value?.toFixed(2)} kWh`}</p>
      </div>
    );
  }

  return null;
};

export const AreaCharts: React.FC<{ importActiveEnergy: Reading[] }> = ({ importActiveEnergy }) => {
  const chartData = importActiveEnergy.map(reading => ({
    timestamp: reading.timestamp, 
    value: parseFloat(reading.value[0]) 
  }));

  return (
    <div className="grid grid-cols-1">
                <Card className='w-full flex flex-col col-span-6 2xl:col-span-4 min-h-[500px]'>
                    <CardHeader>
                        <CardTitle className="">
                         Accuenergy Real Time Usage
                        </CardTitle>
                        <CardDescription>Energy Usage</CardDescription>
                    </CardHeader>
                    <CardContent className='flex-grow'>
                      <ResponsiveContainer width="100%" height={400}>
                        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="timestamp" 
                            tickFormatter={formatDate} 
                            angle={-90} 
                            textAnchor="end" 
                            height={70}
                            tick={{ fontSize: '10px' }}  
                            />
                          <YAxis label={{ value: 'kWh', angle: -90, position: 'insideLeft' }} />
                          <Tooltip content={<CustomTooltip />} contentStyle={{ backgroundColor: "#000"}} cursor={{fill: '#000', opacity: '20%'}}/>
                          <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        );
};