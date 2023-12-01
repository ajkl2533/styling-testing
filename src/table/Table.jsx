import React, { useState } from 'react';
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { makeData } from '../makeData';

const columnHelper = createColumnHelper();
// Make some columns!
const defaultColumns = [
  // Grouping Column
  columnHelper.group({
    header: 'Name',
    footer: (props) => props.column.id,
    columns: [
      // Accessor Column
      columnHelper.accessor('firstName', {
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      }),
      // Accessor Column
      columnHelper.accessor((row) => row.lastName, {
        id: 'lastName',
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: (props) => props.column.id,
      }),
    ],
  }),
  // Grouping Column
  columnHelper.group({
    header: 'Info',
    footer: (props) => props.column.id,
    columns: [
      // Accessor Column
      columnHelper.accessor('age', {
        header: () => 'Age',
        footer: (props) => props.column.id,
      }),
      // Grouping Column
      columnHelper.group({
        header: 'More Info',
        columns: [
          // Accessor Column
          columnHelper.accessor('visits', {
            header: () => <span>Visits</span>,
            footer: (props) => props.column.id,
          }),
          // Accessor Column
          columnHelper.accessor('status', {
            header: 'Status',
            footer: (props) => props.column.id,
          }),
          // Accessor Column
          columnHelper.accessor('progress', {
            header: 'Profile Progress',
            footer: (props) => props.column.id,
          }),
        ],
      }),
    ],
  }),
];

const DATA_LENGTH = 1000;
export function Table() {
  const [sorting, setSorting] = useState([]);
  const [data, setData] = useState(() => makeData(DATA_LENGTH));

  const table = useReactTable({
    data,
    columns: defaultColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),

    debugTable: true,
  });
  const refreshData = () => setData(() => makeData(DATA_LENGTH));

  return (
    <div>
      <button onClick={() => refreshData()}>Refresh data</button>

      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan} style={{ width: header.getSize() }}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
