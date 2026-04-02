import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

export type Campaign = {
  id: string
  name: string
  client: string
  status: "active" | "paused" | "completed" | "draft"
  budget: number
  spend: number
  impressions: number
  clicks: number
  conversions: number
  startDate: string
  endDate: string
}

const getStatusVariant = (status: Campaign["status"]) => {
  switch (status) {
    case "active":
      return "default"
    case "paused":
      return "secondary"
    case "completed":
      return "outline"
    case "draft":
      return "destructive"
    default:
      return "outline"
  }
}

export const columns: ColumnDef<Campaign>[] = [
  {
    accessorKey: "name",
    header: "Campaign Name",
  },
  {
    accessorKey: "client",
    header: "Client",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={getStatusVariant(row.original.status)}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "budget",
    header: "Budget",
    cell: ({ row }) => `$${row.original.budget.toLocaleString()}`,
  },
  {
    accessorKey: "spend",
    header: "Spend",
    cell: ({ row }) => `$${row.original.spend.toLocaleString()}`,
  },
  {
    accessorKey: "impressions",
    header: "Impressions",
  },
  {
    accessorKey: "clicks",
    header: "Clicks",
  },
  {
    accessorKey: "conversions",
    header: "Conversions",
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
  },
  {
    accessorKey: "endDate",
    header: "End Date",
  },
]
