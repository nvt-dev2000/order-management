import type { ReactNode } from "react";

import { EmptyState } from "@/components/common/empty-state";
import { TableSkeleton } from "@/components/common/table-skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface BaseTableColumn<T> {
  id: string;
  header: ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  cell: (row: T, index: number) => ReactNode;
}

export interface BaseTableProps<T> {
  columns: BaseTableColumn<T>[];
  data: T[];
  getRowKey: (row: T, index: number) => string;
  isLoading?: boolean;
  isError?: boolean;
  skeletonRows?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  errorTitle?: string;
  errorDescription?: string;
  footer?: ReactNode;
  wrapperClassName?: string;
  hideEmptyState?: boolean;
}

export function BaseTable<T>({
  columns,
  data,
  getRowKey,
  isLoading = false,
  isError = false,
  skeletonRows = 8,
  emptyTitle,
  emptyDescription,
  errorTitle,
  errorDescription,
  footer,
  wrapperClassName,
  hideEmptyState = false,
}: BaseTableProps<T>) {
  const columnCount = columns.length;

  if (isLoading) {
    return (
      <TableSkeleton
        columns={columnCount}
        rows={skeletonRows}
        className={wrapperClassName}
      />
    );
  }

  if (isError) {
    return (
      <div className={wrapperClassName}>
        <EmptyState
          title={errorTitle ?? "Error"}
          description={errorDescription}
        />
      </div>
    );
  }

  if (data.length === 0 && !hideEmptyState) {
    return (
      <div className={wrapperClassName}>
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  if (data.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-4", wrapperClassName)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.id} className={col.headerClassName}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={getRowKey(row, index)}>
              {columns.map((col) => (
                <TableCell key={col.id} className={col.cellClassName}>
                  {col.cell(row, index)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {footer}
    </div>
  );
}
