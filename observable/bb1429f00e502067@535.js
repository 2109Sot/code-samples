function _1(md){return(
md`# Data visualization notebook

This notebook contains the visualizations developed by **Sotiris Sideris** for the **[Democracy Deferred](https://veza.news/investigative-series/democracy-deferred/)** investigation led by the **[Center for Collaborative Investigative Journalism (CCIJ)](https://ccij.io/)**.

The project examines election data from Nigeria’s 2023 presidential election to explore inconsistencies between publicly promised transparency mechanisms and the data ultimately released by the electoral commission.

Using interactive visualizations, this notebook explores patterns in the results, highlights anomalies in the dataset and provides tools for examining how votes were recorded across different regions.

The code and methodology are shared here for transparency and reproducibility. 

Please cite or attribute if reusing this method in reporting or research.`
)}

function _G2(require){return(
require("@antv/g2@4.0.2")
)}

function _G2Plot(require){return(
require("https://cdn.jsdelivr.net/npm/@antv/g2plot@2.4.23/dist/g2plot.min.js")
)}

function _ccijImageCredit(FileAttachment){return(
FileAttachment("CCIJ-image-credit (1).svg").image()
)}

function _g2plot(require,html,ccijImageCredit){return(
require('@antv/g2plot@2').then(async g2plot => {

  // -------------------------------------------------------------------
  // Dataset
  // -------------------------------------------------------------------
  // Each entry represents the share of election result documents by status.
  // The percentages are calculated from a total of 176,846 polling units.

  const data = [
    { category: 'Documents', status: 'Legible', percentage: 84.37, count: 149205 },
    { category: 'Documents', status: 'Blurred', percentage: 8.06, count: 14252 },
    { category: 'Documents', status: 'Not uploaded', percentage: 4.24, count: 7493 },
    { category: 'Documents', status: 'Wrong election', percentage: 1.72, count: 3039 },
    { category: 'Documents', status: 'Cancellation', percentage: 1.51, count: 2679 },
    { category: 'Documents', status: 'Other', percentage: 0.10, count: 178 },
  ];

  // -------------------------------------------------------------------
  // Color palette for document status categories
  // -------------------------------------------------------------------

  const colorMap = {
    'Legible': '#648fff',
    'Blurred': '#FF8282', 
    'Not uploaded': '#FFC941',  
    'Wrong election': '#9CE1E5',
    'Cancellation': '#9487E5',
    'Other': '#C6C8CE'
  };

  // -------------------------------------------------------------------
  // Chart wrapper
  // -------------------------------------------------------------------
  // This container holds the title, chart, explanatory notes, and credits.

  const wrapper = html`
    <div style="display: flex; flex-direction: column; align-items: flex-start; width: 600px; font-family: Helvetica;">

      <!-- Chart title -->
      <h3 style="text-align: left; padding-bottom: 8px; margin-bottom: 0; font-family: Helvetica; color: black; width: 100%;">
        Distribution of election result documents across Nigeria
      </h3>

      <!-- Subtitle -->
      <p style="text-align: left; font-size: 16px; margin-top: 4px; margin-bottom: 10px; font-family: Helvetica; color: black; max-width: 100%;">
        This chart provides an overview of document legibility and upload status from 176,846 polling units.
      </p>

      <!-- Legend label -->
      <div style="text-align: left; font-family: Helvetica;">
        <span style="font-size: 12px; font-weight: bold; color: black;">Document status</span>
        <span style="font-size: 11px; color: grey; margin-left: 3px;">Click to filter view</span>
      </div>

      <!-- Chart container -->
      <div id="bar-chart-container" style="width: 100%; height: 200px;"></div>

      <!-- Notes, data source, and credit -->
      <div style="max-width: 730px; display: flex; flex-direction: column; align-items: flex-start; margin-top: 10px;">

        <!-- Methodological note -->
        <p style="margin: 0; font-size: 11px; line-height: 1.4em; text-align: left; max-width: 730px;">
          <strong>Note:</strong> ‘Wrong election’ refers to election result documents for non-presidential elections and collation papers. 
          The ‘cancellation’ category includes both cancellations documented on EC40G forms and those written on blank papers. 
          ‘Other’ includes materials that do not fit into predefined categories, such as irrelevant images or presidential results written on blank paper.
        </p>

        <!-- Data source -->
        <p style="margin: 0; font-size: 11px; line-height: 1.4em; text-align: left;">
          <strong>Data Source:</strong> INEC Result Viewing (IReV) portal
        </p>

        <!-- Image credit -->
        <div style="margin-top: 8px; margin-left: -8px;">
          <img src=${await ccijImageCredit.src} alt="CCIJ Image Credit" style="width: 250px; height: auto;" />
        </div>

      </div>
    </div>
  `;

  // Select the container that will host the chart
  const container = wrapper.querySelector('#bar-chart-container');

  // -------------------------------------------------------------------
  // Chart configuration
  // -------------------------------------------------------------------

  const barPlot = new g2plot.Bar(container, {
    data,
    isStack: true,

    // Define axes
    xField: 'percentage',
    yField: 'category',
    seriesField: 'status',

    // Legend styling
    legend: {
      position: 'top-left',
      layout: 'horizontal',
      flipPage: false,
      itemSpacing: 8,
      itemName: {
        style: {
          fontSize: 12,
          fontFamily: 'Helvetica',
          fill: 'black',
        },
      },
    },

    // Apply custom colors for each category
    color: ({ status }) => colorMap[status],

    // X-axis formatting
    xAxis: {
      min: 0,
      max: 100,
      label: {
        formatter: (val) => `${val}%`,
        style: { 
          fontFamily: 'Helvetica', 
          fontSize: 12,
          color: 'black' 
        },
      },
      title: {
        text: '',
        style: {
          fontFamily: 'Helvetica',
          fontSize: 12,
          fill: 'grey',
        },
      },
    },

    // Tooltip configuration
    tooltip: {
      shared: false,
      showMarkers: false,

      customContent: (title, items) => {
        if (!items || items.length === 0) return '';

        const datum = items[0].data;
        const formattedCount = new Intl.NumberFormat().format(datum.count);

        return `
          <div style="font-family: Helvetica; color: black; max-width: 300px; line-height: 1.5;">
            <strong>${datum.status}:</strong> <strong>${datum.percentage}%</strong><br/>
            Document count: ${formattedCount}
          </div>
        `;
      },

      domStyles: {
        'g2-tooltip': {
          backgroundColor: 'white',
          border: '1px solid #ccc',
          fontFamily: 'Helvetica',
          color: 'black'
        }
      }
    },

  });

  // Render the chart
  barPlot.render();

  return wrapper;
})
)}

async function _barChartNotUploaded(html,ccijImageCredit,G2Plot)
{
  // -------------------------------------------------------------------
  // Chart wrapper
  // -------------------------------------------------------------------
  // This container holds the title, subtitle, chart, note, data source,
  // and image credit for the visualization.

  const wrapper = html`
    <div style="display: flex; flex-direction: column; align-items: flex-start; width: 100%; max-width: 700px; position: relative; font-family: Helvetica;">
      
      <!-- Title and subtitle -->
      <div style="width: 100%;">
        <h3 style="text-align: left; padding-bottom: 8px; margin-bottom: 0; font-family: Helvetica; color: black; width: 100%;">
          Kano state led the nation with the most polling sites not reporting results
        </h3>
        <p style="text-align: left; font-size: 16px; margin-top: 4px; margin-bottom: 10px; font-family: Helvetica; color: black; max-width: 100%;">
          More than 1,300 polling units in Kano alone did not upload vote totals.
        </p>
      </div>

      <!-- Chart container -->
      <div id="container" style="height: 400px; width: 100%;"></div>
      
      <!-- Notes, source, and credits -->
      <div
        style="max-width: 700px; display: flex; flex-direction: column; align-items: flex-start; margin-top: 10px; font-family: Helvetica;"
      >
        <!-- Methodological note -->
        <p style="margin: 0; font-size: 11px; line-height: 1.4em; text-align: left; max-width: 700px; font-family: Helvetica;">
          <strong>Note:</strong> Polling units across Nigeria were required to upload an official government form with vote totals.
        </p>

        <!-- Data source -->
        <p style="margin: 0; font-size: 11px; line-height: 1.4em; text-align: left; font-family: Helvetica;">
          <strong>Data Source:</strong> INEC Result Viewing (IReV) portal
        </p>

        <!-- Image credit -->
        <div style="margin-top: 8px; margin-left: -8px;">
          <img src=${await ccijImageCredit.src} alt="CCIJ Image Credit" style="width: 250px; height: auto;" />
        </div>
      </div>
    </div>
  `;

  const container = wrapper.querySelector('#container');

  // -------------------------------------------------------------------
  // Helper: format large numbers with comma separators
  // -------------------------------------------------------------------
  const commaFormatter = (value) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  // -------------------------------------------------------------------
  // Source data
  // -------------------------------------------------------------------
  // Each entry represents the number of polling units in a state
  // for which result documents were not uploaded to the IReV portal.

  let data = [
    { "State": "Kano", "Value": 1326 },
    { "State": "Anambra", "Value": 959 },
    { "State": "Rivers", "Value": 918 },
    { "State": "Oyo", "Value": 637 },
    { "State": "Imo", "Value": 626 },
    { "State": "Sokoto", "Value": 622 },
    { "State": "Kaduna", "Value": 577 },
    { "State": "Abia", "Value": 486 },
    { "State": "Taraba", "Value": 480 },
    { "State": "Zamfara", "Value": 473 },
    { "State": "Kwara", "Value": 432 },
    { "State": "Benue", "Value": 370 }
  ];

  // -------------------------------------------------------------------
  // Add ranking values for display
  // -------------------------------------------------------------------
  // This helper sorts the states by document count and prepends a rank
  // to the y-axis labels (e.g. "1. Kano").

  const addRankings = (data) => {
    const sortedData = [...data].sort((a, b) => b.Value - a.Value);
    sortedData.forEach((item, index) => {
      item.Rank = index + 1;
      item.StateWithRank = `${item.Rank}. ${item.State}`;
    });
    return sortedData;
  };

  // -------------------------------------------------------------------
  // Render chart
  // -------------------------------------------------------------------
  const renderBarChart = (data) => {
    const rankedData = addRankings(data);

    // Clear the container before rendering
    container.innerHTML = '';

    const xAxisOptions = {
      title: {
        text: 'Documents',
        style: {
          fontFamily: 'Helvetica',
          fontSize: 12,
          fill: 'grey',
        }
      },
      label: {
        formatter: (value) => commaFormatter(value),
        style: {
          fontFamily: 'Helvetica',
          fontSize: 12,
          fill: 'grey',
        }
      },
      min: 0,
      max: 1400,
      tickInterval: 200,
      nice: false,
    };

    const barChart = new G2Plot.Bar(container, {
      data: rankedData,
      xField: 'Value',
      yField: 'StateWithRank',
      seriesField: 'State',
      legend: false,
      xAxis: xAxisOptions,

      // Single-color bar palette for this chart
      color: '#FFC941',

      yAxis: {
        label: {
          style: {
            fontWeight: 'normal',
            color: 'black',
            fontSize: 14,
            fontFamily: 'Helvetica',
          },
          formatter: (text) => text
        }
      },

      tooltip: {
        showMarkers: false,
        customContent: (title, items) => {
          if (!items || items.length === 0) return '';

          const datum = items[0].data;
          const formattedValue = commaFormatter(datum.Value);

          return `<div style="font-family: Helvetica; color: black; max-width: 500px; line-height: 1.5; word-wrap: break-word;">
            <strong>${datum.State}:</strong> ${formattedValue} documents
          </div>`;
        },
        domStyles: {
          'g2-tooltip': {
            backgroundColor: 'white',
            border: '1px solid #ccc',
            fontFamily: 'Helvetica',
            color: 'black'
          },
        }
      },

      padding: [5, 20, 50, 85],
    });

    barChart.render();
  };

  // Initial render
  renderBarChart(data);

  return wrapper;
}


async function _stackedBarChartSimple(html,ccijImageCredit,G2Plot)
{
  // -------------------------------------------------------------------
  // Chart wrapper
  // -------------------------------------------------------------------
  // This container holds the title, subtitle, legend label, chart,
  // explanatory note, data source, and image credit.

  const wrapper = html`
    <div style="display: flex; flex-direction: column; align-items: flex-start; width: 100%; max-width: 700px; position: relative; font-family: Helvetica;">
      
      <!-- Title and subtitle -->
      <div style="width: 100%;">
        <h3 style="text-align: left; padding-bottom: 8px; margin-bottom: 0; font-family: Helvetica; color: black; width: 100%;">
          Gombe state led the nation with illegible voting result counts
        </h3>
        <p style="text-align: left; font-size: 16px; margin-top: 4px; margin-bottom: 10px; font-family: Helvetica; color: black; max-width: 100%;">
          Gombe had the highest percentage of blurry and unreadable voting counts out of all polling units in the state.
        </p>

        <!-- Legend label -->
        <div style="text-align: left; font-family: Helvetica;">
          <span style="font-size: 12px; font-weight: bold; color: black;">Document type</span>
          <span style="font-size: 11px; color: grey; margin-left: 3px;">Click to filter view</span>
        </div>
      </div>

      <!-- Chart container -->
      <div id="container" style="height: 400px; width: 100%;"></div>

      <!-- Note, source, and credit -->
      <div style="max-width: 730px; display: flex; flex-direction: column; align-items: flex-start; margin-top: 10px;">
        
        <!-- Methodological note -->
        <p style="margin: 0; font-size: 11px; line-height: 1.4em; text-align: left; max-width: 730px;">
          <strong>Note:</strong> Each polling unit was required to upload summary election counts. 
          This chart shows the percentage of blurry and unreadable presidential election result papers out of all polling units in each state. 
          The “Rest of documents” category includes all non-blurred documents (such as legible or cancelled records), as well as polling units that did not upload results.
        </p>

        <!-- Data source -->
        <p style="margin: 0; font-size: 11px; line-height: 1.4em; text-align: left;">
          <strong>Data Source:</strong> INEC Result Viewing (IReV) portal
        </p>

        <!-- Image credit -->
        <div style="margin-top: 8px; margin-left: -8px;">
          <img src=${await ccijImageCredit.src} alt="CCIJ Image Credit" style="width: 250px; height: auto;" />
        </div>
      </div>
    </div>
  `;

  const container = wrapper.querySelector('#container');

  // -------------------------------------------------------------------
  // Source data
  // -------------------------------------------------------------------
  // Each row represents the share of document types within a state.
  // Two categories are shown:
  // - Blurred documents
  // - Rest of documents

  let data = [
    { State: 'Gombe', DocumentType: 'Blurred documents', Percentage: 77.64 },
    { State: 'Zamfara', DocumentType: 'Blurred documents', Percentage: 27.26 },
    { State: 'Kano', DocumentType: 'Blurred documents', Percentage: 18.73 },
    { State: 'Abia', DocumentType: 'Blurred documents', Percentage: 13.64 },
    { State: 'Delta', DocumentType: 'Blurred documents', Percentage: 12.98 },
    { State: 'Jigawa', DocumentType: 'Blurred documents', Percentage: 11.94 },
    { State: 'Kaduna', DocumentType: 'Blurred documents', Percentage: 11.53 },
    { State: 'Kogi', DocumentType: 'Blurred documents', Percentage: 9.55 },
    { State: 'Oyo', DocumentType: 'Blurred documents', Percentage: 9.14 },
    { State: 'Ogun', DocumentType: 'Blurred documents', Percentage: 8.87 },
    { State: 'Gombe', DocumentType: 'Rest of documents', Percentage: 22.36 },
    { State: 'Zamfara', DocumentType: 'Rest of documents', Percentage: 72.74 },
    { State: 'Kano', DocumentType: 'Rest of documents', Percentage: 81.27 },
    { State: 'Abia', DocumentType: 'Rest of documents', Percentage: 86.36 },
    { State: 'Delta', DocumentType: 'Rest of documents', Percentage: 87.02 },
    { State: 'Jigawa', DocumentType: 'Rest of documents', Percentage: 88.06 },
    { State: 'Kaduna', DocumentType: 'Rest of documents', Percentage: 88.47 },
    { State: 'Kogi', DocumentType: 'Rest of documents', Percentage: 90.45 },
    { State: 'Oyo', DocumentType: 'Rest of documents', Percentage: 90.86 },
    { State: 'Ogun', DocumentType: 'Rest of documents', Percentage: 91.13 }
  ];

  // -------------------------------------------------------------------
  // Rank states by the percentage of blurred documents
  // -------------------------------------------------------------------
  // This keeps the chart sorted in descending order of the most problematic states.

  const uniqueStates = [...new Set(data.map(item => item.State))];

  const statesWithPercentage = uniqueStates.map(state => {
    const blurredDoc = data.find(
      item => item.State === state && item.DocumentType === 'Blurred documents'
    );

    return {
      state,
      percentage: blurredDoc ? blurredDoc.Percentage : 0
    };
  });

  statesWithPercentage.sort((a, b) => b.percentage - a.percentage);

  // Create a lookup table with ranked labels such as "1. Gombe"
  const stateNameWithRank = {};
  statesWithPercentage.forEach((item, index) => {
    stateNameWithRank[item.state] = `${index + 1}. ${item.state}`;
  });

  // Apply ranked labels for display while preserving the original state name
  data = data.map(item => ({
    ...item,
    RankedState: stateNameWithRank[item.State]
  }));

  // Format percentages for the axis and tooltip
  const percentageFormatter = (value) => `${value}%`;

  // -------------------------------------------------------------------
  // Build the stacked bar chart
  // -------------------------------------------------------------------

  const stackedBarChart = new G2Plot.Bar(container, {
    data,
    isStack: true,
    xField: 'Percentage',
    yField: 'RankedState',
    seriesField: 'DocumentType',

    color: ['#FFC941', '#d9d9d9'],

    xAxis: {
      title: {
        text: '',
        style: {
          fontFamily: 'Helvetica',
          fontSize: 12,
          fill: 'grey',
        },
      },
      label: {
        formatter: (v) => percentageFormatter(v),
        style: {
          fontFamily: 'Helvetica',
          fontSize: 12,
          fill: 'grey',
        },
      },
      grid: null,
    },

    yAxis: {
      label: {
        style: {
          fontFamily: 'Helvetica',
          fontSize: 14,
          fill: 'grey',
          fontWeight: 'normal',
        },
      },
    },

    tooltip: {
      showMarkers: false,
      customContent: (title, items) => {
        if (!items || items.length === 0) return '';

        const tooltipItems = items
          .map(
            (item) =>
              `<div><span style="color:${item.color};">●</span> ${item.name}: ${percentageFormatter(
                item.data.Percentage
              )}</div>`
          )
          .join('');

        return `<div style="font-family: Helvetica; color: black; line-height: 1.5;">
          <strong style="font-size: 14px;">${items[0].data.State}</strong><br/>
          ${tooltipItems}
        </div>`;
      },
      domStyles: {
        'g2-tooltip': {
          backgroundColor: 'white',
          border: '1px solid #ccc',
          boxShadow: 'none',
        },
      },
    },

    legend: {
      position: 'top-left',
      itemName: {
        style: {
          fontSize: 12,
          fontFamily: 'Helvetica',
          fill: 'black',
        },
      },
    },

    padding: [35, 20, 40, 80],
  });

  // Render the chart
  stackedBarChart.render();

  return wrapper;
}


function _barChart2(require,html,ccijImageCredit){return(
require('@antv/g2plot@2').then(async G2Plot => {

  // -------------------------------------------------------------------
  // Source data
  // -------------------------------------------------------------------
  // Each row represents the number of polling units in a state
  // where results were cancelled for a specific reason.

  const rawData = [
    // Imo
    { state: 'IMO', reason: 'BVAS faults', count: 1 },
    { state: 'IMO', reason: 'Electoral Commission Failure', count: 1 },
    { state: 'IMO', reason: 'No voter/ Zero turnout', count: 3 },
    { state: 'IMO', reason: 'Over Voting', count: 3 },
    { state: 'IMO', reason: 'Unexplained', count: 174 },
    { state: 'IMO', reason: 'Violence/Insecurity', count: 245 },
    { state: 'IMO', reason: 'Lack of staff/material', count: 37 },
    { state: 'IMO', reason: 'Violence/Lack of staff, material', count: 1 },

    // Edo
    { state: 'EDO', reason: 'Electoral Commission Failure', count: 1 },
    { state: 'EDO', reason: 'Over Voting', count: 6 },
    { state: 'EDO', reason: 'Unexplained', count: 9 },
    { state: 'EDO', reason: 'Violence/Insecurity', count: 104 },
    { state: 'EDO', reason: 'Lack of staff/material', count: 65 },

    // Sokoto
    { state: 'SOKOTO', reason: 'BVAS faults', count: 5 },
    { state: 'SOKOTO', reason: 'Blurred documents', count: 2 },
    { state: 'SOKOTO', reason: 'No voter/ Zero turnout', count: 3 },
    { state: 'SOKOTO', reason: 'Over Voting', count: 9 },
    { state: 'SOKOTO', reason: 'Unexplained', count: 12 },
    { state: 'SOKOTO', reason: 'Violence/Insecurity', count: 123 },
    { state: 'SOKOTO', reason: 'Over voting/BVAS issues', count: 1 },

    // Delta
    { state: 'DELTA', reason: 'BVAS faults', count: 4 },
    { state: 'DELTA', reason: 'Over Voting', count: 3 },
    { state: 'DELTA', reason: 'Unexplained', count: 27 },
    { state: 'DELTA', reason: 'Violence/Insecurity', count: 100 },

    // Katsina
    { state: 'KATSINA', reason: 'BVAS faults', count: 13 },
    { state: 'KATSINA', reason: 'Electoral Commission Failure', count: 1 },
    { state: 'KATSINA', reason: 'No voter/ Zero turnout', count: 3 },
    { state: 'KATSINA', reason: 'Over Voting', count: 15 },
    { state: 'KATSINA', reason: 'Unexplained', count: 2 },
    { state: 'KATSINA', reason: 'Violence/Insecurity', count: 65 },
    { state: 'KATSINA', reason: 'Lack of staff/material', count: 17 },
    { state: 'KATSINA', reason: 'Violence/Over voting', count: 1 },

    // Kogi
    { state: 'KOGI', reason: 'BVAS faults', count: 2 },
    { state: 'KOGI', reason: 'Over Voting', count: 1 },
    { state: 'KOGI', reason: 'Unexplained', count: 40 },
    { state: 'KOGI', reason: 'Violence/Insecurity', count: 57 },

    // Kaduna
    { state: 'KADUNA', reason: 'BVAS faults', count: 32 },
    { state: 'KADUNA', reason: 'Over Voting', count: 20 },
    { state: 'KADUNA', reason: 'Unexplained', count: 4 },
    { state: 'KADUNA', reason: 'Violence/Insecurity', count: 34 },
    { state: 'KADUNA', reason: 'Lack of staff/material', count: 1 },
    { state: 'KADUNA', reason: 'Violence/Over voting', count: 1 },

    // Lagos
    { state: 'LAGOS', reason: 'BVAS faults', count: 1 },
    { state: 'LAGOS', reason: 'Electoral Commission Failure', count: 2 },
    { state: 'LAGOS', reason: 'Over Voting', count: 2 },
    { state: 'LAGOS', reason: 'Unexplained', count: 4 },
    { state: 'LAGOS', reason: 'Violence/Insecurity', count: 75 },
    { state: 'LAGOS', reason: 'Lack of staff/material', count: 4 },
    { state: 'LAGOS', reason: 'Over voting/BVAS issues', count: 1 },
    { state: 'LAGOS', reason: 'Over voting/BVAS issues/Violence', count: 1 },
    { state: 'LAGOS', reason: 'Violence/BVAS issues', count: 1 },
    { state: 'LAGOS', reason: 'Violence/Over voting', count: 1 },

    // Cross River
    { state: 'CROSS RIVER', reason: 'BVAS faults', count: 1 },
    { state: 'CROSS RIVER', reason: 'Over Voting', count: 7 },
    { state: 'CROSS RIVER', reason: 'Unexplained', count: 42 },
    { state: 'CROSS RIVER', reason: 'Violence/Insecurity', count: 18 },

    // Kano
    { state: 'KANO', reason: 'BVAS faults', count: 1 },
    { state: 'KANO', reason: 'Electoral Commission Failure', count: 3 },
    { state: 'KANO', reason: 'Over Voting', count: 8 },
    { state: 'KANO', reason: 'Unexplained', count: 24 },
    { state: 'KANO', reason: 'Violence/Insecurity', count: 18 },
    { state: 'KANO', reason: 'Violence/Over voting', count: 2 },
  ];

  // -------------------------------------------------------------------
  // Main reporting categories
  // -------------------------------------------------------------------
  // Multiple detailed reasons are consolidated into a smaller number
  // of categories to make the chart easier to interpret.

  const mainCategories = [
    'Violence/Insecurity',
    'Unexplained',
    'Overvoting',
    'Lack of staff/material',
  ];

  // Map uppercase state labels to title case for display
  const stateNameMap = {
    'IMO': 'Imo',
    'EDO': 'Edo',
    'SOKOTO': 'Sokoto',
    'DELTA': 'Delta',
    'KATSINA': 'Katsina',
    'KOGI': 'Kogi',
    'KADUNA': 'Kaduna',
    'LAGOS': 'Lagos',
    'CROSS RIVER': 'Cross River',
    'KANO': 'Kano',
  };

  // -------------------------------------------------------------------
  // Group detailed reasons into broader reporting categories
  // -------------------------------------------------------------------
  function mapToCategory(reason) {
    const rLower = reason.toLowerCase();

    if (rLower.includes('over voting') || rLower.includes('overvoting')) {
      return 'Overvoting';
    }

    if (mainCategories.includes(reason)) {
      return reason;
    }

    return 'Other';
  }

  // Transform the source data into the structure used for plotting
  const transformed = rawData.map(item => ({
    state: item.state,
    category: mapToCategory(item.reason),
    documents: item.count,
  }));

  // -------------------------------------------------------------------
  // Rank states by total cancellations
  // -------------------------------------------------------------------
  const groupedByState = transformed.reduce((acc, cur) => {
    acc[cur.state] = (acc[cur.state] || 0) + cur.documents;
    return acc;
  }, {});

  const sortedStates = Object.entries(groupedByState)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);

  // Rebuild the plot array in ranked order
  const plotData = [];
  sortedStates.forEach(st => {
    plotData.push(...transformed.filter(d => d.state === st));
  });

  // Store state rankings for the y-axis labels
  const stateRankings = {};
  sortedStates.forEach((st, i) => {
    stateRankings[st] = i + 1;
  });

  // -------------------------------------------------------------------
  // Color palette
  // -------------------------------------------------------------------
  const colorMap = {
    'Violence/Insecurity': '#FF8282',
    'Unexplained': '#FFC941',
    'Overvoting': '#9CE1E5',
    'Lack of staff/material': '#9487E5',
    'Other': '#C6C8CE'
  };

  // -------------------------------------------------------------------
  // Layout wrapper
  // -------------------------------------------------------------------
  const wrapper = html`
    <div style="display: flex; flex-direction: column; align-items: flex-start; width: 1000px; font-family: Helvetica;">

      <!-- Title -->
      <h3 style="text-align: left; padding-bottom: 8px; margin-bottom: 0; font-family: Helvetica; color: black; width: 100%;">
        Imo state led the nation in election cancellations
      </h3>

      <!-- Subtitle -->
      <p style="text-align: left; font-size: 16px; margin-top: 4px; margin-bottom: 10px; font-family: Helvetica; color: black; max-width: 100%;">
        Factors behind election cancellations: violence, overvoting, and lack of ballot materials.
      </p>

      <!-- Legend label -->
      <div style="text-align: left; font-family: Helvetica;">
        <span style="font-size: 12px; font-weight: bold; color: black;">Reasons for cancellation</span>
        <span style="font-size: 11px; color: grey; margin-left: 3px;">Click to filter view</span>
      </div>

      <!-- Chart container -->
      <div id="chart-container" style="width: 730px; height: 400px; margin-top: 4px;"></div>
      
      <!-- Note, source, and credit -->
      <div style="max-width: 730px; display: flex; flex-direction: column; align-items: flex-start; margin-top: 10px;">

        <!-- Methodological note -->
        <p style="margin: 0; font-size: 11px; line-height: 1.4em; text-align: left; max-width: 730px;">
          <strong>Note:</strong> The “Other” category includes polling units where election results were not counted for various reasons. 
          This includes malfunctions of the Bimodal Voter Accreditation System (BVAS), incorrectly completed election paperwork, blurred records, and documents with multiple listed reasons for cancellation.
        </p>

        <!-- Data source -->
        <p style="margin: 0; font-size: 11px; line-height: 1.4em; text-align: left;">
          <strong>Data Source:</strong> INEC Result Viewing (IReV) portal
        </p>

        <!-- Logo -->
        <div style="margin-top: 8px; margin-left: -8px;">
          <img src=${await ccijImageCredit.src} alt="CCIJ Image Credit" style="width: 250px; height: auto;" />
        </div>
      </div>
    </div>
  `;

  const container = wrapper.querySelector('#chart-container');

  // -------------------------------------------------------------------
  // Build the stacked bar chart
  // -------------------------------------------------------------------
  const bar = new G2Plot.Bar(container, {
    data: plotData,
    isStack: true,
    yField: 'state',
    xField: 'documents',
    seriesField: 'category',
    color: ({ category }) => colorMap[category],
    barSize: 20,
    padding: [40, 40, 50, 100],

    // Force legend order
    meta: {
      category: {
        values: [
          'Violence/Insecurity',
          'Unexplained',
          'Overvoting',
          'Lack of staff/material',
          'Other'
        ]
      }
    },

    xAxis: {
      title: {
        text: 'Documents',
        style: {
          fontFamily: 'Helvetica',
          fontSize: 12,
          fill: 'grey',
        },
        offset: 40,
      },
      label: {
        formatter: (val) => new Intl.NumberFormat().format(val),
        style: { 
          fontFamily: 'Helvetica', 
          fontSize: 12,
          color: 'black' 
        }
      },
      grid: {
        line: {
          style: { stroke: '#eee', lineWidth: 1 }
        }
      }
    },

    yAxis: {
      type: 'cat',
      label: {
        formatter: (state) => {
          const normalCase = stateNameMap[state] || (state.charAt(0) + state.slice(1).toLowerCase());
          const rank = stateRankings[state] || '';
          return `${rank}. ${normalCase}`;
        },
        style: {
          fontFamily: 'Helvetica',
          color: 'black',
          fontSize: 13
        }
      }
    },

    legend: {
      position: 'top-left',
      layout: 'horizontal',
      flipPage: false,
      itemName: {
        style: {
          fontFamily: 'Helvetica',
          fontSize: 12,
          color: 'black'
        }
      }
    },

    tooltip: {
      shared: true,
      showMarkers: false,
      customContent: (title, items) => {
        if (!title || !items || items.length === 0) return '';

        const normalCaseState = stateNameMap[title] || (title.charAt(0) + title.slice(1).toLowerCase());

        let contentHtml = `
          <div style="font-family: Helvetica; color: black; max-width: 300px; line-height: 1.5;">
            <strong style="font-size: 14px;">State: ${normalCaseState}</strong><br/>
        `;

        for (const item of items) {
          const bulletColor = item.color;
          const formattedCount = new Intl.NumberFormat().format(item.data.documents);

          contentHtml += `
            <span style="display:inline-block; width:8px; height:8px; background-color:${bulletColor};
              border-radius: 50%; margin-right:4px;"></span>
            ${item.name}: ${formattedCount}<br/>
          `;
        }

        contentHtml += `</div>`;
        return contentHtml;
      },
      domStyles: {
        'g2-tooltip': {
          backgroundColor: 'white',
          border: '1px solid #ccc',
          fontFamily: 'Helvetica',
          color: 'black'
        }
      }
    },
  });

  // Render the chart
  bar.render();

  return wrapper;
})
)}

async function _barChartSimple(html,ccijImageCredit,G2Plot)
{
  // -------------------------------------------------------------------
  // Layout wrapper
  // -------------------------------------------------------------------
  // This container holds the title, subtitle, filter buttons, chart,
  // data source, and image credit.

  const wrapper = html`
    <div style="display: flex; flex-direction: column; align-items: flex-start; width: 100%; max-width: 730px; position: relative;">

      <div style="width: 100%;">
        <h3 style="text-align: left; padding-bottom: 8px; margin-bottom: 0; font-family: Helvetica; color: black; width: 100%;">
          Voting documents that lack required information
        </h3>

        <p style="text-align: left; font-size: 16px; margin-top: 4px; margin-bottom: 10px; font-family: Helvetica; color: black; max-width: 100%;">
          Various essential details were missing from voting tally sheets across multiple polling stations, raising concerns among election observers.
        </p>

        <div style="text-align: left; margin-bottom: 8px; font-family: Helvetica;">
          <span style="font-size: 12px; font-weight: bold; color: black;">Document category</span>
          <span style="font-size: 11px; color: grey; margin-left: 3px;">Click to filter view</span>
        </div>
      </div>

      <!-- Filter buttons -->
      <div style="display: flex; flex-wrap: wrap; justify-content: flex-start; margin-bottom: 10px;">

        <!-- Row 1 -->
        <button id="noBlackStampButton" style="width: 48%; margin-right: 4%; margin-bottom: 10px; padding: 5px 10px; border: 1px solid #ccc; background-color: white; color: black; cursor: pointer; font-size: 14px; white-space: nowrap;">
          No black stamp
        </button>

        <button id="noOfficerSignatureButton" style="width: 48%; margin-right: 0; margin-bottom: 10px; padding: 5px 10px; border: 1px solid #ccc; background-color: white; color: black; cursor: pointer; font-size: 14px; white-space: nowrap;">
          No presiding officer's signature
        </button>

        <!-- Row 2 -->
        <button id="noOfficerNameButton" style="width: 48%; margin-right: 4%; margin-bottom: 10px; padding: 5px 10px; border: 1px solid #ccc; background-color: white; color: black; cursor: pointer; font-size: 14px; white-space: nowrap;">
          No presiding officer's name
        </button>

        <button id="noPollingAgentSignatureButton" style="width: 48%; margin-right: 0; margin-bottom: 10px; padding: 5px 10px; border: 1px solid #ccc; background-color: white; color: black; cursor: pointer; font-size: 14px; white-space: nowrap;">
          No polling agent's signature
        </button>
      </div>

      <!-- Chart container -->
      <div id="container" style="height: 350px; width: 100%;"></div>

      <!-- Data source and credit -->
      <div style="max-width: 730px; display: flex; flex-direction: column; align-items: flex-start; margin-top: 10px;">
        <p style="margin: 0; font-size: 11px; line-height: 1.4em; text-align: left; font-family: Helvetica; color: black;">
          <strong>Data Source:</strong> INEC Result Viewing (IReV) portal
        </p>

        <div style="margin-top: 8px; margin-left: -8px;">
          <img src=${await ccijImageCredit.src} alt="CCIJ Image Credit" style="width: 250px; height: auto;" />
        </div>
      </div>
    </div>
  `;

  const container = wrapper.querySelector('#container');

  // -------------------------------------------------------------------
  // Helper: format large numbers with comma separators
  // -------------------------------------------------------------------
  const commaFormatter = (value) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  // -------------------------------------------------------------------
  // Datasets for each missing document element
  // -------------------------------------------------------------------
  // Each dataset lists the states with the highest number of documents
  // missing a specific validation element.

  let dataNoOfficerName = [
    { "State": "LAGOS", "Count": 487 },
    { "State": "KANO", "Count": 418 },
    { "State": "KATSINA", "Count": 381 },
    { "State": "SOKOTO", "Count": 280 },
    { "State": "OYO", "Count": 267 },
    { "State": "KADUNA", "Count": 266 },
    { "State": "BAUCHI", "Count": 259 },
    { "State": "OGUN", "Count": 240 },
    { "State": "KEBBI", "Count": 240 },
    { "State": "RIVERS", "Count": 239 }
  ];

  let dataNoOfficerSignature = [
    { "State": "KANO", "Count": 249 },
    { "State": "LAGOS", "Count": 247 },
    { "State": "KATSINA", "Count": 208 },
    { "State": "OYO", "Count": 205 },
    { "State": "BAUCHI", "Count": 181 },
    { "State": "OGUN", "Count": 160 },
    { "State": "OSUN", "Count": 149 },
    { "State": "PLATEAU", "Count": 148 },
    { "State": "JIGAWA", "Count": 143 },
    { "State": "KADUNA", "Count": 140 }
  ];

  let dataNoPollingAgentSignature = [
    { "State": "RIVERS", "Count": 286 },
    { "State": "IMO", "Count": 232 },
    { "State": "SOKOTO", "Count": 173 },
    { "State": "BORNO", "Count": 165 },
    { "State": "KANO", "Count": 159 },
    { "State": "KATSINA", "Count": 152 },
    { "State": "LAGOS", "Count": 136 },
    { "State": "OYO", "Count": 132 },
    { "State": "DELTA", "Count": 123 },
    { "State": "KEBBI", "Count": 118 }
  ];

  let dataNoBlackStamp = [
    { "State": "KANO", "Count": 779 },
    { "State": "KADUNA", "Count": 677 },
    { "State": "KATSINA", "Count": 677 },
    { "State": "LAGOS", "Count": 654 },
    { "State": "SOKOTO", "Count": 571 },
    { "State": "OGUN", "Count": 510 },
    { "State": "NIGER", "Count": 508 },
    { "State": "BENUE", "Count": 500 },
    { "State": "OYO", "Count": 493 },
    { "State": "KEBBI", "Count": 480 }
  ];

  // -------------------------------------------------------------------
  // Helper: convert uppercase state names to display format
  // -------------------------------------------------------------------
  const formatStateName = (state) => {
    return state.charAt(0).toUpperCase() + state.slice(1).toLowerCase();
  };

  // -------------------------------------------------------------------
  // Rank states by document count
  // -------------------------------------------------------------------
  // This adds a ranking prefix such as "1. Kano" to the y-axis labels.

  const addRankings = (data) => {
    const sortedData = [...data].sort((a, b) => b.Count - a.Count);

    sortedData.forEach((item, index) => {
      item.Rank = index + 1;
      const capitalizedState = formatStateName(item.State);
      item.StateWithRank = `${item.Rank}. ${capitalizedState}`;
    });

    return sortedData;
  };

  // -------------------------------------------------------------------
  // Render a single bar chart for the selected document category
  // -------------------------------------------------------------------
  const renderBarChart = (data, valueField, xAxisTitle) => {
    const rankedData = addRankings(data);

    // Clear the chart container before re-rendering
    container.innerHTML = '';

    const xAxisOptions = {
      title: {
        text: xAxisTitle,
        style: {
          fontFamily: 'Helvetica',
          fontSize: 12,
          fill: 'grey',
        }
      },
      label: {
        formatter: (value) => commaFormatter(value)
      },
      nice: true,
    };

    const barChart = new G2Plot.Bar(container, {
      data: rankedData,
      xField: 'Count',
      yField: 'StateWithRank',
      seriesField: 'State',
      legend: false,
      xAxis: xAxisOptions,
      color: '#F6BF00',

      yAxis: {
        label: {
          style: {
            fontWeight: 'normal',
            color: 'black',
            fontSize: 14
          },
          formatter: (text) => text
        }
      },

      tooltip: {
        showMarkers: false,
        customContent: (title, items) => {
          if (!items || items.length === 0) return '';

          const datum = items[0].data;
          const formattedValue = commaFormatter(datum.Count);
          const stateNameFormatted = formatStateName(datum.State);

          return `<div style="font-family: Helvetica; color: black; max-width: 500px; line-height: 1.5; word-wrap: break-word;">
            <strong>${stateNameFormatted}:</strong> ${formattedValue} documents
          </div>`;
        },
        domStyles: {
          'g2-tooltip': {
            backgroundColor: 'white',
            border: '1px solid #ccc',
            fontFamily: 'Helvetica',
            color: 'black'
          },
        }
      },

      padding: [5, 20, 50, 85],
    });

    barChart.render();
  };

  // -------------------------------------------------------------------
  // Button highlighting
  // -------------------------------------------------------------------
  // Update the selected button style so readers can see which view is active.

  const highlightButton = (buttonId) => {
    document.getElementById('noOfficerNameButton').style.backgroundColor = 'white';
    document.getElementById('noOfficerSignatureButton').style.backgroundColor = 'white';
    document.getElementById('noBlackStampButton').style.backgroundColor = 'white';
    document.getElementById('noPollingAgentSignatureButton').style.backgroundColor = 'white';

    document.getElementById('noOfficerNameButton').style.color = 'black';
    document.getElementById('noOfficerSignatureButton').style.color = 'black';
    document.getElementById('noBlackStampButton').style.color = 'black';
    document.getElementById('noPollingAgentSignatureButton').style.color = 'black';

    const activeButton = document.getElementById(buttonId);
    activeButton.style.backgroundColor = '#000000';
    activeButton.style.color = 'white';
  };

  // -------------------------------------------------------------------
  // Button interactions and default view
  // -------------------------------------------------------------------
  requestAnimationFrame(() => {
    document.getElementById('noOfficerNameButton').addEventListener('click', () => {
      renderBarChart(dataNoOfficerName, 'NoOfficerName', 'Documents');
      highlightButton('noOfficerNameButton');
    });

    document.getElementById('noOfficerSignatureButton').addEventListener('click', () => {
      renderBarChart(dataNoOfficerSignature, 'NoOfficerSignature', 'Documents');
      highlightButton('noOfficerSignatureButton');
    });

    document.getElementById('noBlackStampButton').addEventListener('click', () => {
      renderBarChart(dataNoBlackStamp, 'NoBlackStamp', 'Documents');
      highlightButton('noBlackStampButton');
    });

    document.getElementById('noPollingAgentSignatureButton').addEventListener('click', () => {
      renderBarChart(dataNoPollingAgentSignature, 'NoPollingAgentSignature', 'Documents');
      highlightButton('noPollingAgentSignatureButton');
    });

    // Default view
    renderBarChart(dataNoBlackStamp, 'NoBlackStamp', 'Documents');
    highlightButton('noBlackStampButton');
  });

  return wrapper;
}


async function _scatterPlotExample(html,ccijImageCredit,G2Plot)
{
  // -------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------

  // Capitalize the first letter of each word, including words after slashes.
  // This is used to format state and LGA names for display.
  const capitalizeWords = (str) => {
    return str
      .replace(/\b\w/g, char => char.toUpperCase())
      .replace(/\/\w/g, char => char.toUpperCase());
  };

  // Format vote counts with comma separators for readability.
  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  // Define the order in which locations should appear on the y-axis.
  // This preserves the editorial ranking used in the story.
  const yOrder = [
    "(Rivers) Obio/Akpor",
    "(Rivers) Oyigbo",
    "(Rivers) Eleme",
    "(Plateau) Jos North",
    "(Lagos) Surulere",
  ];

  // -------------------------------------------------------------------
  // Build chart dataset
  // -------------------------------------------------------------------
  // Each location produces four data points:
  // - APC official result
  // - APC CCIJ analysis
  // - LP official result
  // - LP CCIJ analysis

  const createDataPoints = () => {
    const rawData = [
      {
        State: "Rivers",
        LGA: "Obio/Akpor",
        "APC - Official (%)": 94.8,
        "APC - OCR (%)": 18.8,
        "LP - Official (%)": 4.5,
        "LP - OCR (%)": 75.7,
        "APC Votes Official": 80239,
        "LP Votes Official": 3829,
        "APC Votes OCR": 16980,
        "LP Votes OCR": 68521
      },
      {
        State: "Rivers",
        LGA: "Oyigbo",
        "APC - Official (%)": 58.2,
        "APC - OCR (%)": 11.4,
        "LP - Official (%)": 37.7,
        "LP - OCR (%)": 83.7,
        "APC Votes Official": 16630,
        "LP Votes Official": 10784,
        "APC Votes OCR": 2435,
        "LP Votes OCR": 17875
      },
      {
        State: "Rivers",
        LGA: "Eleme",
        "APC - Official (%)": 45.6,
        "APC - OCR (%)": 29.7,
        "LP - Official (%)": 41.0,
        "LP - OCR (%)": 54.2,
        "APC Votes Official": 8368,
        "LP Votes Official": 7529,
        "APC Votes OCR": 4077,
        "LP Votes OCR": 7431
      },
      {
        State: "Plateau",
        LGA: "Jos North",
        "APC - Official (%)": 40.2,
        "APC - OCR (%)": 28.4,
        "LP - Official (%)": 43.1,
        "LP - OCR (%)": 54.9,
        "APC Votes Official": 65656,
        "LP Votes Official": 70357,
        "APC Votes OCR": 41404,
        "LP Votes OCR": 80067
      },
      {
        State: "Lagos",
        LGA: "Surulere",
        "APC - Official (%)": 49.4,
        "APC - OCR (%)": 39.6,
        "LP - Official (%)": 46.7,
        "LP - OCR (%)": 56.4,
        "APC Votes Official": 39002,
        "LP Votes Official": 36923,
        "APC Votes OCR": 31428,
        "LP Votes OCR": 44752
      },
    ];

    const flattened = [];

    for (const row of rawData) {
      const formattedState = capitalizeWords(row.State);
      const formattedLGA = capitalizeWords(row.LGA);
      const locationLabel = `(${formattedState}) ${formattedLGA}`;

      flattened.push(
        {
          location: locationLabel,
          partyType: "APC - Official results",
          value: row["APC - Official (%)"],
          votes: row["APC Votes Official"]
        },
        {
          location: locationLabel,
          partyType: "APC - CCIJ analysis",
          value: row["APC - OCR (%)"],
          votes: row["APC Votes OCR"]
        },
        {
          location: locationLabel,
          partyType: "LP - Official results",
          value: row["LP - Official (%)"],
          votes: row["LP Votes Official"]
        },
        {
          location: locationLabel,
          partyType: "LP - CCIJ analysis",
          value: row["LP - OCR (%)"],
          votes: row["LP Votes OCR"]
        }
      );
    }

    return flattened;
  };

  const data = createDataPoints();

  // -------------------------------------------------------------------
  // Layout wrapper
  // -------------------------------------------------------------------

  const wrapper = html`
    <div style="display: flex; flex-direction: column; align-items: left; width: 730px;">
      <h3 style="text-align: left; padding-bottom: 8px; margin-bottom: 0; font-family: Helvetica; color: black; width: 100%;"> 
        APC vs. LP: Discrepancies in vote percentages
      </h3>

      <p style="text-align: left; font-size: 16px; margin-top: 4px; margin-bottom: 10px; font-family: Helvetica; color: black; max-width: 100%;">
        CCIJ data analysis highlights major gaps between official results and document-based analysis in Rivers, Plateau, and Lagos states.
      </p>

      <div style="text-align: left; font-family: Helvetica;">
        <span style="font-size: 12px; font-weight: bold; color: black;">Official vote percentages vs. CCIJ analysis for APC and LP</span>
        <span style="font-size: 11px; color: grey; margin-left: 3px;">Click to filter view</span>
      </div>

      <div style="height: 300px; width: 730px; position: relative; margin-bottom: 10px;">
        <div id="containerExample" style="height: 100%; width: 100%;"></div>
      </div>

      <div
        style="max-width: 730px; display: flex; flex-direction: column; align-items: flex-start; margin-top: 10px; font-family: Helvetica; color: black;"
      >
        <p style="margin: 0; font-size: 11px; line-height: 1.4em; text-align: left; max-width: 730px; font-family: Helvetica; color: black;">
          <strong>Note:</strong> Based on the documents analyzed by CCIJ, the official results counted more than 110,000 additional votes for APC compared with what was available in INEC’s public portal across these LGAs.
        </p>

        <p style="margin: 0; font-size: 11px; line-height: 1.4em; text-align: left; font-family: Helvetica; color: black;">
          <strong>Data Source:</strong> INEC Result Viewing (IReV) portal
        </p>

        <div style="margin-top: 8px; margin-left: -8px;">
          <img src=${await ccijImageCredit.src} alt="CCIJ Image Credit" style="width: 250px; height: auto;" />
        </div>
      </div>
    </div>
  `;

  const container = wrapper.querySelector('#containerExample');

  // -------------------------------------------------------------------
  // Build scatter plot
  // -------------------------------------------------------------------

  const scatterPlot = new G2Plot.Scatter(container, {
    data,
    xField: 'value',
    yField: 'location',
    colorField: 'partyType',

    // Color encoding:
    // lighter shades = official results
    // darker shades = CCIJ analysis
    color: ({ partyType }) => {
      switch (partyType) {
        case 'APC - Official results':
          return '#8AAEF7';
        case 'APC - CCIJ analysis':
          return '#356AE6';
        case 'LP - Official results':
          return '#F59A9A';
        case 'LP - CCIJ analysis':
          return '#E64B4B';
        default:
          return '#999';
      }
    },

    shape: 'circle',
    size: 6,
    pointStyle: {
      fillOpacity: 1,
    },

    appendPadding: [20, 20, 10, 20],

    legend: {
      position: 'top-left',
      layout: 'horizontal',
      itemName: {
        style: {
          fill: 'grey',
          fontSize: 12,
          fontFamily: 'Helvetica',
        },
      },
    },

    xAxis: {
      min: 0,
      max: 100,
      tickInterval: 20,
      label: {
        formatter: (val) => `${val}%`,
        style: {
          fontFamily: 'Helvetica',
          fontSize: 12,
        },
      },
      grid: {
        line: {
          style: {
            stroke: '#eee',
          },
        },
      },
      line: {
        style: {
          stroke: '#aaa',
        },
      },
    },

    yAxis: {
      meta: {
        values: yOrder,
      },
      line: {
        style: {
          stroke: '#aaa',
        },
      },
      label: {
        formatter: (lgaName) => lgaName,
        style: {
          fontSize: 13,
          lineHeight: 30,
          fontFamily: 'Helvetica',
          fill: 'grey',
        },
      },
      range: [1, 0],
    },

    tooltip: {
      shared: false,
      showMarkers: false,

      customContent: (title, items) => {
        if (!items || items.length === 0) return '';

        const datum = items[0].data;
        const formattedVotes = formatNumber(datum.votes);

        const categoryColors = {
          "APC - Official results": "#8AAEF7",
          "APC - CCIJ analysis": "#356AE6",
          "LP - Official results": "#F59A9A",
          "LP - CCIJ analysis": "#E64B4B",
        };

        const highlightColor = categoryColors[datum.partyType] || "#999";

        // Use white text for darker chips and black text for lighter ones
        const fontColor = ["APC - CCIJ analysis", "LP - CCIJ analysis"].includes(datum.partyType)
          ? "white"
          : "black";

        return `
          <div style="font-family: Helvetica; color: black; max-width: 300px; line-height: 1.5; text-align: left;">
            <strong style="font-size: 13px; font-weight: bold;">Location: ${datum.location}</strong><br/>
            <span style="background-color: ${highlightColor}; color: ${fontColor}; padding: 2px 4px; border-radius: 2px;">
              ${datum.partyType}
            </span><br/>
            Vote percentage: ${datum.value}%<br/>
            Vote count: ${formattedVotes}
          </div>
        `;
      },

      domStyles: {
        'g2-tooltip': {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          paddingTop: '5px',
          paddingBottom: '5px',
          paddingLeft: '5px',
          paddingRight: '5px',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          fontFamily: 'Helvetica',
          color: 'black',
          minHeight: '50px',
        },
      },
    },
  });

  scatterPlot.render();

  return wrapper;
}


async function _voteDiscrepancyPlot(html,ccijImageCredit,G2Plot)
{
  // -------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------

  // Capitalize the first letter of each word, including words after slashes.
  // This is used to format state and LGA names for chart labels.
  const capitalizeWords = (str) => {
    return str
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase())
      .replace(/\/\w/g, char => char.toUpperCase());
  };

  // Format large numbers with comma separators.
  const formatNumber = (num) => {
    const number = typeof num === 'number' ? num : Number(num);
    if (isNaN(number)) return '0';

    return number.toLocaleString('en-US', {
      useGrouping: true,
    });
  };

  // Define the y-axis order used in the story.
  const yOrder = [
    "(Imo) Oru East",
    "(Bauchi) Zaki",
    "(Kano) Kumbotso",
    "(Kogi) Dekina",
    "(Bayelsa) Yenagoa",
    "(Kogi) Ibaji",
  ];

  // -------------------------------------------------------------------
  // Build chart dataset
  // -------------------------------------------------------------------
  // Each location produces two plotted points:
  // - accredited voters recorded through BVAS
  // - total votes counted in the CCIJ document analysis

  const createDataPoints = () => {
    const rawData = [
      {
        State: "IMO",
        LGA: "ORU EAST",
        "Accredit_backend": "326",
        "Total Number of Votes from OCR": "15075",
        "total- accredit_backend": "14749"
      },
      {
        State: "BAUCHI",
        LGA: "ZAKI",
        "Accredit_backend": "733",
        "Total Number of Votes from OCR": "12526",
        "total- accredit_backend": "11793"
      },
      {
        State: "KANO",
        LGA: "KUMBOTSO",
        "Accredit_backend": "3347",
        "Total Number of Votes from OCR": "14496",
        "total- accredit_backend": "11149"
      },
      {
        State: "KOGI",
        LGA: "DEKINA",
        "Accredit_backend": "475",
        "Total Number of Votes from OCR": "10180",
        "total- accredit_backend": "9705"
      },
      {
        State: "BAYELSA",
        LGA: "YENAGOA",
        "Accredit_backend": "928",
        "Total Number of Votes from OCR": "10501",
        "total- accredit_backend": "9573"
      },
      {
        State: "KOGI",
        LGA: "IBAJI",
        "Accredit_backend": "630",
        "Total Number of Votes from OCR": "8637",
        "total- accredit_backend": "8007"
      },
    ];

    const flattened = [];

    for (const row of rawData) {
      const formattedState = capitalizeWords(row.State);
      const formattedLGA = capitalizeWords(row.LGA);
      const locationLabel = `(${formattedState}) ${formattedLGA}`;

      const totalVotesOCR = Number(row["Total Number of Votes from OCR"]) || 0;
      const accreditedVotes = Number(row["Accredit_backend"]) || 0;
      const differenceVotes = Number(row["total- accredit_backend"]) || 0;

      flattened.push(
        {
          location: locationLabel,
          series: "Accredited voters - BVAS machines",
          votes: accreditedVotes,
          differenceVotes: differenceVotes
        },
        {
          location: locationLabel,
          series: "Total votes - CCIJ analysis",
          votes: totalVotesOCR,
          differenceVotes: differenceVotes
        }
      );
    }

    return flattened;
  };

  const data = createDataPoints();

  // -------------------------------------------------------------------
  // Scale and annotation setup
  // -------------------------------------------------------------------

  // Compute the maximum vote count to define the x-axis upper bound.
  const maxVotes = Math.max(...data.map(d => d.votes));
  const xAxisMax = Math.ceil(maxVotes / 1000) * 1000 * 1.1;

  // Build chart annotations:
  // - a line connecting the two points for each location
  // - a label showing the gap between accredited voters and total votes
  const generateAnnotations = () => {
    const rawData = [
      {
        State: "IMO",
        LGA: "ORU EAST",
        "Total Number of Votes from OCR": "15075",
        "Accredit_backend": "326",
        "total- accredit_backend": "14749"
      },
      {
        State: "BAUCHI",
        LGA: "ZAKI",
        "Total Number of Votes from OCR": "12526",
        "Accredit_backend": "733",
        "total- accredit_backend": "11793"
      },
      {
        State: "KANO",
        LGA: "KUMBOTSO",
        "Total Number of Votes from OCR": "14496",
        "Accredit_backend": "3347",
        "total- accredit_backend": "11149"
      },
      {
        State: "KOGI",
        LGA: "DEKINA",
        "Total Number of Votes from OCR": "10180",
        "Accredit_backend": "475",
        "total- accredit_backend": "9705"
      },
      {
        State: "BAYELSA",
        LGA: "YENAGOA",
        "Total Number of Votes from OCR": "10501",
        "Accredit_backend": "928",
        "total- accredit_backend": "9573"
      },
      {
        State: "KOGI",
        LGA: "IBAJI",
        "Total Number of Votes from OCR": "8637",
        "Accredit_backend": "630",
        "total- accredit_backend": "8007"
      },
    ];

    const annotations = [];
    const offset = 200;

    rawData.forEach((row, index) => {
      const formattedState = capitalizeWords(row.State);
      const formattedLGA = capitalizeWords(row.LGA);
      const locationLabel = `(${formattedState}) ${formattedLGA}`;

      const totalVotesOCR = Number(row["Total Number of Votes from OCR"]) || 0;
      const accreditedVotes = Number(row["Accredit_backend"]) || 0;
      const differenceVotes = Number(row["total- accredit_backend"]) || 0;

      const startX = accreditedVotes + offset;
      const endX = totalVotesOCR - offset;

      // Connecting line between the two points
      annotations.push({
        type: 'line',
        start: [startX, locationLabel],
        end: [endX, locationLabel],
        style: {
          stroke: '#999',
          lineWidth: 3,
        },
        zIndex: 'back',
      });

      // Gap label
      annotations.push({
        type: 'text',
        position: [(accreditedVotes + totalVotesOCR) / 2, locationLabel],
        content: index === 0
          ? `${formatNumber(differenceVotes)}-vote gap between accredited voters and total votes`
          : formatNumber(differenceVotes),
        style: {
          fill: '#000',
          fontSize: 12,
          textAlign: 'center',
          textBaseline: 'bottom',
        },
        offsetY: -10,
        zIndex: 'back',
      });
    });

    return annotations;
  };

  const annotations = generateAnnotations();

  // -------------------------------------------------------------------
  // Layout wrapper
  // -------------------------------------------------------------------

  const wrapper = html`
    <div style="display: flex; flex-direction: column; align-items: left; width: 730px;">
      <h3 style="text-align: left; padding-bottom: 8px; margin-bottom: 0; font-family: Helvetica; color: black; width: 100%;">
        Significant gaps in multiple LGAs where total votes exceed accredited voter counts
      </h3>

      <p style="text-align: left; font-size: 16px; margin-top: 4px; margin-bottom: 10px; font-family: Helvetica; color: black; max-width: 100%;">
        Field reports and data analysis highlight troubling patterns in voter accreditation.
      </p>

      <div style="height: 400px; width: 730px; position: relative; margin-bottom: 10px;">
        <div id="containerExample" style="height: 100%; width: 100%;"></div>
      </div>

      <div
        style="max-width: 730px; display: flex; flex-direction: column; align-items: flex-start; margin-top: 10px; font-family: Helvetica; color: black;"
      >
        <p style="margin: 0; font-size: 11px; line-height: 1.4em; text-align: left; max-width: 730px;">
          <strong>Note:</strong> The largest gap was observed in Oru East, Imo state, with 14,749 unaccounted votes. Other LGAs, including Zaki in Bauchi state and Kumbotso in Kano state, also showed concerning patterns, with gaps of 11,793 and 11,149 votes respectively.
        </p>

        <p style="margin: 0; font-size: 11px; line-height: 1.4em; text-align: left;">
          <strong>Data Source:</strong> INEC Result Viewing (IReV) portal
        </p>

        <div style="margin-top: 8px; margin-left: -8px;">
          <img src=${await ccijImageCredit.src} alt="CCIJ Image Credit" style="width: 250px; height: auto;" />
        </div>
      </div>
    </div>
  `;

  const container = wrapper.querySelector('#containerExample');

  // -------------------------------------------------------------------
  // Build scatter plot
  // -------------------------------------------------------------------

  const scatterPlot = new G2Plot.Scatter(container, {
    data,
    xField: 'votes',
    yField: 'location',
    colorField: 'series',

    color: ({ series }) => {
      switch (series) {
        case 'Accredited voters - BVAS machines':
          return '#9CE1E5';
        case 'Total votes - CCIJ analysis':
          return '#648fff';
        default:
          return '#999';
      }
    },

    shape: 'circle',
    size: 6,
    pointStyle: {
      fillOpacity: 1,
    },

    appendPadding: [35, 20, 10, 20],

    legend: {
      position: 'top-left',
      layout: 'horizontal',
      itemName: {
        style: {
          fill: 'grey',
          fontSize: 11.5,
          fontFamily: 'Helvetica',
        },
      },
      itemWidth: 250,
      itemSpacing: -10,
    },

    interactions: [
      { type: 'element-highlight' },
      { type: 'element-active' },
    ],

    xAxis: {
      min: 0,
      max: xAxisMax,
      title: {
        text: 'Votes',
        style: {
          fontSize: 12,
          fontFamily: 'Helvetica',
          fill: '#aaa',
        },
        offset: 40,
      },
      label: {
        formatter: (val) => formatNumber(val),
        style: {
          fontFamily: 'Helvetica',
          fontSize: 12,
          color: '#aaa',
        },
      },
      grid: {
        line: {
          style: {
            stroke: '#eee',
          },
        },
      },
      line: {
        style: {
          stroke: '#aaa',
        },
      },
    },

    yAxis: {
      meta: {
        values: yOrder,
      },
      line: {
        style: {
          stroke: '#aaa',
        },
      },
      label: {
        formatter: (lgaName) => lgaName,
        style: {
          fontSize: 13,
          lineHeight: 30,
          fontFamily: 'Helvetica',
          fill: 'grey',
        },
      },
      range: [1, 0],
    },

    tooltip: {
      shared: false,
      showMarkers: false,

      customContent: (title, items) => {
        if (!items || items.length === 0) return '';

        const datum = items[0].data;
        const formattedVotes = formatNumber(datum.votes);

        const categoryColors = {
          "Accredited voters - BVAS machines": "#9CE1E5",
          "Total votes - CCIJ analysis": "#648fff",
        };

        const highlightColor = categoryColors[datum.series] || "#999";
        const fontColor = datum.series === "Total votes - CCIJ analysis" ? "white" : "black";
        const voteLabel = datum.series === "Accredited voters - BVAS machines"
          ? "Number of voters"
          : "Vote count";

        return `
          <div style="font-family: Helvetica; color: black; max-width: 300px; line-height: 1.5; text-align: left;">
            <strong style="font-size: 13px; font-weight: bold;">Location: ${datum.location}</strong><br/>
            <span style="background-color: ${highlightColor}; color: ${fontColor}; padding: 2px 4px; border-radius: 2px;">
              ${datum.series}
            </span><br/>
            ${voteLabel}: ${formattedVotes}
          </div>
        `;
      },

      domStyles: {
        'g2-tooltip': {
          backgroundColor: 'white',
          border: '1px solid #ccc',
          fontFamily: 'Helvetica',
          color: 'black',
          padding: '5px',
        }
      }
    },

    annotations: annotations,
  });

  scatterPlot.render();

  return wrapper;
}


export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["CCIJ-image-credit (1).svg", {url: new URL("./files/369f17c1c1bce65c2d0d22f8ca5e341be554aadff4b7dc04c422b4b927a342f018eaebdc97b7e2f7d92f1b1f03f6896c707343fd1919e1e9046232549ddb7544.svg", import.meta.url), mimeType: "image/svg+xml", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("G2")).define("G2", ["require"], _G2);
  main.variable(observer("G2Plot")).define("G2Plot", ["require"], _G2Plot);
  main.variable(observer("ccijImageCredit")).define("ccijImageCredit", ["FileAttachment"], _ccijImageCredit);
  main.variable(observer("g2plot")).define("g2plot", ["require","html","ccijImageCredit"], _g2plot);
  main.variable(observer("barChartNotUploaded")).define("barChartNotUploaded", ["html","ccijImageCredit","G2Plot"], _barChartNotUploaded);
  main.variable(observer("stackedBarChartSimple")).define("stackedBarChartSimple", ["html","ccijImageCredit","G2Plot"], _stackedBarChartSimple);
  main.variable(observer("barChart2")).define("barChart2", ["require","html","ccijImageCredit"], _barChart2);
  main.variable(observer("barChartSimple")).define("barChartSimple", ["html","ccijImageCredit","G2Plot"], _barChartSimple);
  main.variable(observer("scatterPlotExample")).define("scatterPlotExample", ["html","ccijImageCredit","G2Plot"], _scatterPlotExample);
  main.variable(observer("voteDiscrepancyPlot")).define("voteDiscrepancyPlot", ["html","ccijImageCredit","G2Plot"], _voteDiscrepancyPlot);
  return main;
}
