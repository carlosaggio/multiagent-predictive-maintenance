/**
 * WAIO Output Stages Index
 * 
 * Central export for all WAIO output stage components.
 */

export { default as WAIOAgentNetworkStage } from './WAIOAgentNetworkStage';
export { default as WAIODeviationTraceStage } from './WAIODeviationTraceStage';
export { default as WAIOParallelHuddleStage } from './WAIOParallelHuddleStage';
export { default as WAIOPlanOptionsStage } from './WAIOPlanOptionsStage';
export { default as WAIOShiftPlanStage } from './WAIOShiftPlanStage';
export { default as WAIOPublishStage } from './WAIOPublishStage';
export { default as WAIOMonitorStage } from './WAIOMonitorStage';

// Closed-loop stages (new)
export { default as WAIOReconciliationStage } from './WAIOReconciliationStage';
export { default as WAIOMinePlanRetrofitStage } from './WAIOMinePlanRetrofitStage';
export { default as WAIOPublishToSystemsStage } from './WAIOPublishToSystemsStage';
