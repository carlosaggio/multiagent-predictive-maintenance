export const mroScenarioOptions = [
  {
    id: 'OPTION-A',
    name: 'Option A: Expedite PO',
    description: 'Expedite PO-8837 with Parts Corp — pay premium to reduce delivery by 3 days',
    recommended: false,
    predictedOutcome: {
      daysSaved: 3,
      cost: 4200,
      riskReduction: 0.45,
      knockOnRisk: 'low',
      redeliveryOnTime: 0.78,
    },
    keyActions: [
      'Pay $4,200 expedite fee to Parts Corp',
      'Arrange DHL Priority shipment on arrival',
      'Update MRP need date for PN-7742',
    ],
    tradeoffs: {
      pros: ['Simple single-action resolution', 'Maintains vendor relationship', 'No inventory disruption'],
      cons: ['$4,200 expedite cost', 'Still 2-day residual delay risk', 'Vendor reliability concern'],
    },
    metrics: {
      costImpact: '+$4,200',
      timeImpact: '-3 days',
      riskScore: 'Medium',
      confidence: 0.78,
    },
  },
  {
    id: 'OPTION-B',
    name: 'Option B: Transfer + Reprioritise',
    description: 'Transfer PN-3391 from Pool East (18h) and reprioritise repair shop queue for PN-7742 alternate',
    recommended: true,
    predictedOutcome: {
      daysSaved: 5,
      cost: 280,
      riskReduction: 0.72,
      knockOnRisk: 'low',
      redeliveryOnTime: 0.94,
    },
    keyActions: [
      'Transfer PN-3391 from Pool East via DHL Priority (18h, $280)',
      'Reprioritise repair queue: move RO-448 to expedite lane',
      'Release PN-9108 from completed RO-221',
      'Keep PO-8837 as backup (no expedite fee)',
    ],
    tradeoffs: {
      pros: ['Lowest cost ($280 shipping only)', 'Highest risk reduction (72%)', 'Fastest resolution (18h for first part)', 'Maintains all backup options'],
      cons: ['Pool East loses 1 unit temporarily', 'Repair queue disruption for 1 order'],
    },
    metrics: {
      costImpact: '+$280',
      timeImpact: '-5 days',
      riskScore: 'Low',
      confidence: 0.91,
    },
  },
  {
    id: 'OPTION-C',
    name: 'Option C: Alternate Part Substitution',
    description: 'Use approved alternate PN-7742A for hydraulic actuator — requires engineering sign-off',
    recommended: false,
    predictedOutcome: {
      daysSaved: 4,
      cost: 6100,
      riskReduction: 0.58,
      knockOnRisk: 'medium',
      redeliveryOnTime: 0.85,
    },
    keyActions: [
      'Submit engineering approval for PN-7742A substitution',
      'Source PN-7742A from AeroParts Inc (3-day lead, $6,100)',
      'Update work card specifications for alternate part',
    ],
    tradeoffs: {
      pros: ['Eliminates dependency on Parts Corp', 'Approved alternate in technical catalog', 'Good fallback if transfer fails'],
      cons: ['Requires engineering approval (12-24h)', '$6,100 cost (higher than transfer)', 'Work card update overhead'],
    },
    metrics: {
      costImpact: '+$6,100',
      timeImpact: '-4 days',
      riskScore: 'Medium',
      confidence: 0.82,
    },
  },
  {
    id: 'OPTION-D',
    name: 'Option D: Combined Strategy',
    description: 'Execute transfer immediately + expedite PO as backup + request engineering approval for alternate',
    recommended: false,
    predictedOutcome: {
      daysSaved: 6,
      cost: 4480,
      riskReduction: 0.88,
      knockOnRisk: 'very_low',
      redeliveryOnTime: 0.97,
    },
    keyActions: [
      'Immediate: Transfer PN-3391 from Pool East (18h)',
      'Immediate: Release PN-9108 from RO-221',
      'Backup: Expedite PO-8837 ($4,200) — cancel if transfer succeeds',
      'Contingency: Request engineering approval for PN-7742A',
    ],
    tradeoffs: {
      pros: ['Highest risk reduction (88%)', 'Multiple fallback layers', 'Near-certain on-time redelivery (97%)'],
      cons: ['Highest potential cost ($4,480)', 'Complexity of managing parallel actions', 'May over-allocate resources'],
    },
    metrics: {
      costImpact: '+$4,480',
      timeImpact: '-6 days',
      riskScore: 'Very Low',
      confidence: 0.94,
    },
  },
];

export default mroScenarioOptions;
