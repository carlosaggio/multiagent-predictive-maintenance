export const mroKPIs = {
  controlTower: [
    { id: 'active_checks', label: 'Active Checks', value: 5, unit: '', trend: 'stable', icon: 'plane' },
    { id: 'red_parts', label: 'Red Parts', value: 3, unit: '', trend: 'up', severity: 'critical', icon: 'alert' },
    { id: 'delay_risk', label: 'Delay Risk', value: 72, unit: '%', trend: 'up', severity: 'warning', icon: 'clock' },
    { id: 'pool_coverage', label: 'Pool Coverage', value: 89, unit: '%', trend: 'down', severity: 'warning', icon: 'layers' },
    { id: 'mbh_exceptions', label: 'MBH Exceptions', value: 2, unit: '', trend: 'up', severity: 'warning', icon: 'dollar' },
  ],
  mbhDashboard: [
    { id: 'flying_hours', label: 'Flying Hours', value: '42.1K', unit: 'FH', trend: '+2%', icon: 'clock' },
    { id: 'accrual', label: 'Accrual', value: '$8.4M', unit: '', trend: '-$240K', severity: 'warning', icon: 'dollar' },
    { id: 'exceptions', label: 'Exceptions', value: 3, unit: '', trend: '+1', severity: 'warning', icon: 'alert' },
    { id: 'billing_ready', label: 'Billing Ready', value: '87%', unit: '', trend: 'stable', icon: 'check' },
  ],
};

export const mroKPITimeSeries = {
  partAvailability: [
    { day: 'Day 1', available: 95, safetyStock: 85, demand: 80 },
    { day: 'Day 3', available: 90, safetyStock: 85, demand: 82 },
    { day: 'Day 5', available: 82, safetyStock: 85, demand: 88 },
    { day: 'Day 7', available: 75, safetyStock: 85, demand: 92 },
    { day: 'Day 9', available: 68, safetyStock: 85, demand: 95 },
    { day: 'Day 11', available: 60, safetyStock: 85, demand: 93 },
    { day: 'Day 14', available: 55, safetyStock: 85, demand: 90 },
    { day: 'Day 18', available: 70, safetyStock: 85, demand: 85 },
    { day: 'Day 21', available: 88, safetyStock: 85, demand: 82 },
  ],
  poolCoverage: [
    { month: 'Jul', idg: 85, apu: 96, ldg: 92 },
    { month: 'Aug', idg: 82, apu: 95, ldg: 93 },
    { month: 'Sep', idg: 78, apu: 94, ldg: 91 },
    { month: 'Oct', idg: 72, apu: 97, ldg: 94 },
    { month: 'Nov', idg: 65, apu: 96, ldg: 93 },
    { month: 'Dec', idg: 61, apu: 97, ldg: 94 },
  ],
  revenueAccrual: [
    { contract: 'Alpha', expected: 3200000, actual: 3200000, variance: 0 },
    { contract: 'Beta', expected: 2400000, actual: 2160000, variance: -240000 },
    { contract: 'Gamma', expected: 2800000, actual: 2740000, variance: -60000 },
  ],
};

export default mroKPIs;
