"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { useMemo } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const chartConfig = {
  testimonials: {
    label: "Testimonials",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface Testimonial {
  id: string;
  createdAt: string;
  [key: string]: any;
}

interface DottedLineChartProps {
  testimonials?: Testimonial[];
}

export function DottedLineChart({ testimonials = [] }: DottedLineChartProps) {
  // Process testimonials to group by month
  const chartData = useMemo(() => {
    // Initialize all months with 0
    const monthCounts = new Array(12).fill(0);
    
    // Get current year to filter testimonials
    const currentYear = new Date().getFullYear();
    
    // Count testimonials per month
    testimonials.forEach((testimonial) => {
      const date = new Date(testimonial.createdAt);
      // Only count testimonials from current year
      if (date.getFullYear() === currentYear) {
        const month = date.getMonth(); // 0-11
        monthCounts[month]++;
      }
    });
    
    // Create chart data array for all 12 months
    // For months with 0, use 0 (line chart will show at baseline)
    return MONTHS.map((month, index) => ({
      month,
      testimonials: monthCounts[index],
    }));
  }, [testimonials]);

  // Calculate total testimonials for the year
  const totalTestimonials = useMemo(() => {
    return chartData.reduce((sum, data) => sum + data.testimonials, 0);
  }, [chartData]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Testimonials Overview
          <Badge
            variant="outline"
            className="text-green-500 bg-green-500/10 border-none ml-2"
          >
            <TrendingUp className="h-4 w-4" />
            <span>{totalTestimonials}</span>
          </Badge>
        </CardTitle>
        <CardDescription>Testimonials collected this year</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
            height={250}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="testimonials"
              type="linear"
              stroke="var(--color-testimonials)"
              dot={true}
              strokeDasharray="4 4"
              strokeWidth={2}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
