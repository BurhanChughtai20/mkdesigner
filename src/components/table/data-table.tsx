import { useState, useMemo } from "react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import type { ColumnDef } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData extends { startDate: string }, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [range, setRange] = useState(30)

  const filteredData = useMemo(() => {
    const today = new Date()
    const pastDate = new Date()
    pastDate.setDate(today.getDate() - range)

    return data.filter((item) => {
      const itemDate = new Date(item.startDate)
      return itemDate >= pastDate && itemDate <= today
    })
  }, [data, range])

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setRange(7)}>
          Last 7d
        </Button>
        <Button variant="outline" onClick={() => setRange(30)}>
          Last 30d
        </Button>
        <Button variant="outline" onClick={() => setRange(90)}>
          Last 90d
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-gray-50 dark:bg-zinc-800"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-gray-900 dark:text-white"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="dark:hover:bg-zinc-800"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-gray-800 dark:text-gray-200"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center dark:text-white"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
