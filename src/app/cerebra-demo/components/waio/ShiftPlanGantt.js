"use client";

import React, { useState } from 'react';

/**
 * Shift Plan Gantt Chart Component
 * 
 * 12-hour shift plan visualization with tasks for dig faces, haul routes, reclaim, and train loadout.
 */

// Task type colors
const TASK_COLORS = {
  dig: { bg: '#6366F1', border: '#4F46E5', light: '#EEF2FF' },
  haul: { bg: '#8B5CF6', border: '#7C3AED', light: '#F5F3FF' },
  reclaim: { bg: '#F59E0B', border: '#D97706', light: '#FFFBEB' },
  stack: { bg: '#10B981', border: '#059669', light: '#ECFDF5' },
  load: { bg: '#A100FF', border: '#8B00DB', light: '#F5F0FF' },
  dozer: { bg: '#6B7280', border: '#4B5563', light: '#F9FAFB' },
  maintenance: { bg: '#EF4444', border: '#DC2626', light: '#FEF2F2' },
};

// Parse time string to position (0-12h = 0-100%)
function timeToPosition(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const startHour = 6; // Shift starts at 6:00
  const totalMinutes = (hours - startHour) * 60 + minutes;
  return (totalMinutes / (12 * 60)) * 100;
}

// Task bar component
function TaskBar({ task, onClick, isSelected }) {
  const startPos = timeToPosition(task.start);
  const endPos = timeToPosition(task.end);
  const width = endPos - startPos;
  const colors = TASK_COLORS[task.type] || TASK_COLORS.dig;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${startPos}%`,
        width: `${width}%`,
        height: '28px',
        background: isSelected ? colors.border : colors.bg,
        borderRadius: '4px',
        padding: '4px 8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '10px',
        fontWeight: '600',
        color: 'white',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        boxShadow: isSelected ? `0 0 0 2px ${colors.border}50` : 'none',
        transition: 'all 0.2s ease',
        border: `1px solid ${colors.border}`,
      }}
      onClick={() => onClick?.(task)}
      title={`${task.task} (${task.start} - ${task.end})`}
    >
      <span style={{
        width: '16px',
        height: '16px',
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '3px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '9px',
        flexShrink: 0,
      }}>
        {task.type.charAt(0).toUpperCase()}
      </span>
      {width > 8 && (
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {task.task}
        </span>
      )}
    </div>
  );
}

// Time axis component
function TimeAxis() {
  const hours = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  
  return (
    <div style={{
      display: 'flex',
      borderBottom: '1px solid #E2E8F0',
      position: 'relative',
      height: '24px',
    }}>
      {hours.map((hour, idx) => (
        <div
          key={hour}
          style={{
            flex: idx === hours.length - 1 ? 'none' : 1,
            borderLeft: '1px solid #E2E8F0',
            fontSize: '10px',
            color: '#6B7280',
            padding: '4px 4px',
          }}
        >
          {hour}
        </div>
      ))}
      {/* Current time marker */}
      <div style={{
        position: 'absolute',
        left: `${timeToPosition('10:45')}%`,
        top: 0,
        bottom: '-8px',
        width: '2px',
        background: '#EF4444',
        zIndex: 10,
      }}>
        <div style={{
          position: 'absolute',
          top: '-16px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#EF4444',
          color: 'white',
          fontSize: '9px',
          padding: '2px 4px',
          borderRadius: '2px',
          fontWeight: '600',
        }}>
          NOW
        </div>
      </div>
    </div>
  );
}

// Resource row component
function ResourceRow({ resource, tasks, onTaskClick, selectedTask }) {
  return (
    <div style={{
      display: 'flex',
      borderBottom: '1px solid #F3F4F6',
      minHeight: '40px',
    }}>
      {/* Resource label */}
      <div style={{
        width: '100px',
        padding: '8px 12px',
        background: '#F9FAFB',
        borderRight: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        fontSize: '11px',
        fontWeight: '600',
        color: '#1A1A2E',
        flexShrink: 0,
      }}>
        {resource}
      </div>
      
      {/* Task bars */}
      <div style={{
        flex: 1,
        position: 'relative',
        padding: '6px 0',
      }}>
        {tasks.map(task => (
          <TaskBar
            key={task.id}
            task={task}
            onClick={onTaskClick}
            isSelected={selectedTask?.id === task.id}
          />
        ))}
      </div>
    </div>
  );
}

// Task detail panel
function TaskDetailPanel({ task, onClose }) {
  if (!task) return null;
  
  const colors = TASK_COLORS[task.type] || TASK_COLORS.dig;

  return (
    <div style={{
      position: 'absolute',
      right: '16px',
      top: '16px',
      width: '260px',
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #E2E8F0',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      zIndex: 20,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        background: colors.light,
        borderBottom: `2px solid ${colors.bg}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#1A1A2E' }}>
            {task.task}
          </div>
          <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
            {task.resource} • {task.start} - {task.end}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: '#6B7280',
          }}
        >
          ×
        </button>
      </div>
      
      {/* Content */}
      <div style={{ padding: '12px 16px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          marginBottom: '12px',
        }}>
          <div style={{ fontSize: '10px', color: '#6B7280' }}>Type</div>
          <div style={{ 
            fontSize: '11px', 
            fontWeight: '600', 
            color: colors.bg,
            textTransform: 'capitalize',
          }}>
            {task.type}
          </div>
          <div style={{ fontSize: '10px', color: '#6B7280' }}>Duration</div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#1A1A2E' }}>
            {(() => {
              const [startH, startM] = task.start.split(':').map(Number);
              const [endH, endM] = task.end.split(':').map(Number);
              const duration = (endH * 60 + endM) - (startH * 60 + startM);
              return `${Math.floor(duration / 60)}h ${duration % 60}m`;
            })()}
          </div>
        </div>
        
        <div style={{
          background: '#F9FAFB',
          padding: '8px 10px',
          borderRadius: '4px',
          fontSize: '11px',
          color: '#4B5563',
        }}>
          <strong>Justification:</strong> Optimised based on grade requirements and resource availability.
        </div>
      </div>
    </div>
  );
}

// Legend component
function Legend() {
  const types = [
    { type: 'dig', label: 'Dig' },
    { type: 'reclaim', label: 'Reclaim' },
    { type: 'load', label: 'Load' },
    { type: 'dozer', label: 'Dozer' },
  ];

  return (
    <div style={{
      display: 'flex',
      gap: '16px',
      padding: '8px 12px',
      background: '#F9FAFB',
      borderRadius: '4px',
      marginBottom: '12px',
    }}>
      {types.map(({ type, label }) => {
        const colors = TASK_COLORS[type];
        return (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '3px',
              background: colors.bg,
            }} />
            <span style={{ fontSize: '10px', color: '#6B7280' }}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function ShiftPlanGantt({ 
  tasks = [], 
  title = "Shift Plan (12h)",
  onTaskSelect,
}) {
  const [selectedTask, setSelectedTask] = useState(null);

  // Group tasks by resource
  const tasksByResource = tasks.reduce((acc, task) => {
    if (!acc[task.resource]) {
      acc[task.resource] = [];
    }
    acc[task.resource].push(task);
    return acc;
  }, {});

  const handleTaskClick = (task) => {
    setSelectedTask(selectedTask?.id === task.id ? null : task);
    onTaskSelect?.(task);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
      }}>
        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1A1A2E' }}>
          {title}
        </div>
        <Legend />
      </div>

      {/* Gantt chart */}
      <div style={{
        background: 'white',
        borderRadius: '8px',
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
      }}>
        {/* Time axis */}
        <div style={{ marginLeft: '100px' }}>
          <TimeAxis />
        </div>

        {/* Resource rows */}
        {Object.entries(tasksByResource).map(([resource, resourceTasks]) => (
          <ResourceRow
            key={resource}
            resource={resource}
            tasks={resourceTasks}
            onTaskClick={handleTaskClick}
            selectedTask={selectedTask}
          />
        ))}
      </div>

      {/* Task detail panel */}
      <TaskDetailPanel 
        task={selectedTask} 
        onClose={() => setSelectedTask(null)} 
      />
    </div>
  );
}

export { TaskBar, ResourceRow, TimeAxis, Legend };
