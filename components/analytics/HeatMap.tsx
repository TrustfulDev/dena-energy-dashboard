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

export class HeatMap extends Component<any, any> {
    constructor(props: any) {
        super(props);
    
        this.state = {
          options: {
            chart: {
              id: "heatmap-chart",
              type: "heatmap",
              height: 350,
            },
            plotOptions: {
              heatmap: {
                shadeIntensity: 0.5,
                radius: 0,
                useFillColorAsStroke: true,
                colorScale: {
                  ranges: [{
                      from: -30,
                      to: 5,
                      name: 'low',
                      color: '#00A100'
                    },
                    {
                      from: 6,
                      to: 20,
                      name: 'medium',
                      color: '#128FD9'
                    },
                    {
                      from: 21,
                      to: 45,
                      name: 'high',
                      color: '#FFB200'
                    },
                    {
                      from: 46,
                      to: 55,
                      name: 'extreme',
                      color: '#FF0000'
                    }
                  ]
                }
              }
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              width: 1
            },
            title: {
              text: 'HeatMap Chart with Color Range',
              style:{
                color: '#FFFFFF'
              }
            },
            legend: {
                labels: {
                    colors: '#FFFFFF'
                }
            },
            tooltip: {
                enabled: true,
                
                    custom: function({ series, seriesIndex, dataPointIndex, w }: { series: any[], seriesIndex: number, dataPointIndex: number, w: any }) {
                        if (w && w.globals && w.globals.initialSeries && Array.isArray(w.globals.initialSeries) && seriesIndex < w.globals.initialSeries.length) {
                            const data = w.globals.initialSeries[seriesIndex]?.data[dataPointIndex];
                            if (data) {
                                return `<ul>
                                    <li>Month: ${data.x}</li>
                                    <li>Value: ${data.y}</li>
                                    
                                </ul>`;
                            }
                        }
                        return ''; // Handle the case where data is not available or invalid
                    }
                
                

            },
            xaxis: {
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
          series: [{
            name: 'Jan',
            data: [
              { x: 'Monday', y: 5 },
              { x: 'Tuesday', y: 15 },
              { x: 'Wednesday', y: 20 },
              { x: 'Thursday', y: 25 },
              { x: 'Friday', y: 30 },
              { x: 'Saturday', y: 35 },
              { x: 'Sunday', y: 40 },
            ]
          },
          {
            name: 'Feb',
            data: [
              { x: 'Monday', y: 12 },
              { x: 'Tuesday', y: 18 },
              { x: 'Wednesday', y: 24 },
              { x: 'Thursday', y: 30 },
              { x: 'Friday', y: 36 },
              { x: 'Saturday', y: 42 },
              { x: 'Sunday', y: 48 },
            ]
          },
          {
            name: 'Mar',
            data: [
              { x: 'Monday', y: 15 },
              { x: 'Tuesday', y: 20 },
              { x: 'Wednesday', y: 25 },
              { x: 'Thursday', y: 30 },
              { x: 'Friday', y: 35 },
              { x: 'Saturday', y: 40 },
              { x: 'Sunday', y: 45 },
            ]
          }]
        };
      }

    render() {
        return (
            <div className="grid grid-cols-1">
                <Card className='w-full flex flex-col col-span-6 2xl:col-span-4 min-h-[500px]'>
                    <CardHeader>
                        <CardTitle className="">
                            Heat Map
                        </CardTitle>
                        <CardDescription>Electricity, Natural Gas, Water, and Waste</CardDescription>
                    </CardHeader>
                    <CardContent className='flex-grow'>
                        <ResponsiveContainer width="100%" height="100%">
                            <div className="mixed-chart">
                                <Chart
                                    options={this.state.options}
                                    series={this.state.series}
                                    type="heatmap"
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