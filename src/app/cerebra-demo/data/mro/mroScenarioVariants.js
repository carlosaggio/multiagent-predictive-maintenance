export const mroScenarioVariants = [
  {
    id: 'variant_a',
    name: 'C-Check Critical Spares Gap — Hangar 1',
    q1Text: "⚠️ Alert: Aircraft AC-042 (A320neo) arrived 2 days early for C-Check at Hangar Site 1. Work Package WP-55 has 3 critical parts flagged at-risk — PO-8837 delayed by vendor (5 days), Rotable SN-44821 in repair (TAT breach), and Alternate PN-7742 requires engineering approval. Predicted redelivery delay: 3 days. Activate MRO Operations Intelligence?",
    aircraftTail: 'AC-042',
    aircraftType: 'A320neo',
    checkType: 'C-Check',
    hangarSite: 'Hangar Site 1',
    workPackage: 'WP-55',
    redPartsCount: 3,
    predictedDelay: 3,
    redeliveryRisk: 72,
    poolCoverage: 89,
    mbhExceptions: 2,
  },
  {
    id: 'variant_b',
    name: 'Component Pool Imbalance — AOG Risk at Hub East',
    q1Text: "⚠️ Alert: Outstation Hub East reports IDG inventory below safety stock (1 unit vs 3 required). Two repair orders (RO-445, RO-446) slipping beyond SLA — predicted TAT overrun: 8 days. Aircraft-on-Ground probability at Hub East: 34% within 72 hours. Component Pool coverage has dropped to 61%. Activate MRO Operations Intelligence?",
    aircraftTail: 'AC-118',
    aircraftType: 'B737-800',
    checkType: 'Component Exchange',
    hangarSite: 'Hub East',
    workPackage: 'WP-Component-Pool',
    redPartsCount: 2,
    predictedDelay: 0,
    redeliveryRisk: 34,
    poolCoverage: 61,
    mbhExceptions: 0,
  },
  {
    id: 'variant_c',
    name: 'MBH Revenue Exception — Contract Beta Billing Gap',
    q1Text: "⚠️ Alert: Revenue Assurance has flagged a $240K discrepancy in MBH Contract Beta (Operator Alpha, A320neo fleet). Flying hours reported by operator don't match accrual model — 2 aircraft utilisation changes unreported, 1 component swap not captured in billing system. Quarterly billing deadline: 5 business days. Activate MRO Operations Intelligence?",
    aircraftTail: 'Fleet-Alpha',
    aircraftType: 'A320neo Fleet',
    checkType: 'Revenue Review',
    hangarSite: 'Finance & Commercial',
    workPackage: 'MBH-Contract-Beta',
    redPartsCount: 0,
    predictedDelay: 0,
    redeliveryRisk: 0,
    poolCoverage: 94,
    mbhExceptions: 3,
  },
];

let currentVariantIndex = 0;

export function getCurrentMROScenarioVariant() {
  return mroScenarioVariants[currentVariantIndex];
}

export function setMROScenarioVariantById(variantId) {
  const idx = mroScenarioVariants.findIndex(v => v.id === variantId);
  if (idx !== -1) currentVariantIndex = idx;
  return mroScenarioVariants[currentVariantIndex];
}

export function getRandomMROScenarioVariant() {
  currentVariantIndex = Math.floor(Math.random() * mroScenarioVariants.length);
  return mroScenarioVariants[currentVariantIndex];
}

export default mroScenarioVariants;
