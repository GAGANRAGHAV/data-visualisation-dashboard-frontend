// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';
import Heatmap from 'react-heatmap-grid';


import { Grid, Typography, FormControl, InputLabel, Select, MenuItem, Paper,  } from '@mui/material';
import Navbar from './Navbar';


Chart.register(CategoryScale);

const App = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    endYear: '',
    topic: '',
    sector: '',
    region: '',
    pest: '',
    source: '',
    swot: '',
    country: '',
    city: ''
  });
  const [filterOptions, setFilterOptions] = useState({
    endYears: [],
    topics: [],
    sectors: [],
    regions: [],
    pests: [],
    sources: [],
    swots: [],
    countries: [],
    cities: []
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://data-visualisation-dashboard-backend-xm6j.onrender.com/api/data', { params: filters });
      setData(response.data);
      updateFilterOptions(response.data);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  const updateFilterOptions = (data) => {
    setFilterOptions({
      endYears: [...new Set(data.map(item => item.endYear))].filter(Boolean),
      topics: [...new Set(data.map(item => item.topic))].filter(Boolean),
      sectors: [...new Set(data.map(item => item.sector))].filter(Boolean),
      regions: [...new Set(data.map(item => item.region))].filter(Boolean),
      pests: [...new Set(data.map(item => item.pest))].filter(Boolean),
      sources: [...new Set(data.map(item => item.source))].filter(Boolean),
      swots: [...new Set(data.map(item => item.swot))].filter(Boolean),
      countries: [...new Set(data.map(item => item.country))].filter(Boolean),
      cities: [...new Set(data.map(item => item.city))].filter(Boolean)
    });
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const barChartData = {
    labels: data.map(item => item.topic),
    datasets: [
      { label: 'Intensity', data: data.map(item => item.intensity), backgroundColor: 'rgba(75, 192, 192, 0.6)' },
      { label: 'Likelihood', data: data.map(item => item.likelihood), backgroundColor: 'rgba(153, 102, 255, 0.6)' },
      { label: 'Relevance', data: data.map(item => item.relevance), backgroundColor: 'rgba(255, 159, 64, 0.6)' }
    ]
  };

  const pieChartData = {
    labels: [...new Set(data.map(item => item.sector))],
    datasets: [
      {
        data: [...new Set(data.map(item => item.sector))].map(sector => data.filter(item => item.sector === sector).length),
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)']
      }
    ]
  };

  const lineChartData = {
    labels: data.map(item => item.published.split(', ')[1]), // Extract year from published date
    datasets: [
      { label: 'Intensity', data: data.map(item => item.intensity), borderColor: 'rgba(75, 192, 192, 0.6)', fill: false },
      { label: 'Likelihood', data: data.map(item => item.likelihood), borderColor: 'rgba(153, 102, 255, 0.6)', fill: false },
      { label: 'Relevance', data: data.map(item => item.relevance), borderColor: 'rgba(255, 159, 64, 0.6)', fill: false }
    ]
  };

  const regions = [...new Set(data.map(item => item.region))];
  const years = [...new Set(data.map(item => item.published.split(', ')[1]))];

  const heatmapData = {
    xLabels: regions,
    yLabels: years,
    data: years.map(year =>
      regions.map(region => {
        const filteredData = data.filter(item => item.region === region && item.published.includes(year));
        return filteredData.reduce((acc, curr) => acc + curr.intensity, 0);
      })
    )
  };

  return (
    <div>
      <Navbar/>
      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid item xs={3}>
          <Paper style={{ padding: '20px' }}>
            <Typography variant="h6">Filters</Typography>
            <FormControl fullWidth variant="outlined" sx={{ marginBottom: '10px' }}>
              <InputLabel htmlFor="endYear">End Year</InputLabel>
              <Select
                value={filters.endYear}
                onChange={handleFilterChange}
                label="End Year"
                inputProps={{
                  name: 'endYear',
                  id: 'endYear',
                }}
              >
                <MenuItem value="">All</MenuItem>
                {filterOptions.endYears.map(year => <MenuItem key={year} value={year}>{year}</MenuItem>)}
              </Select>
            </FormControl>

               {/* Topic filter */}
               <FormControl fullWidth variant="outlined" sx={{ marginBottom: '10px' }}>
              <InputLabel htmlFor="topic">Topic</InputLabel>
              <Select
                value={filters.topic}
                onChange={handleFilterChange}
                label="Topic"
                inputProps={{
                  name: 'topic',
                  id: 'topic',
                }}
              >
                <MenuItem value="">All</MenuItem>
                {filterOptions.topics.map(topic => <MenuItem key={topic} value={topic}>{topic}</MenuItem>)}
              </Select>
            </FormControl>

            {/* Sector filter */}
            <FormControl fullWidth variant="outlined" sx={{ marginBottom: '10px' }}>
              <InputLabel htmlFor="sector">Sector</InputLabel>
              <Select
                value={filters.sector}
                onChange={handleFilterChange}
                label="Sector"
                inputProps={{
                  name: 'sector',
                  id: 'sector',
                }}
              >
                <MenuItem value="">All</MenuItem>
                {filterOptions.sectors.map(sector => <MenuItem key={sector} value={sector}>{sector}</MenuItem>)}
              </Select>
            </FormControl>

            {/* Region filter */}
            <FormControl fullWidth variant="outlined" sx={{ marginBottom: '10px' }}>
              <InputLabel htmlFor="region">Region</InputLabel>
              <Select
                value={filters.region}
                onChange={handleFilterChange}
                label="Region"
                inputProps={{
                  name: 'region',
                  id: 'region',
                }}
              >
                <MenuItem value="">All</MenuItem>
                {filterOptions.regions.map(region => <MenuItem key={region} value={region}>{region}</MenuItem>)}
              </Select>
            </FormControl>

            {/* Pest filter */}
            <FormControl fullWidth variant="outlined" sx={{ marginBottom: '10px' }}>
              <InputLabel htmlFor="pest">Pest</InputLabel>
              <Select
                value={filters.pest}
                onChange={handleFilterChange}
                label="Pest"
                inputProps={{
                  name: 'pest',
                  id: 'pest',
                }}
              >
                <MenuItem value="">All</MenuItem>
                {filterOptions.pests.map(pest => <MenuItem key={pest} value={pest}>{pest}</MenuItem>)}
              </Select>
            </FormControl>

            {/* Source filter */}
            <FormControl fullWidth variant="outlined" sx={{ marginBottom: '10px' }}>
              <InputLabel htmlFor="source">Source</InputLabel>
              <Select
                value={filters.source}
                onChange={handleFilterChange}
                label="Source"
                inputProps={{
                  name: 'source',
                  id: 'source',
                }}
              >
                <MenuItem value="">All</MenuItem>
                {filterOptions.sources.map(source => <MenuItem key={source} value={source}>{source}</MenuItem>)}
              </Select>
            </FormControl>

            {/* SWOT filter */}
            <FormControl fullWidth variant="outlined" sx={{ marginBottom: '10px' }}>
              <InputLabel htmlFor="swot">SWOT</InputLabel>
              <Select
                value={filters.swot}
                onChange={handleFilterChange}
                label="SWOT"
                inputProps={{
                  name: 'swot',
                  id: 'swot',
                }}
              >
                <MenuItem value="">All</MenuItem>
                {filterOptions.swots.map(swot => <MenuItem key={swot} value={swot}>{swot}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl fullWidth variant="outlined" sx={{ marginBottom: '10px' }}>
              <InputLabel htmlFor="country">Country</InputLabel>
              <Select
                value={filters.country}
                onChange={handleFilterChange}
                label="Country"
                inputProps={{
                  name: 'country',
                  id: 'country',
                }}
              >
                <MenuItem value="">All</MenuItem>
                {filterOptions.countries.map(country => <MenuItem key={country} value={country}>{country}</MenuItem>)}
              </Select>
              </FormControl>

            {/* Add other filter Select components similarly */}
          </Paper>
        </Grid>

        {/* Main content */}
        <Grid item xs={9}>
          <Paper style={{ padding: '20px' }}>
            <Bar data={barChartData} />
            <Pie data={pieChartData} />
            <Line data={lineChartData} />
            <div>
              <Heatmap
                xLabels={heatmapData.xLabels}
                yLabels={heatmapData.yLabels}
                data={heatmapData.data}
                xLabelsLocation={"bottom"}
                xLabelWidth={100}
                yLabelWidth={50}
                cellStyle={(background, value, min, max, data, x, y) => ({
                  background: `rgb(66, 86, 244, ${1 - (max - value) / (max - min)})`,
                  fontSize: "11.5px"
                })}
                cellRender={value => value && `${value}`}
              />
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default App;

