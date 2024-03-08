"use client";
import {  Cell, PieChart, Rectangle, Pie, Sector, LineChart, Line, BarChart, Bar,XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


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
import { useDataContext } from '@/context';
import { PropertyDetails } from "@/lib/propertiesApi";

// utility consumption bar chart 
const consumption_dataTest = [
  {name: 'Electricity', value : 4000, type : 'Electricity',fill: '#8884d8'},
  {name:'Water', value : 2400, type :'Water', fill: '#82ca9d'},
  {name:'Waste',value : 2400, type : 'Waste', fill: '#FF8042'}
];
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const { name, value, type } = payload[0].payload;
    const unit = type === 'Electricity' ? 'kWh' : type === 'Cost' ? ' $' : type === 'Waste' ? 'pounds' : 'gallons';

    return (
      <div className="custom-tooltip">
        <p>{`${name}: ${value} ${unit}`}</p>
      </div>
    );
  }

  return null;
};


// energy cost from all properties pie chart 
const energyCost_data = [
  { name: 'Property A', value: 400, type : 'Cost' },
  { name: 'Property B', value: 300, type : 'Cost' },
  { name: 'Property C', value: 300, type : 'Cost' },
  { name: 'Property D', value: 200, type : 'Cost' },
];
// colors for pie chart with padding angle 
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
// change in cost bar chart 
const changeCost_data = [
  { name: 'Past Cost', value: 4000, type : 'Cost'},
  { name: 'Current Cost', value: 2000, type : 'Cost'},
];
// carbon footprint pie chart 
const carbon_data = [
  { name: 'Electricity', value: 400, fill: '#8884d8' },
  { name: 'Water', value: 300, fill: '#82ca9d' },
  { name: 'Waste', value: 300, fill: '#FF8042' },
];
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)} CO₂e`}
    </text>
  );
};

//
const data = [
  {
    name: 'February 2',
    "EPA SAMPLE OFFICE": 4000,
    "EPA SAMPLE LABORATORY": 2400,
    "test": 2000
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


const electricityData = { name: "Test" };
//electricityData.newKey = "New Value";


interface ConsumptionData {
  month: string;
  name: string;
  value: number;
  type: string;
  fill: string;
}

interface PropertyData {
  month: string;
  name: string;
  value: number;
  type : string;
  fill: string;
}

interface ElectricityUsage {
  month : string;
  name : string;
  value : number;
  type : string;
  fill : string;
}

// Function that gets all bills from all properties rather than just the latest one 
// function processAllProperty(properties: PropertyDetails[]): { consumption_data: ConsumptionData[], cost_data: PropertyData[], electricity_data: ElectricityUsage[], totalNumberOfMeters: number, highestConsumer_data: ConsumptionData[] } {
//   let consumption_data: ConsumptionData[] = [];
//   let cost_data: PropertyData[] = [];
//   let highestConsumer_data: ConsumptionData[] = [];
//   let electricity_data: ElectricityUsage[] = [];
//   let totalEnergyUsage = 0;
//   let totalWaterUsage = 0;
//   let totalWasteUsage = 0;
//   let totalEnergyCost = 0;
//   let totalWaterCost = 0;
//   let totalWasteCost = 0;
//   let name = "";
//   let individualPropertiesTotalCost: number[] = [];
//   let individualPropertiesElectricUse: number[] =[];
//   let propertiesTotalCost = 0;
//   let propertiesEnergyUse = 0;
//   let totalNumberOfMeters = 0;
//   let totalNumberOfEnergyMeters = 0;
//   let totalNumberOfWaterMeters = 0;
//   let totalNumberOfWasteMeters = 0;
  
 
//   let numProperties = properties.length; // Number of properties
 
//   // Loop through each property in the property array
//   properties.forEach(property => {
//       const Usage = property.meterAssociations;
//       const energyUsageData = (Usage as any).energyMeters;
//       const waterUsageData = (Usage as any).waterMeters;
//       const wasteUsageData = (Usage as any).wasteMeters;
//       totalNumberOfEnergyMeters += energyUsageData.length;
//       totalNumberOfWaterMeters += waterUsageData.length;
//       totalNumberOfWasteMeters += wasteUsageData.length;

//       // Loop through the energy meters array 
//       energyUsageData.forEach((meter: any) => {
//           // Loop through the energyConsumption array which contains all the bills
//           meter.energyConsumption.forEach((consumption: any) => {
//               let quantity = parseFloat(consumption.usage);
//               totalEnergyUsage += isNaN(quantity) ? 0 : quantity;
//               propertiesEnergyUse += isNaN(quantity) ? 0 : quantity;
//               let cost = parseFloat(consumption.cost);
//               totalEnergyCost += isNaN(cost) ? 0 : cost;
//           });
//       });

//       // Loop through the water meters array 
//       waterUsageData.forEach((meter: any) => {
//           // Loop through the energyConsumption array which contains all the bills
//           meter.energyConsumption.forEach((consumption: any) => {
//               let quantity = parseFloat(consumption.usage);
//               totalWaterUsage += isNaN(quantity) ? 0 : quantity;
//               let cost = parseFloat(consumption.cost);
//               totalWaterCost += isNaN(cost) ? 0 : cost;
              
//           });
//       });

//       // Loop through the waste meters array 
//       wasteUsageData.forEach((meter: any) => {
//           // Loop through the energyConsumption array which contains all the bills
//           meter.energyConsumption.forEach((consumption: any) => {
//               let quantity = parseFloat(consumption.quantity);
//               totalWasteUsage += isNaN(quantity) ? 0 : quantity;
//               let cost = parseFloat(consumption.cost);
//               totalWasteCost += isNaN(cost) ? 0 : cost;
              
//           });
//       });
//       // Adding up the total cost of all meters for an individual property
//       propertiesTotalCost = totalEnergyCost + totalWasteCost + totalWaterCost;
//       propertiesTotalCost = Math.round((propertiesTotalCost + Number.EPSILON) * 100) / 100;
//       // Store that properties total cost in an array called individual properties total cost 
//       individualPropertiesTotalCost.push(propertiesTotalCost);
//       // Reset the value of propertiesTotalCost to zero so the next property being looped through starts at 0 cost and not added up from the previous property
//       propertiesTotalCost = 0;
//       propertiesEnergyUse = Math.round((propertiesEnergyUse + Number.EPSILON) * 100) / 100;
//       // Storing the individual properties electricity usage in an array called individualPropertiesElectricUse 
//       individualPropertiesElectricUse.push(propertiesEnergyUse);
//       // Reset the value of propertiesEnergyUse to zero so the next property being looped through starts its electricity use at 0 
//       propertiesEnergyUse = 0;
      
      
      
//   });
//   // Calculate the total number of meters from each property added up
//   totalNumberOfMeters = totalNumberOfWasteMeters + totalNumberOfEnergyMeters + totalNumberOfWaterMeters;

//   // Calculate the average
//   totalEnergyUsage /= numProperties;
//   totalWaterUsage /= numProperties;
//   totalWasteUsage /= numProperties;
//   totalEnergyCost /= numProperties;
//   totalWaterCost /= numProperties;
//   totalWasteCost /= numProperties;
  
//   // Populate consumption data
//   totalEnergyUsage = Math.round((totalEnergyUsage + Number.EPSILON) * 100) / 100;
//   totalWaterUsage = Math.round((totalWaterUsage + Number.EPSILON) * 100) / 100;
//   totalWasteUsage = Math.round((totalWasteUsage + Number.EPSILON) * 100) / 100;
//   consumption_data = [
//       { month: 'Recent', name: 'Electricity', value: totalEnergyUsage, type: 'Electricity', fill: '#8884d8' },
//       { month: 'Recent', name: 'Water', value: totalWaterUsage, type: 'Water', fill: '#82ca9d' },
//       { month: 'Recent', name: 'Waste', value: totalWasteUsage, type: 'Waste', fill: '#FF8042' },
//   ];

//   // Round cost to 2 decimal number.... i dont think i need to use this for overview 
//   totalEnergyCost = Math.round((totalEnergyCost + Number.EPSILON) * 100) / 100;
//   totalWaterCost = Math.round((totalWaterCost + Number.EPSILON) * 100) / 100;
//   totalWasteCost = Math.round((totalWasteCost + Number.EPSILON) * 100) / 100;

//   // Populate the cost data for the pie chart on overview 
//   cost_data = [
//       { month: 'Recent', name: properties[0].name, value: individualPropertiesTotalCost[0], type: 'Cost', fill: '#8884d8' },
//       { month: 'Recent', name: properties[1].name, value: individualPropertiesTotalCost[1], type: 'Cost', fill: '#82ca9d' },
//       { month: 'Recent', name: properties[2].name, value: individualPropertiesTotalCost[2], type: 'Cost', fill: '#82ca9d' },
//       { month: 'Recent', name: properties[3].name, value: individualPropertiesTotalCost[3], type: 'Cost', fill: '#82ca9d' },
//       { month: 'Recent', name: properties[4].name, value: individualPropertiesTotalCost[4], type: 'Cost', fill: '#FF8042' }
//   ];

//   // Populate the electricity data for the electricity graph on overview
//   electricity_data = [
//     { month: 'Recent', name: properties[0].name, value: individualPropertiesElectricUse[0], type: 'Electricity', fill: '#8884d8' },
//     { month: 'Recent', name: properties[1].name, value: individualPropertiesElectricUse[1], type: 'Electricity', fill: '#82ca9d' },
//     { month: 'Recent', name: properties[2].name, value: individualPropertiesElectricUse[2], type: 'Electricity', fill: '#82ca9d' },
//     { month: 'Recent', name: properties[3].name, value: individualPropertiesElectricUse[3], type: 'Electricity', fill: '#82ca9d' },
//     { month: 'Recent', name: properties[4].name, value: individualPropertiesElectricUse[4], type: 'Electricity', fill: '#FF8042' }
// ];
 

//   return { consumption_data, cost_data, highestConsumer_data, electricity_data, totalNumberOfMeters };
// }

// Currently getting the most recent bill for each property for energy, water, and waste for their usage and cost 
function processAllPropertyRecent(properties: PropertyDetails[]): { 
  recentConsumption_data: ConsumptionData[], 
  recentCost_data: ConsumptionData[], 
  changeinCost_data: ConsumptionData[],
  totalNumberOfMeters: number,
  recentHighestConsumer_data: ConsumptionData[] 
} {
  let recentConsumption_data: ConsumptionData[] = [];
  let recentCost_data: ConsumptionData[] = [];
  let changeinCost_data: ConsumptionData[] = [];
  let recentHighestConsumer_data: ConsumptionData[] = [];
  let recentTotalEnergyUsage = 0;
  let recentTotalWaterUsage = 0;
  let recentTotalWasteUsage = 0;
  let recentTotalEnergyCost = 0;
  let recentTotalWaterCost = 0;
  let recentTotalWasteCost = 0;
  let change_cost = 0;
  let currentMonthCost = 0;
  let pastMonthCost = 0;
  let current_costEnergy = 0;
  let current_costWaste = 0;
  let current_costWater = 0;
  let past_costEnergy = 0;
  let past_costWaste = 0;
  let past_costWater = 0;
  let numProperties = properties.length; // Number of properties
  let highestEngergyMeterName = '';
  let recentHighestEnergyMeterUsage = 0;
  let recentHighestWaterMeterName = '';
  let recentHighestWaterMeterUsage = 0;
  let recentHighestWasteMeterName = '';
  let recentHighestWasteMeterUsage = 0;
  let fiveMonthsElectric: number[] =[];
  let individualPropertiesRecentCost: number[] = [];
  let addedUpRecentCost = 0;
  let totalNumberOfMeters = 0;
  let totalNumberOfEnergyMeters = 0;
  let totalNumberOfWaterMeters = 0;
  let totalNumberOfWasteMeters = 0;
 // electricityData.addedUpRecentCost = "something";

 // looping through each property
  properties.forEach(property => {
      const Usage = property.meterAssociations;
      const energyUsageData = (Usage as any).energyMeters;
      const waterUsageData = (Usage as any).waterMeters;
      const wasteUsageData = (Usage as any).wasteMeters;
      totalNumberOfEnergyMeters += energyUsageData.length;
      totalNumberOfWaterMeters += waterUsageData.length;
      totalNumberOfWasteMeters += wasteUsageData.length;

      // looping through electriciy meter
      energyUsageData.forEach((meter: {
          details: any;
          name: string; 
          energyConsumption: {
              startDate: any; 
              usage: string | number; 
              cost: string | number; 
          }[];
      }) => {
          const sorted = meter.energyConsumption.sort((a, b) => new Date((b as any).startDate).getTime() - new Date((a as any).startDate).getTime());
          const recentDate = sorted[0].startDate;                     
          current_costEnergy = parseFloat(sorted[0]?.cost as string); // getting the most recent month for this meter for current month vs past month graph
          past_costEnergy = parseFloat(sorted[1]?.cost as string);    // getting the past month behind the current month for this meter for current month vs past month graph
         
          for (let i = 0; i < meter.energyConsumption.length; i++) {
              if ((meter.energyConsumption[i].startDate as any) === recentDate) {
                  let quantity = parseFloat(meter.energyConsumption[i]?.usage as string);
                  if (quantity > recentHighestEnergyMeterUsage) {
                      recentHighestEnergyMeterUsage = quantity;
                      highestEngergyMeterName = meter.details.name;
                  }
                  let cost = parseFloat(meter.energyConsumption[i]?.cost as string);
                  
                  recentTotalEnergyCost += isNaN(cost) ? 0 : cost;
                  recentTotalEnergyUsage += isNaN(quantity) ? 0 : quantity;
              }
          }
          // for (let i = 0; i < meter.energyConsumption.length; i++)
          // {
          //   if ((meter.energyConsumption[i].startDate as any) === recentDate) {
          //     for (let j = i; j < i + 5; j++)
          //     {
          //       fiveMonthsElectric.push(parseFloat(meter.energyConsumption[j]?.usage as string));
          //     }
          //   }
          // }
          // console.log(fiveMonthsElectric);
      });

      // grap recent bill cycle for water usage with corresponding cost
      waterUsageData.forEach((meter: {
          details: any;
          name: string; 
          energyConsumption: {
              startDate: any; 
              usage: string | number; 
              cost: string | number; 
          }[];  
      }) => {
          const sorted = meter.energyConsumption.sort((a, b) => new Date((b as any).startDate).getTime() - new Date((a as any).startDate).getTime());
          const recentDate = sorted[0].startDate;
          current_costWater = parseFloat(sorted[0]?.cost as string); // getting the most recent month for this meter for current month vs past month graph
          past_costWater = parseFloat(sorted[1]?.cost as string);    // getting the oast month
          for (let i = 0; i < meter.energyConsumption.length; i++) {
              if ((meter.energyConsumption[i].startDate as any) === recentDate) {
                  let quantity = parseFloat(meter.energyConsumption[i]?.usage as string);
                  if (quantity > recentHighestWaterMeterUsage) {
                      recentHighestWaterMeterUsage = quantity;
                      recentHighestWaterMeterName = meter.details.name;
                  }
                  let cost = parseFloat(meter.energyConsumption[i]?.cost as string);
                  //let current_costWater =  parseFloat(meter.energyConsumption[0]?.cost as string);
                  recentTotalWaterCost += isNaN(cost) ? 0 : cost;
                  recentTotalWaterUsage += isNaN(quantity) ? 0 : quantity;
              }
          }
      });

      // grap recent bill cycle for waste usage with corresponding cost
      wasteUsageData.forEach((meter: {
          details: any;
          name: string; 
          energyConsumption: {
              startDate: any; 
              quantity: string; 
              cost: string | number; 
          }[]; 
      }) => {
          const sorted = meter.energyConsumption.sort((a, b) => new Date((b as any).startDate).getTime() - new Date((a as any).startDate).getTime());
          const recentDate = sorted[0].startDate;
          current_costWaste = parseFloat(sorted[0]?.cost as string);  // getting the most recent month for this meter for current month vs past month graph
          past_costWaste = parseFloat(sorted[1]?.cost as string);     // getting the past month
          for (let i = 0; i < meter.energyConsumption.length; i++) {
              if ((meter.energyConsumption[i].startDate as any) === recentDate) {
                  let quantity = parseFloat(meter.energyConsumption[i]?.quantity as string);
                  if (quantity > recentHighestWasteMeterUsage) {
                      recentHighestWasteMeterUsage = quantity;
                      recentHighestWasteMeterName = meter.details.name;
                  }
                  let cost = parseFloat(meter.energyConsumption[i]?.cost as string);
                  //let current_costWaste =  parseFloat(meter.energyConsumption[0]?.cost as string);
                  recentTotalWasteCost += isNaN(cost) ? 0 : cost;
                  recentTotalWasteUsage += isNaN(quantity) ? 0 : quantity;
              }
          }
      });
      // add up the recent costs of all meters
      addedUpRecentCost = recentTotalEnergyCost + recentTotalWasteCost + recentTotalWaterCost;
      addedUpRecentCost = Math.round((addedUpRecentCost + Number.EPSILON) * 100) / 100;
      individualPropertiesRecentCost.push(addedUpRecentCost);
      addedUpRecentCost = 0;
      
  });
  // adding up the total number of meters from each property combined
  totalNumberOfMeters = totalNumberOfWasteMeters + totalNumberOfEnergyMeters + totalNumberOfWaterMeters;   
  // Data to be used for the change in cost between current and past month graph on overview
  // Adding the latest month cost of all properties from all three different meters divided by the number of properties for the average 
  currentMonthCost = current_costEnergy + current_costWaste + current_costWater / numProperties;
  // Adding the past month cost of all properties from all three different meters divided by the number of properties for the average 
  pastMonthCost = past_costEnergy + past_costWaste + past_costWater / numProperties;

  // Populate recent consumption data
  recentTotalEnergyUsage = Math.round((recentTotalEnergyUsage + Number.EPSILON) * 100) / 100;
  recentTotalWaterUsage = Math.round((recentTotalWaterUsage + Number.EPSILON) * 100) / 100;
  recentTotalWasteUsage = Math.round((recentTotalWasteUsage + Number.EPSILON) * 100) / 100;

  // Populate change in cost data
  
  recentConsumption_data = [
      { month: 'Recent', name: 'Electricity', value: recentTotalEnergyUsage, type: 'Electricity', fill: '#8884d8' },
      { month: 'Recent', name: 'Water', value: recentTotalWaterUsage, type: 'Water', fill: '#82ca9d' },
      { month: 'Recent', name: 'Waste', value: recentTotalWasteUsage, type: 'Waste', fill: '#FF8042' },
  ];

  // Populate recent cost data
  recentTotalEnergyCost = Math.round((recentTotalEnergyCost + Number.EPSILON) * 100) / 100;
  recentTotalWaterCost = Math.round((recentTotalWaterCost + Number.EPSILON) * 100) / 100;
  recentTotalWasteCost = Math.round((recentTotalWasteCost + Number.EPSILON) * 100) / 100;
  recentCost_data = [
      { month: 'Recent', name: properties[0].name, value: individualPropertiesRecentCost[0], type: 'Cost', fill: '#8884d8' },
      { month: 'Recent', name: properties[1].name, value: individualPropertiesRecentCost[1], type: 'Cost', fill: '#82ca9d' },
      { month: 'Recent', name: properties[2].name, value: individualPropertiesRecentCost[2], type: 'Cost', fill: '#82ca9d' },
      { month: 'Recent', name: properties[3].name, value: individualPropertiesRecentCost[3], type: 'Cost', fill: '#82ca9d' },
      { month: 'Recent', name: properties[4].name, value: individualPropertiesRecentCost[4], type: 'Cost', fill: '#FF8042' }
  ];

  changeinCost_data = [
    { month: 'Recent', name: 'Past Cost', value: pastMonthCost, type : 'Cost',fill: '#82ca9d' },
    { month: 'Recent', name: 'Current Cost', value: currentMonthCost, type : 'Cost', fill: '#82ca9d'},
  ];

  recentHighestConsumer_data = [
      { month: 'Recent', name: highestEngergyMeterName, value: recentHighestEnergyMeterUsage, type: 'Electricity', fill: '#8884d8' },
      { month: 'Recent', name: recentHighestWaterMeterName, value: recentHighestWaterMeterUsage, type: 'Water', fill: '#82ca9d' },
      { month: 'Recent', name: recentHighestWasteMeterName, value: recentHighestWasteMeterUsage, type: 'Waste', fill: '#FF8042' },
  ];

  return { recentConsumption_data, recentCost_data, recentHighestConsumer_data, changeinCost_data, totalNumberOfMeters };
}





export default function Home(this: any) {
  const { properties } = useDataContext();
  let consumption_data: ConsumptionData[] = [];
  let cost_data: PropertyData[] = [];
  let highestConsumer_data: ConsumptionData[] = [];
  let electricity_data: ElectricityUsage[] = [];
  let totalNumberOfMeters = 0;
  let cost_data_added = 0;
  let numberOfProperties = 0;
  let numberOfMeters = 0;
  

 
  let recentConsumption_data: ConsumptionData[] = [];
  let recentCost_data: ConsumptionData[] = [];
  let recentHighestConsumer_data: ConsumptionData[] = [];
  let changeinCost_data: ConsumptionData[] = [];

  if (properties && properties.length > 0) {
    // Process data for all properties focusing on the most recent data
    const processedData = processAllPropertyRecent(properties);
    recentConsumption_data = processedData.recentConsumption_data;
    recentCost_data = processedData.recentCost_data;
    recentHighestConsumer_data = processedData.recentHighestConsumer_data;
    changeinCost_data = processedData.changeinCost_data;
    // adding the cost data from all properties for the pie chart text area 
    cost_data_added = recentCost_data[0].value + recentCost_data[1].value + recentCost_data[2].value + recentCost_data[3].value + recentCost_data[4].value;
    totalNumberOfMeters = processedData.totalNumberOfMeters;
    numberOfProperties = properties.length;
    

  }

  // stuff above is what I changed
  const [date, setDate] = useState<Date>();
  useEffect(() => {
    setDate(new Date());
  },[]);

  return (
    <div className="grid grid-cols-6 xl:gap-6 gap-2 h-full mb-6 lg:overflow-y-auto xl:pr-6">
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

      <Card className='flex flex-col md:col-span-3 col-span-6 min-h-[500px] h-full w-full'>
        <CardHeader>
          <CardTitle>Energy Costs</CardTitle>
          <CardDescription>Total Monthly Costs From All Properties</CardDescription>
        </CardHeader>

        <CardContent className='flex-grow'>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart >
              <Pie
                cy="100%"
                data={recentCost_data}
                startAngle={180}
                endAngle={0}
                innerRadius={160}
                outerRadius={200}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(2)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} contentStyle={{ backgroundColor: "#000"}} />
              <Legend align='center' verticalAlign='bottom' height={36} 
                wrapperStyle={{
                  paddingTop: "1rem"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>

        <CardFooter>
          <p>

          <span className="text-blue-500">{recentCost_data && recentCost_data[0] ? recentCost_data[0].value : ""}$</span> + 
          <span className="text-green-500">{recentCost_data && recentCost_data[1] ? recentCost_data[1].value : ""}$</span> + 
          <span className="text-yellow-500">{recentCost_data && recentCost_data[2] ? recentCost_data[2].value : ""}$</span> + 
          <span className="text-orange-500">{recentCost_data && recentCost_data[3] ? recentCost_data[3].value : ""}$</span> + 
          <span className="text-blue-400">{recentCost_data && recentCost_data[4] ? recentCost_data[4].value : ""}$</span> = 
          <span className="text-white-700">{cost_data_added}$</span>

          </p>
 
        </CardFooter>
      </Card>

      <Card className='flex flex-col md:col-span-3 col-span-6 min-h-[500px] h-fit sm:h-full w-full'>
        <CardHeader>
          <CardTitle>Change In Cost</CardTitle>
          <CardDescription>Compare Current and Last Month Costs</CardDescription>
        </CardHeader>

        <CardContent className='flex-grow'>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={changeinCost_data}
              margin={{
                top: 10,
                right: 10,
                left: -15,
                bottom: 10,
              }}
            >
              <CartesianGrid opacity={0.15} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} contentStyle={{ backgroundColor: "#000"}} />
              <Legend />
              <Bar dataKey="value"  name="Cost" fill="#82ca9d" />
              {/* <Bar dataKey="" fill="#82ca9d" /> */}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className='2xl:col-span-2 md:col-span-3 col-span-6 aspect-square h-full w-full'>
        <CardHeader>
          <CardTitle>Active Elements</CardTitle>
          <CardDescription>Total Amount of Properties & Meters</CardDescription>
        </CardHeader>

        <CardContent className='space-y-4'>
          <p className='flex items-center gap-4 text-lg'><Landmark className='w-12 h-auto' />{numberOfProperties} Properties</p>
          <p className='flex items-center gap-4 text-lg'><Gauge className='w-12 h-auto' /> {totalNumberOfMeters} Meters</p>
          <p className='flex items-center gap-4 text-lg'><Thermometer className='w-12 h-auto' /> 0 Sub-Meters</p>
        </CardContent>

        <CardFooter className='flex-col items-start'>
          <hr className='w-full mb-4' />
          SOMETHING HERE!!!
          Maybe Connections like Energy Star/PG&E?
          Or we could include some type of information through the form of a paragraph.
        </CardFooter>
      </Card>

      <Card className='flex flex-col 2xl:col-span-2 md:col-span-3 col-span-6 aspect-square h-full w-full'>
        <CardHeader>
          <CardTitle>Consumption By Utilities</CardTitle>
          <CardDescription>Find Which Utility You Use The Most</CardDescription>
        </CardHeader>
              
        <CardContent className='flex-grow'>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={recentConsumption_data}
              margin={{
                top: 10,
                right: 10,
                left: -15,
                bottom: 10,
              }}
            >
              <CartesianGrid opacity={0.15} />
              <XAxis dataKey="name" />
              <YAxis />

              <Tooltip content={<CustomTooltip />} contentStyle={{ backgroundColor: "#000"}} />
              <Legend />
              <Bar dataKey="value" name="Utility Consumption"/>
              
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className='flex flex-col 2xl:col-span-2 col-span-6 2xl:aspect-square xl:aspect-video aspect-square h-full w-full'>
        <CardHeader>
          <CardTitle>Carbon Footprint</CardTitle>
          <CardDescription>Monthly Total CO2 Emission</CardDescription>
        </CardHeader>

        <CardContent className='flex-grow'>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart
              margin={{
                top: 40,
                right: 40,
                left: 40,
                bottom: 40,
              }}
            >
              <Pie
                dataKey="value"
                isAnimationActive={false}
                data={carbon_data}
                cx="50%"
                cy="50%"
                outerRadius="100%"
                label={renderCustomizedLabel}
                labelLine={false}
              >
                {carbon_data.map((entry, index) => (
                  <Cell key={'cell-${index}'} fill={entry.fill} />
                ))}
              </Pie>
            <Tooltip content={<CustomTooltip />}/>
            <Legend align='center' verticalAlign='bottom' height={36} 
              wrapperStyle={{
                paddingTop: "1rem"
              }}
            />
          </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
