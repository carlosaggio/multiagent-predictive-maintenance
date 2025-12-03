// Fault Tree Analysis Data
// Based on FMEA (Failure Mode and Effects Analysis) methodology
// 3-level hierarchy: Primary Event -> Categories -> Basic Events
// Data aligned with Jaw Crusher 101 dashboard readings

export const faultTreeData = {
  id: 'root',
  name: 'Efficiency Drop',
  subtitle: '89% → 82% (-7%)',
  type: 'event',
  probability: 100,
  gate: 'AND',
  description: 'Jaw Crusher 101 efficiency dropped 7 percentage points since Jan 10, 2025',
  children: [
    {
      id: 'mechanical',
      name: 'Mechanical Wear',
      type: 'category',
      probability: 85,
      gate: 'OR',
      description: 'Physical degradation of crusher components',
      children: [
        {
          id: 'liner_wear',
          name: 'Liner Wear Degradation',
          type: 'basic',
          probability: 85,
          severity: 'critical',
          evidence: [
            'Last replacement: May 15, 2024 (8 months ago)',
            'Thickness: 65% remaining (below 70% threshold)',
            'Zone B: 85% wear - critical condition',
            'Wear rate: 2.1mm/week (40% above normal)',
          ],
          recommendation: 'Schedule immediate liner replacement by Jan 20',
          detectionMethod: 'Ultrasonic thickness measurement',
          failureMode: 'Abrasive wear from ore contact',
          riskPriorityNumber: 432, // S=8, O=6, D=9
        },
        {
          id: 'bearing_degradation',
          name: 'Pitman Bearing Degradation',
          type: 'basic',
          probability: 60,
          severity: 'high',
          evidence: [
            'NDE Bearing Temp: 108°C (threshold: 85°C)',
            'DE Bearing Vib: 55 mm/s (threshold: 25 mm/s)',
            'Correlated with asymmetric liner wear',
          ],
          recommendation: 'Inspect bearings during liner replacement shutdown',
          detectionMethod: 'Vibration & temperature monitoring',
          failureMode: 'Rolling element fatigue from misalignment',
          riskPriorityNumber: 224, // S=7, O=4, D=8
        },
        {
          id: 'shaft_alignment',
          name: 'Jaw Misalignment',
          type: 'basic',
          probability: 25,
          severity: 'medium',
          evidence: [
            'Last alignment: Aug 4, 2024 (during PM)',
            'Asymmetric wear pattern suggests 2-3mm drift',
            'NDE/DE vibration differential noted',
          ],
          recommendation: 'Include alignment check during liner replacement',
          detectionMethod: 'Laser alignment measurement',
          failureMode: 'Jaw pivot misalignment',
          riskPriorityNumber: 200,
        },
      ],
    },
    {
      id: 'process',
      name: 'Process Conditions',
      type: 'category',
      probability: 45,
      gate: 'OR',
      description: 'Operating parameters outside optimal range',
      children: [
        {
          id: 'motor_overload',
          name: 'Drive Motor Overload',
          type: 'basic',
          probability: 40,
          severity: 'medium',
          evidence: [
            'Phase A Current: 120A (threshold: 100A)',
            'Phase B Current: 110A (threshold: 100A)',
            'Phase C Current: 98A (near threshold)',
            'Current 41% above normal 85A baseline',
          ],
          recommendation: 'Review motor protection settings, reduce feed rate 10%',
          detectionMethod: 'Motor current monitoring',
          failureMode: 'Thermal overload from hard ore',
          riskPriorityNumber: 144, // S=6, O=3, D=8
        },
        {
          id: 'feed_rate',
          name: 'Feed Rate Variance',
          type: 'basic',
          probability: 35,
          severity: 'medium',
          evidence: [
            'Control logs: ±15% feed rate variation',
            'Surge loading patterns detected',
            'Inconsistent ore delivery from ROM bin',
          ],
          recommendation: 'Optimize feed control PID parameters',
          detectionMethod: 'PLC data analysis',
          failureMode: 'Surge loading',
          riskPriorityNumber: 280,
        },
        {
          id: 'css_drift',
          name: 'CSS Setting Drift',
          type: 'basic',
          probability: 15,
          severity: 'low',
          evidence: [
            'Set point: 150mm',
            'Discharge ore size trending high',
            'Product size +23% above target',
          ],
          recommendation: 'Adjust CSS during liner replacement',
          detectionMethod: 'Product size measurement',
          failureMode: 'Mechanical adjustment creep',
          riskPriorityNumber: 90,
        },
      ],
    },
    {
      id: 'material',
      name: 'Material Input',
      type: 'category',
      probability: 30,
      gate: 'OR',
      description: 'Ore characteristics affecting crusher performance',
      children: [
        {
          id: 'hard_ore',
          name: 'Hard Ore Feed',
          type: 'basic',
          probability: 75,
          severity: 'high',
          evidence: [
            'Pit 3 Zone B: Harder ore zone entered',
            'Bond Work Index: 15.2 kWh/t (+15%)',
            'Silica content: +8% from baseline',
            'Motor current elevated confirms harder ore',
          ],
          recommendation: 'Adjust blasting patterns, blend ore sources',
          detectionMethod: 'Core sampling and assay',
          failureMode: 'Excessive liner abrasion',
          riskPriorityNumber: 280, // S=7, O=5, D=8
        },
        {
          id: 'moisture',
          name: 'Moisture Content',
          type: 'basic',
          probability: 25,
          severity: 'low',
          evidence: [
            'Recent rainfall: +8% ore moisture',
            'Some material sticking observed',
            'Minor plugging at feed chute',
          ],
          recommendation: 'Monitor stockpile management',
          detectionMethod: 'Moisture analyzer',
          failureMode: 'Bridging and plugging',
          riskPriorityNumber: 180,
        },
        {
          id: 'contamination',
          name: 'Tramp Material',
          type: 'basic',
          probability: 10,
          severity: 'low',
          evidence: [
            'Metal detector: Normal readings',
            'No tramp incidents in last 30 days',
            'Visual inspections clear',
          ],
          recommendation: 'No action required',
          detectionMethod: 'Metal detector, visual inspection',
          failureMode: 'Liner damage from tramp metal',
          riskPriorityNumber: 60,
        },
      ],
    },
  ],
};

// Severity color mapping
export const severityColors = {
  critical: '#EF4444', // Red
  high: '#F59E0B', // Orange  
  medium: '#FBBF24', // Yellow
  low: '#10B981', // Green
};

// Get probability color based on value
export const getProbabilityColor = (probability) => {
  if (probability >= 75) return '#EF4444'; // Red
  if (probability >= 50) return '#F59E0B'; // Orange
  if (probability >= 25) return '#FBBF24'; // Yellow
  return '#10B981'; // Green
};

// Flattened fault tree options for Q3 dynamic options
export const faultTreeOptions = faultTreeData.children.flatMap(category =>
  category.children.map(item => ({
    id: item.id,
    label: item.name,
    probability: item.probability,
    evidence: item.evidence?.[0] || '',
    color: getProbabilityColor(item.probability),
    category: category.name,
    severity: item.severity,
    recommendation: item.recommendation,
  }))
).sort((a, b) => b.probability - a.probability);

export default faultTreeData;
