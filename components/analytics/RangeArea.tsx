"use client"
// Components
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {  Cell, PieChart, LabelList, Pie, Sector, LineChart, Line, BarChart, Bar,XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ApexCharts from 'apexcharts'
import Chart from "react-apexcharts";
import { PropertyDetails } from "@/lib/propertiesApi";
import React, { useEffect, Component } from 'react';
export class RangeArea extends Component <any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            options: {
                chart: {
                    id: "range-area-chart",
                    height: 350,
                    type: 'rangeArea',
                    animations: {
                        speed: 500
                    }
                },
                colors: ['#d4526e', '#33b2df'],
                dataLabels: {
                    enabled: false
                },
                fill: {
                    opacity: [0.24, 0.24, 1, 1]
                },
                stroke: {
                    curve: 'straight',
                    width: [0, 0, 2, 2]
                },
                legend: {
                    show: true,
                    customLegendItems: ['Team B'],
                    inverseOrder: true,
                    labels: {
                        colors: '#FFFFFF'
                    }
                },
                title: {
                    text: 'Range Area with Forecast Line ',
                    style:{
                        color: '#FFFFFF'
                    }
                },
                markers: {
                    hover: {
                        sizeOffset: 5
                    }
                },
                xaxis: {
                    categories: ['2:00', '4:00', '6:00', '8:00', '10:00', '12:00', '14:00', '16:00'],
                    labels: {
                        style: {
                            colors: '#FFFFFF' // Set x-axis text color to white
                        }
                    }
                },
                yaxis: {
                    labels: {
                        style: {
                            colors: '#FFFFFF' // Set y-axis text color to white
                        }
                    }
                }
            },
            series: [
                {
                    name: 'Team B Range',
                    data: [
                        { x: '2:00', y: [1100, 1900] },
                        { x: '4:00', y: [1200, 1800] },
                        { x: '6:00', y: [900, 2900] },
                        { x: '8:00', y: [1400, 2700] },
                        { x: '10:00', y: [2600, 3900] },
                        { x: '12:00', y: [500, 1700] },
                        { x: '14:00', y: [1900, 2300] },
                        { x: '16:00', y: [1000, 1500] }
                    ]
                },
                {
                    name: 'Team B Median',
                    data: [
                        { x: '2:00', y: 1500 },
                        { x: '4:00', y: 1700 },
                        { x: '6:00', y: 1900 },
                        { x: '8:00', y: 2200 },
                        { x: '10:00', y: 2600 }, 
                        { x: '12:00', y: 500 },  
                        { x: '14:00', y: 1900 }, 
                        { x: '16:00', y: 1000 } 
                    ]
                }
            ]
        };
    }



    render() {
        return (
            <div className="grid grid-cols-1">
                <Card className='w-full flex flex-col col-span-6 2xl:col-span-4 min-h-[500px]'>
                    <CardHeader>
                        <CardTitle className="">
                            Range Area
                        </CardTitle>
                        <CardDescription>Electricity, Natural Gas, Water, and Waste</CardDescription>
                    </CardHeader>
                    <CardContent className='flex-grow'>
                        <ResponsiveContainer width="100%" height="100%">
                            <div className="mixed-chart">
                                <Chart
                                    options={this.state.options}
                                    series={this.state.series}
                                    type="rangeArea"
                                    height={350}
                                />
                            </div>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        );
    }
}
