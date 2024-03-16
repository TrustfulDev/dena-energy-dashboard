"use client";
import {  Cell, PieChart, Label, Pie, LineChart, Line, BarChart, Bar,XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Landmark, Gauge, Thermometer } from 'lucide-react';
import { PropertyDetails } from '@/lib/propertiesApi';
// interface
interface ConsumptionData {
  month: string;
  name: string;
  value: number;
  type: string;
  fill: string;
}
interface MonthlyUsage {
  [key: string]: { [key: string]: number };
}
interface DataEntry {
  propertyName: string;
  yearMonth: string;
  value: number;
}
interface ChartDataEntry {
  month: string;
  [key: string]: string | number;
}
// data units
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const { name, value, type } = payload[0].payload;
    const unit = type === 'Electricity' ? ' kWh' : type === 'Waste' ? ' pounds' : type === 'Water' ? ' gallons' : type === 'Natrual Gas' ? 'therm' : type === 'Cost' ? ' $' : '';
    return (
      <div className="custom-tooltip backdrop-blur-md text-neutral-200 p-4 font-bold rounded-sm">
        <p className="drop-shadow text-lg">{`${name}: ${value} ${unit}`}</p>
      </div>
    );
  }
  return null;
};

// colors for pie chart with padding angle 
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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

function OverallElectricityUsage(properties: PropertyDetails[]): ChartDataEntry[] {
  let overview_data: DataEntry[] = [];
  properties.forEach(property => {
    const Usage = property.meterAssociations;
    const electricityUsageData = (Usage as any).electricMeters;
    // looping through electriciy meter
    electricityUsageData.forEach((meter: {
      details: any; 
      name: string; energyConsumption: {
      startDate: any; usage: string | number; cost: string | number; }[];}) => {
        const sorted = meter.energyConsumption.sort((a, b) => new Date((b as any).startDate).getTime() - new Date((a as any).startDate).getTime());
        // hardcoded for now, should change to real current date if we have real data
        const recentDate = "2019";
        for(let i = 0; i < sorted.length; i++){
          if((sorted[i].startDate.slice(0,4) as any) === recentDate){
          let usage = parseFloat(sorted[i]?.usage as string);  
          const newItem:  DataEntry = {
            propertyName: property.name,
            yearMonth: sorted[i].startDate.slice(0,7),
            value: isNaN(usage) ? 0 : usage,
          };
        overview_data.push(newItem);
        } 
      }
    });
  });
  // organize to monthly property usage data
  const processData = (data: DataEntry[]): MonthlyUsage => {
    const monthlyData: MonthlyUsage = {};
    data.forEach((entry) => {
      const [year, month] = entry.yearMonth.split('-');
      const monthYear = `${year}-${month}`;
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {};
      }
      monthlyData[monthYear][entry.propertyName] = entry.value;
    });
    return monthlyData;
  };
  // covert to the data format to Rechart graph format
  const convertToChartData = (processedData: MonthlyUsage): ChartDataEntry[] => {
    const chartData: ChartDataEntry[] = Object.entries(processedData).map(([month, usage]) => ({
      month,
      ...usage
    }));
    return chartData;
  };

  const processedData = processData(overview_data);
  const chartData = convertToChartData(processedData);  
  return chartData;
 }
 

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
  let individualPropertiesRecentCost: number[] = [];
  let addedUpRecentCost = 0;
  let totalNumberOfMeters = 0;
  let totalNumberOfEnergyMeters = 0;
  let totalNumberOfWaterMeters = 0;
  let totalNumberOfWasteMeters = 0;
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
        name: string; energyConsumption: {
        startDate: any; usage: string | number; cost: string | number; }[];}) => {
          const sorted = meter.energyConsumption.sort((a, b) => new Date((b as any).startDate).getTime() - new Date((a as any).startDate).getTime());
          const recentDate = sorted[0].startDate;                     
          current_costEnergy = parseFloat(sorted[0]?.cost as string); // getting the most recent month for this meter for current month vs past month graph
          past_costEnergy = parseFloat(sorted[1]?.cost as string);    // getting the past month behind the current month for this meter for current month vs past month graph
          let j = 0;
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
      });

      // grap recent bill cycle for water usage with corresponding cost
      waterUsageData.forEach((meter: {
          details: any;
          name: string; energyConsumption: {
          startDate: any; usage: string | number; cost: string | number; }[]; }) => {
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
          name: string; energyConsumption: {
          startDate: any; quantity: string; cost: string | number; }[]; }) => {
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
  currentMonthCost = (current_costEnergy + current_costWaste + current_costWater) / numProperties;
  // Adding the past month cost of all properties from all three different meters divided by the number of properties for the average 
  pastMonthCost = (past_costEnergy + past_costWaste + past_costWater) / numProperties;
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
    { month: 'Recent', name: 'Current Cost', value: currentMonthCost, type : 'Cost', fill: '#8884d8'},
  ];

  recentHighestConsumer_data = [
    { month: 'Recent', name: highestEngergyMeterName, value: recentHighestEnergyMeterUsage, type: 'Electricity', fill: '#8884d8' },
    { month: 'Recent', name: recentHighestWaterMeterName, value: recentHighestWaterMeterUsage, type: 'Water', fill: '#82ca9d' },
    { month: 'Recent', name: recentHighestWasteMeterName, value: recentHighestWasteMeterUsage, type: 'Waste', fill: '#FF8042' },
  ];

  return { recentConsumption_data, recentCost_data, recentHighestConsumer_data, changeinCost_data, totalNumberOfMeters };
}

export const Overview = ({
    properties
} : {
    properties: PropertyDetails[]
}) => {
  let totalNumberOfMeters = 0;
  let cost_data_added = 0;
  let numberOfProperties = 0;
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
  const Data = OverallElectricityUsage(properties);
  const chartData = Data.reverse();
  const legendItems = chartData.length > 0 ? Object.keys(chartData[0]).filter(key => key !== 'month') : [];

    return (
        <div className="grid grid-cols-6 xl:gap-6 gap-2 h-full mb-6 lg:overflow-y-auto xl:pr-6">
            <Card className='w-full flex flex-col col-span-6 min-h-[500px]'>
                <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    Overall Electricity Usage
                </CardTitle>

                <CardDescription>Electricity Usage From All Properties (kWh)</CardDescription>
                </CardHeader>

                <CardContent className='flex-grow'>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                    width={500}
                    height={300}
                    data={chartData}
                    margin={{
                        top: 0,
                        right: 10,
                        left: 10,
                        bottom: 0,
                    }}
                    >
                    <CartesianGrid opacity={0.15} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip contentStyle={{ backgroundColor: "#000"}} />
                    <Legend />
                      {legendItems.map((propertyName, index) => (
                        <Line
                          key={propertyName}
                          type="monotone"
                          dataKey={propertyName}
                          stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`} // Random color for each line
                          activeDot={{ r: 8 }}
                        />
                      ))}
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
                    cy="45%"
                    cx = "45%"
                    data={recentCost_data}
                    startAngle={360}
                    endAngle={0}
                    innerRadius={80}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={3}
                    dataKey="value"
                    label={({ percent }) => `${(percent * 100).toFixed(2)}%`}
                  >
                  <Label value={`Total: ${cost_data_added}`} position="center" />
                  {recentCost_data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} contentStyle={{ backgroundColor: "#000"}} />
                  <Legend align='left' />
                </PieChart>
                </ResponsiveContainer>
                </CardContent>

                <CardFooter>
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
                      left: 10,
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
                      left: 25,
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