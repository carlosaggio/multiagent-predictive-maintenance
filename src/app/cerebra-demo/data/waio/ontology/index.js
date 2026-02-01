/**
 * P2C Ontology Index
 * 
 * Central export for all P2C ontology-related data and utilities.
 */

// Schema exports
export {
  default as p2cOntologySchema,
  entityTypes,
  relationshipTypes,
  ENTITY_COLORS,
  ENTITY_ICONS,
  getEntityType,
  getRelationshipType,
  getEntityTypesByCategory,
  getRelationshipsForEntity,
} from './p2cOntologySchema';

// Instance graph exports
export {
  default as p2cInstanceGraph,
  p2cGraphNodes,
  p2cGraphEdges,
  highlightPaths,
  getNodeById,
  getEdgesForNode,
  getNodesByType,
  getConnectedNodes,
  searchNodes,
  getUpstreamNodes,
  getDownstreamNodes,
  findPaths,
  getNodeTypes,
  getRelationshipTypes,
} from './p2cInstanceGraph';

// Lineage graph exports
export {
  default as p2cLineageGraph,
  lineageSystems,
  dataProducts,
  lineageEdges,
  lineagePaths,
  getSystemLineage,
  getDataProduct,
} from './p2cLineageGraph';

// Decision graph exports
export {
  default as p2cDecisionGraph,
  agentRuns,
  toolCalls,
  recommendations,
  getToolCallsForRun,
  getRecommendationsForRun,
  getEntitiesAccessedByToolCall,
  getDecisionTraceForEntity,
} from './p2cDecisionGraph';
