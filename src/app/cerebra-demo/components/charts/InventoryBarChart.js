"use client";

import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

// Inventory data - parts availability
const inventoryData = [
  { part: "Liner Segments", required: 12, available: 12, location: "W001-C47" },
  { part: "M24 Bolts", required: 48, available: 150, location: "W001-B12" },
  { part: "Wear Plates", required: 6, available: 8, location: "W001-C48" },
  { part: "Hydraulic Seals", required: 4, available: 4, location: "W002-H08" },
  { part: "Backing Compound", required: 2, available: 3, location: "W003-C15" },
];

export default function InventoryBarChart() {
  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      padding: '16px',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{ 
        fontSize: '12px', 
        fontWeight: '600', 
        color: '#374151',
        marginBottom: '4px'
      }}>
        Parts Availability Status
      </div>
      <div style={{ 
        fontSize: '10px', 
        color: '#6b7280',
        marginBottom: '12px'
      }}>
        Required vs Available for Liner Replacement Job
      </div>
      
      <div style={{ height: '180px' }}>
        <ResponsiveBar
          data={inventoryData}
          keys={['required', 'available']}
          indexBy="part"
          margin={{ top: 10, right: 20, bottom: 50, left: 100 }}
          padding={0.4}
          groupMode="grouped"
          layout="horizontal"
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={['#EF4444', '#10B981']}
          borderRadius={2}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 0,
            tickPadding: 10,
            legend: 'Quantity',
            legendPosition: 'middle',
            legendOffset: 40
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 10
          }}
          enableGridX={true}
          enableGridY={false}
          labelSkipWidth={30}
          labelSkipHeight={12}
          labelTextColor="white"
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom',
              direction: 'row',
              translateY: 50,
              itemWidth: 80,
              itemHeight: 12,
              itemTextColor: '#6b7280',
              symbolSize: 10,
              symbolShape: 'circle'
            }
          ]}
          theme={{
            fontSize: 10,
            axis: {
              ticks: {
                text: { fill: '#6b7280', fontSize: 9 }
              },
              legend: {
                text: { fill: '#374151', fontSize: 10 }
              }
            },
            grid: {
              line: { stroke: '#f0f0f0' }
            },
            legends: {
              text: { fontSize: 10 }
            }
          }}
          tooltip={({ id, value, indexValue }) => (
            <div style={{
              background: '#1a1a2e',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '4px',
              fontSize: '11px'
            }}>
              <strong>{indexValue}</strong><br/>
              {id}: {value} units
            </div>
          )}
        />
      </div>

      {/* Warehouse Info */}
      <div style={{
        marginTop: '12px',
        padding: '10px 12px',
        background: '#F0FDF4',
        borderRadius: '6px',
        borderLeft: '3px solid #10B981'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '10px', color: '#166534', fontWeight: '600' }}>
              All Parts Available
            </div>
            <div style={{ fontSize: '11px', color: '#15803D', marginTop: '2px' }}>
              Primary Location: <strong>Warehouse W001-BIN-C47</strong>
            </div>
          </div>
          <div style={{
            background: '#10B981',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: '600'
          }}>
            READY
          </div>
        </div>
      </div>
    </div>
  );
}



