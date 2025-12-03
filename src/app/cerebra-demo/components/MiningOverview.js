"use client";

import React from "react";
import { lpoHotspots } from "../data/miningData";
import CopperMineProcessFlow from "./CopperMineProcessFlow";

export default function MiningOverview({ onNodeClick }) {
  return (
    <div className="mining-overview" style={{ padding: "24px" }}>
      {/* Copper Mine Process Flow */}
      <CopperMineProcessFlow onNodeClick={onNodeClick} />

      {/* LPO Hotspots Table */}
      <div
        style={{
          background: "rgba(255,255,255,0.95)",
          borderRadius: "12px",
          padding: "24px",
        }}
      >
        <h3
          style={{
            fontSize: "12px",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            color: "#718096",
            marginBottom: "16px",
          }}
        >
          LPO HOTSPOTS - LAST 30 DAYS
        </h3>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f7fafc" }}>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "11px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  color: "#4a5568",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                Equipment
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "right",
                  fontSize: "11px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  color: "#4a5568",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                LPO Hours
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "right",
                  fontSize: "11px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  color: "#4a5568",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                % of Total
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "right",
                  fontSize: "11px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  color: "#4a5568",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                Value Lost
              </th>
            </tr>
          </thead>
          <tbody>
            {lpoHotspots.map((item, index) => (
              <tr
                key={index}
                style={{
                  background: item.isHighlight ? "rgba(239, 68, 68, 0.05)" : "transparent",
                }}
              >
                <td
                  style={{
                    padding: "12px 16px",
                    fontSize: "13px",
                    color: "#1a1a1a",
                    fontWeight: item.isHighlight ? "600" : "400",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  {item.equipment}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    textAlign: "right",
                    fontSize: "13px",
                    color: "#4a5568",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  {item.lpoHours}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    textAlign: "right",
                    fontSize: "13px",
                    fontWeight: item.isHighlight ? "600" : "400",
                    color: item.isHighlight ? "#EF4444" : "#4a5568",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  {item.percentage}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    textAlign: "right",
                    fontSize: "13px",
                    color: "#4a5568",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  {item.valueLost}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: "#f7fafc" }}>
              <td
                style={{
                  padding: "12px 16px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#1a1a1a",
                  borderTop: "2px solid #cbd5e0",
                }}
              >
                TOTAL
              </td>
              <td
                style={{
                  padding: "12px 16px",
                  textAlign: "right",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#1a1a1a",
                  borderTop: "2px solid #cbd5e0",
                }}
              >
                7,200
              </td>
              <td
                style={{
                  padding: "12px 16px",
                  textAlign: "right",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#1a1a1a",
                  borderTop: "2px solid #cbd5e0",
                }}
              >
                100%
              </td>
              <td
                style={{
                  padding: "12px 16px",
                  textAlign: "right",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#1a1a1a",
                  borderTop: "2px solid #cbd5e0",
                }}
              >
                $33.9M
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}



