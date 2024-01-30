"use client"

import React, {useState} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableSortLabel from '@mui/material/TableSortLabel';
import { Country } from '@/types/model';

const rowsPerPageOptions = [10, 25, 50, 100];

interface TableComponentProps {
    data: Country[];
    page: number;
    onChangePage: (newPage: number) => void;
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {     
    const stabilizedThis = array?.map((el, index) => [el, index] as [any, number]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }
  
function getComparator(order: 'asc' | 'desc', orderBy: string) {
    return order === 'desc'
      ? (a: any, b: any) => descendingComparator(a, b, orderBy)
      : (a: any, b: any) => -descendingComparator(a, b, orderBy);
}
  
function descendingComparator<T>(a: T, b: T, orderBy:  keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
}

const TableComponent:React.FC<TableComponentProps> = ({data, page, onChangePage}) => {
    const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
    const [orderBy, setOrderBy] = useState<string>('nameUn');
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
    
        if (rowsPerPageOptions.includes(newRowsPerPage)) {
          setRowsPerPage(newRowsPerPage);
          onChangePage(0);
        }
    };
       
    const handleRequestSort = (property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    const sortedData = stableSort(data, getComparator(order, orderBy));
  
    return (
        <div className='w-full '>
            <TableContainer component={Paper} className='p-3'>
                <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>                           
                            Country Name                          
                        </TableCell>
                        <TableCell>                           
                            Code                            
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                            active={orderBy === 'nameUn'}
                            direction={orderBy === 'nameUn' ? order : 'asc'}
                            onClick={() => handleRequestSort('nameUn')}
                            >
                            Country NameUn
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>                        
                            Continent                        
                        </TableCell>
                        <TableCell>                           
                            Has States
                        </TableCell>              
                    </TableRow>
                </TableHead>
                <TableBody>
                {(rowsPerPage > 0
                    ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : sortedData
                    ).map((row, index) => (
                    <TableRow key={index}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.code}</TableCell>
                        <TableCell>{row.nameUn}</TableCell>
                        <TableCell>{row.continent}</TableCell>
                        <TableCell>{row.hasStates ? "Yes" : "No"}</TableCell>
                    </TableRow>
                    ))}
                    {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={5} />
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={rowsPerPageOptions}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => onChangePage(newPage)}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
}

export default TableComponent