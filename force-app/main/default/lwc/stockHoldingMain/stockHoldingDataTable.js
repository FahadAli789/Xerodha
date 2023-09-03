const COLUMNS = [
    {
      label: 'Instrument',
      fieldName: 'Name'
    },
    {
      label: 'Qty',
      fieldName: 'quantity',
      type: 'number'
    },
    {
      label: 'Avg. cost',
      fieldName: 'avgPrice',
      type: 'currency',
      typeAttributes: {
        currencyCode: 'INR'
      }
    },
    {
      label: 'Inflation Adjusted Avg Price',
      fieldName: 'inflationAdjustedAvgPrice',
      type: 'currency',
      typeAttributes: {
        currencyCode: 'INR'
      }
    },
    {
      label: 'LTP',
      fieldName: 'currentPrice',
      type: 'currency',
      typeAttributes: {
        currencyCode: 'INR'
      }
    },
    {
      label: 'Curr. val',
      fieldName: 'currentValue',
      type: 'currency',
      typeAttributes: {
        currencyCode: 'INR'
      }
    },
    {
      label: 'P&L',
      fieldName: 'profitOrLoss',
      type: 'currency',
      typeAttributes: {
        currencyCode: 'INR'
      },
      cellAttributes: {
        class: {
          fieldName: 'profitLossColor'
        }
      }
    },
    {
      label: 'Inflation Adjusted P&L',
      fieldName: 'inflationAdjustedprofitOrLoss',
      type: 'currency',
      typeAttributes: {
        currencyCode: 'INR'
      }
    },
    {
      label: 'Net change',
      fieldName: 'netChange',
      type: 'percent',
      typeAttributes: {
        step: '0.01',
        minimumFractionDigits: '2',
        maximumFractionDigits: '2'
      },
      cellAttributes: {
        class: {
          fieldName: 'profitLossColor'
        }
      }
    },
    {
      label: 'Inflation Adjusted ROI',
      fieldName: 'inflationAdjustedNetChange',
      type: 'percent',
      typeAttributes: {
        step: '0.01',
        minimumFractionDigits: '2',
        maximumFractionDigits: '2'
      }
    }
  ];
  
export{COLUMNS}