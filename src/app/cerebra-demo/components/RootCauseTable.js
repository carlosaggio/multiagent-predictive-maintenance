"use client";

import React from 'react';

// Root cause data - aligned with fault tree, left panel options, and scenario context
// Last liner replacement: May 15, 2024 (8 months ago)
const rootCauseData = [
  {
    rank: 1,
    cause: 'Liner Wear Degradation',
    likelihood: 85,
    reasons: '65% thickness remaining, 8 months since replacement (May 2024), Zone B critical',
  },
  {
    rank: 2,
    cause: 'Hard Ore Feed',
    likelihood: 75,
    reasons: 'Bond Work Index +15%, Pit 3 Zone B harder ore',
  },
  {
    rank: 3,
    cause: 'Pitman Bearing Degradation',
    likelihood: 60,
    reasons: 'NDE Temp: 108°C (>85°C), DE Vib: 55 mm/s (>25 mm/s)',
  },
  {
    rank: 4,
    cause: 'Drive Motor Overload',
    likelihood: 40,
    reasons: 'Phase currents 98-120A (threshold: 100A)',
  },
];

export default function RootCauseTable({ data = rootCauseData }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      {/* Compact Table */}
      <div style={{
        borderRadius: '6px',
        overflow: 'hidden',
        border: '1px solid #E2E8F0',
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '11px',
        }}>
          <thead>
            <tr style={{
              background: '#A100FF',
              color: 'white',
            }}>
              <th style={{
                padding: '8px 12px',
                textAlign: 'center',
                fontWeight: '600',
                width: '40px',
                fontSize: '10px',
              }}>
                #
              </th>
              <th style={{
                padding: '8px 12px',
                textAlign: 'left',
                fontWeight: '600',
                fontSize: '10px',
              }}>
                Root Cause
              </th>
              <th style={{
                padding: '8px 12px',
                textAlign: 'center',
                fontWeight: '600',
                width: '70px',
                fontSize: '10px',
              }}>
                Prob.
              </th>
              <th style={{
                padding: '8px 12px',
                textAlign: 'left',
                fontWeight: '600',
                fontSize: '10px',
              }}>
                Evidence
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={item.rank}
                style={{
                  background: index % 2 === 0 ? 'white' : '#FAFAFA',
                }}
              >
                <td style={{
                  padding: '8px 12px',
                  textAlign: 'center',
                  fontWeight: '600',
                  color: '#374151',
                  borderBottom: index < data.length - 1 ? '1px solid #F0F0F0' : 'none',
                }}>
                  {item.rank}
                </td>
                <td style={{
                  padding: '8px 12px',
                  color: '#374151',
                  fontWeight: '500',
                  borderBottom: index < data.length - 1 ? '1px solid #F0F0F0' : 'none',
                }}>
                  {item.cause}
                </td>
                <td style={{
                  padding: '8px 12px',
                  textAlign: 'center',
                  fontWeight: '700',
                  color: item.likelihood >= 75 ? '#EF4444' : item.likelihood >= 50 ? '#F59E0B' : '#10B981',
                  borderBottom: index < data.length - 1 ? '1px solid #F0F0F0' : 'none',
                }}>
                  {item.likelihood}%
                </td>
                <td style={{
                  padding: '8px 12px',
                  color: '#6B7280',
                  fontSize: '10px',
                  borderBottom: index < data.length - 1 ? '1px solid #F0F0F0' : 'none',
                }}>
                  {item.reasons}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
