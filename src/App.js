// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';
import Heatmap from 'react-heatmap-grid';
import './App.css';

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
      <nav className="navbar">
        <h1>Dashboard</h1>
      </nav>
      <div className="container">
        {/* Sidebar */}
        <div className="sidebar">
          <h2>Filters</h2>
          <div className="filter">
            <label htmlFor="endYear">End Year</label>
            <select name="endYear" id="endYear" value={filters.endYear} onChange={handleFilterChange}>
              <option value="">All</option>
              {filterOptions.endYears.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>
          <div className="filter">
            <label htmlFor="topic">Topic</label>
            <select name="topic" id="topic" value={filters.topic} onChange={handleFilterChange}>
              <option value="">All</option>
              {filterOptions.topics.map(topic => <option key={topic} value={topic}>{topic}</option>)}
            </select>
          </div>
          <div className="filter">
            <label htmlFor="sector">Sector</label>
            <select name="sector" id="sector" value={filters.sector} onChange={handleFilterChange}>
              <option value="">All</option>
              {filterOptions.sectors.map(sector => <option key={sector} value={sector}>{sector}</option>)}
            </select>
          </div>
          <div className="filter">
            <label htmlFor="region">Region</label>
            <select name="region" id="region" value={filters.region} onChange={handleFilterChange}>
              <option value="">All</option>
              {filterOptions.regions.map(region => <option key={region} value={region}>{region}</option>)}
            </select>
          </div>
          <div className="filter">
            <label htmlFor="pest">Pest</label>
            <select name="pest" id="pest" value={filters.pest} onChange={handleFilterChange}>
              <option value="">All</option>
              {filterOptions.pests.map(pest => <option key={pest} value={pest}>{pest}</option>)}
            </select>
          </div>
          <div className="filter">
            <label htmlFor="source">Source</label>
            <select name="source" id="source" value={filters.source} onChange={handleFilterChange}>
              <option value="">All</option>
              {filterOptions.sources.map(source => <option key={source} value={source}>{source}</option>)}
            </select>
          </div>
          <div className="filter">
            <label htmlFor="swot">SWOT</label>
            <select name="swot" id="swot" value={filters.swot} onChange={handleFilterChange}>
              <option value="">All</option>
              {filterOptions.swots.map(swot => <option key={swot} value={swot}>{swot}</option>)}
            </select>
          </div>
          <div className="filter">
            <label htmlFor="country">Country</label>
            <select name="country" id="country" value={filters.country} onChange={handleFilterChange}>
              <option value="">All</option>
              {filterOptions.countries.map(country => <option key={country} value={country}>{country}</option>)}
            </select>
          </div>
        </div>

        {/* Main content */}
        <div className="main-content">
          <div className="chart">
            <Bar data={barChartData} />
          </div>
          <div className="chart">
            <Pie data={pieChartData} />
          </div>
          <div className="chart">
            <Line data={lineChartData} />
          </div>
          <div className="chart">
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
        </div>
      </div>
    </div>
  );
};

export default App;
