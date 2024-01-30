"use client"

import { useEffect, useState } from "react";
import TableComponent from "@/components/table/TableComponent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from '@mui/material/CircularProgress';
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import { Country } from "@/types/model";
import IconButton from "@mui/material/IconButton";
import { FaFilter } from "react-icons/fa";




export default function Home() {
  const [data, setData] = useState<Country[]>([]);
  const [filteredData, setFilteredData] = useState<Country[]>([]);
  const [hasStates, setHasStates] = useState<boolean | null>(null);
  const [continentFilter, setContinentFilter] = useState<string>('');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [showFilterInputs, setShowFilterInputs] = useState<boolean>(false);
  const [filterApplied, setFilterApplied] = useState<boolean>(false);
    
  
  useEffect(() => {
    const fetchData = async () => {
      //fetch country data
      try {
        const response = await fetch("./countryData.json");
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const fetchedData = await response.json();
        setData(fetchedData.countries);
        setFilteredData(fetchedData.countries);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false)
      }
    };

    fetchData();
  }, []);

  const handleChangePage = (newPage: number) => {
    //set page to new page
    setPage(newPage);
  };

  const handleFilter = () => {
    //filter data and set state to reflect the new filter
    const filtered = data.filter(
      (row) =>
        (hasStates === null || row.hasStates === hasStates) &&
        row.continent.toLowerCase().includes(continentFilter.toLowerCase())
    );
    setFilteredData(filtered);
    setPage(0);
    setFilterApplied(true);
  };

  const handleRemoveFilter = () => {
    // Reset filter and show all data
    setHasStates(null);
    setContinentFilter('');
    setFilterApplied(false); 
    setFilteredData(data)  
  };

  //show full name for each continent shortname
  const continentFullName: Record<string, string> = {
    AF: 'Africa',
    AN: 'Antarctica',
    AS: 'Asia',
    EU: 'Europe',
    NA: 'North America',
    OC: 'Oceania',
    SA: 'South America',
  };
  
  const uniqueContinentsData = Array.from(new Set(data.map((row) => row.continent))); // show unique continent data

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8">
      <Box className="w-full">
        <Paper className="w-full">
          <Box className="flex justify-between items-center p-3 mb-3">
            <Typography
              className="flex-1"
              variant="h6"
              id="tableTitle"
              component="div"
            >
              Country Data
            </Typography>
            <Box>
              <IconButton
              disabled={loading}
                onClick={() => {
                  setShowFilterInputs(!showFilterInputs);
                  setFilterApplied(false);
                }}
                className={`bg-${filterApplied ? 'blue' : 'gray'}-500 hover:bg-${filterApplied ? 'blue' : 'gray'}-700 text-white disabled:cursor-not-allowed`}
              >
                <FaFilter />
              </IconButton>           
            </Box>         
          </Box>
          {showFilterInputs && (
            <div className="flex flex-col p-4 mb-3">
              <TextField
                label="Filter by States"
                variant="outlined"
                value={hasStates === null ? 'all' : hasStates.toString()}
                onChange={(e) => setHasStates(e.target.value === 'all' ? null : e.target.value.toLowerCase() === 'true' ? true : e.target.value.toLowerCase() === 'false' ? false : null)}
                className="md:w-1/5"
                sx={{ mb: 3, }}
                select
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="true">Has State</MenuItem>
                <MenuItem value="false">Does Not Have State</MenuItem>
              </TextField>
              <TextField
                label="Filter by Continent"
                variant="outlined"
                value={continentFilter === '' ? 'all' : continentFilter}
                onChange={(e) => setContinentFilter(e.target.value === 'all' ? '' : e.target.value)}
                className="md:w-1/5 "
                sx={{ mb: 3, }}
                select
              >
                <MenuItem value="all">All</MenuItem>
                {uniqueContinentsData.map((continent) => (
                  <MenuItem key={continent} value={continent}>
                    {continentFullName[continent]}
                  </MenuItem>
                ))}
              </TextField>
              <Box className="md:flex items-center">
                <Button
                  variant="contained"
                  className="bg-blue-500 hover:bg-blue-700 text-white"
                  sx={{mr: 3}}
                  onClick={handleFilter}
                >
                  Apply Filter
                </Button>
                <Button
                  variant="contained"
                  className="bg-gray-500 hover:bg-gray-700 text-white"
                  onClick={handleRemoveFilter}
                >
                  Clear Filter
                </Button>
              </Box>
            </div>
          )}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
              <CircularProgress />
            </div>
          ) : (
            filteredData.length === 0 ? (
              <Typography variant="body1" align="center" style={{ padding: '16px' }}>
                No data to display.
              </Typography>
            ) : (
              <TableComponent data={filteredData} page={page} onChangePage={handleChangePage} />
            )
          )}
        </Paper>
      </Box>
    </main>
  );
}
