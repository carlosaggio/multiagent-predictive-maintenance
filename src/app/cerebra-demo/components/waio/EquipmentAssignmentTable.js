"use client";

import React, { useState } from 'react';

/**
 * Equipment Assignment Table Component
 * 
 * Sortable table showing asset, operator, assignment, utilisation, and constraint flags.
 */

// Utilisation bar component
function UtilisationBar({ value }) {
  const getColor = (val) => {
    if (val >= 0.85) return '#10B981';
    if (val >= 0.7) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        width: '60px',
        height: '6px',
        background: '#E5E7EB',
        borderRadius: '3px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${value * 100}%`,
          height: '100%',
          background: getColor(value),
          borderRadius: '3px',
          transition: 'width 0.3s ease',
        }} />
      </div>
      <span style={{ 
        fontSize: '11px', 
        fontWeight: '600', 
        color: getColor(value),
        minWidth: '35px',
      }}>
        {Math.round(value * 100)}%
      </span>
    </div>
  );
}

// Constraint badge component
function ConstraintBadge({ constraint }) {
  if (!constraint) return null;

  return (
    <div style={{
      padding: '3px 8px',
      borderRadius: '4px',
      background: '#FEF3C7',
      color: '#92400E',
      fontSize: '10px',
      fontWeight: '500',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
    }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      {constraint}
    </div>
  );
}

// Sort icon component
function SortIcon({ direction }) {
  if (!direction) {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
        <path d="M7 15l5 5 5-5"/>
        <path d="M7 9l5-5 5 5"/>
      </svg>
    );
  }
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#A100FF" strokeWidth="2">
      {direction === 'asc' ? (
        <path d="M7 15l5-5 5 5"/>
      ) : (
        <path d="M7 9l5 5 5-5"/>
      )}
    </svg>
  );
}

// Table header component
function TableHeader({ columns, sortConfig, onSort }) {
  return (
    <thead>
      <tr>
        {columns.map(col => (
          <th
            key={col.key}
            onClick={() => col.sortable && onSort(col.key)}
            style={{
              padding: '12px 14px',
              textAlign: col.align || 'left',
              background: '#F9FAFB',
              borderBottom: '2px solid #E2E8F0',
              fontSize: '10px',
              fontWeight: '600',
              color: '#6B7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              cursor: col.sortable ? 'pointer' : 'default',
              userSelect: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px',
              justifyContent: col.align === 'right' ? 'flex-end' : 'flex-start',
            }}>
              {col.label}
              {col.sortable && (
                <SortIcon 
                  direction={sortConfig?.key === col.key ? sortConfig.direction : null} 
                />
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}

// Table row component
function TableRow({ row, columns }) {
  return (
    <tr style={{
      borderBottom: '1px solid #F3F4F6',
      transition: 'background 0.2s ease',
    }}>
      {columns.map(col => (
        <td
          key={col.key}
          style={{
            padding: '12px 14px',
            fontSize: '12px',
            color: '#1A1A2E',
            textAlign: col.align || 'left',
          }}
        >
          {col.render ? col.render(row[col.key], row) : row[col.key]}
        </td>
      ))}
    </tr>
  );
}

export default function EquipmentAssignmentTable({ 
  assignments = [],
  title = 'Equipment Assignments',
}) {
  const [sortConfig, setSortConfig] = useState({ key: 'asset', direction: 'asc' });

  // Column definitions
  const columns = [
    { 
      key: 'asset', 
      label: 'Asset', 
      sortable: true,
      render: (value) => (
        <span style={{ fontWeight: '600', color: '#1A1A2E' }}>{value}</span>
      ),
    },
    { 
      key: 'operator', 
      label: 'Operator/Crew', 
      sortable: true,
    },
    { 
      key: 'assignment', 
      label: 'Assignment', 
      sortable: true,
      render: (value) => (
        <span style={{ 
          padding: '4px 8px', 
          background: '#EEF2FF', 
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: '500',
          color: '#4338CA',
        }}>
          {value}
        </span>
      ),
    },
    { 
      key: 'utilisation', 
      label: 'Utilisation', 
      sortable: true,
      align: 'center',
      render: (value) => <UtilisationBar value={value} />,
    },
    { 
      key: 'constraint', 
      label: 'Constraints', 
      sortable: false,
      render: (value) => <ConstraintBadge constraint={value} />,
    },
  ];

  // Default data
  const defaultAssignments = [
    { asset: 'SH-01', operator: 'Mike Chen', assignment: 'PIT1-ZA Dig Face 1', utilisation: 0.88, constraint: null },
    { asset: 'SH-02', operator: 'David Lee', assignment: 'PIT1-ZA Dig Face 2', utilisation: 0.85, constraint: null },
    { asset: 'SH-03', operator: 'Sarah Wong', assignment: 'PIT3-ZC Dig Face 1', utilisation: 0.80, constraint: 'Starts 10:00' },
    { asset: 'RC-01', operator: 'Auto', assignment: 'SP-3 Reclaim', utilisation: 0.75, constraint: 'Rate limited' },
    { asset: 'RC-02', operator: 'Auto', assignment: 'SP-2 Reclaim', utilisation: 0.90, constraint: null },
    { asset: 'TRK-08', operator: 'James Taylor', assignment: 'PIT1-ZA Haul', utilisation: 0.65, constraint: 'Newly activated' },
    { asset: 'DZ-01', operator: 'Tom Brown', assignment: 'SP-3 Stockpile Mgmt', utilisation: 0.72, constraint: null },
  ];

  const data = assignments.length > 0 ? assignments : defaultAssignments;

  // Sort handler
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Sort data
  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0;
    
    let aVal = a[sortConfig.key];
    let bVal = b[sortConfig.key];
    
    // Handle null values
    if (aVal === null) aVal = '';
    if (bVal === null) bVal = '';
    
    // Compare
    if (typeof aVal === 'string') {
      return sortConfig.direction === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    
    return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
  });

  // Calculate summary stats
  const avgUtilisation = data.reduce((acc, row) => acc + (row.utilisation || 0), 0) / data.length;
  const constraintCount = data.filter(row => row.constraint).length;

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #E2E8F0',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: '#1A1A2E' }}>
          {title}
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ fontSize: '11px', color: '#6B7280' }}>
            <span style={{ fontWeight: '500' }}>Avg Util:</span>{' '}
            <span style={{ 
              fontWeight: '600', 
              color: avgUtilisation >= 0.8 ? '#10B981' : '#F59E0B',
            }}>
              {Math.round(avgUtilisation * 100)}%
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#6B7280' }}>
            <span style={{ fontWeight: '500' }}>Constraints:</span>{' '}
            <span style={{ 
              fontWeight: '600', 
              color: constraintCount > 0 ? '#F59E0B' : '#10B981',
            }}>
              {constraintCount}
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
        }}>
          <TableHeader 
            columns={columns} 
            sortConfig={sortConfig}
            onSort={handleSort}
          />
          <tbody>
            {sortedData.map((row, idx) => (
              <TableRow key={idx} row={row} columns={columns} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{
        padding: '10px 16px',
        background: '#F9FAFB',
        borderTop: '1px solid #E2E8F0',
        fontSize: '10px',
        color: '#6B7280',
      }}>
        {data.length} equipment items assigned • Click column headers to sort
      </div>
    </div>
  );
}

export { UtilisationBar, ConstraintBadge, TableHeader, TableRow };
