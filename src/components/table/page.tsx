"use client";

import { columns } from "@/components/table/column";
import type { Campaign } from "@/components/table/column";
import { DataTable } from "./data-table";

function getData(): Campaign[] {
  return [
    {
      id: "c001",
      name: "Lumiere Summer Launch",
      client: "Lumiere Skincare",
      status: "active",
      budget: 50000,
      spend: 32450,
      impressions: 2400000,
      clicks: 48000,
      conversions: 1200,
      startDate: "2026-03-28",
      endDate: "2026-06-30",
    },
    {
      id: "c002",
      name: "Winter Glow Campaign",
      client: "Glow Cosmetics",
      status: "paused",
      budget: 35000,
      spend: 18700,
      impressions: 1450000,
      clicks: 27500,
      conversions: 740,
      startDate: "2026-03-20",
      endDate: "2026-05-15",
    },
    {
      id: "c003",
      name: "Spring Refresh",
      client: "FreshSkin Labs",
      status: "completed",
      budget: 60000,
      spend: 59800,
      impressions: 3200000,
      clicks: 62000,
      conversions: 1800,
      startDate: "2026-01-10",
      endDate: "2026-03-31",
    },
  ];
}

export default function Table() {
  const data = getData();

  return (
    <div className="container mx-auto py-10 px-4">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
