/**
 * API Adapter Interface
 * Provides a common contract for mock and real API implementations.
 * No ASP.NET Core endpoint contracts are invented here; this is purely structural.
 */

export type DataMode = "mock" | "api"

export function getDataMode(): DataMode {
  return (process.env.NEXT_PUBLIC_DATA_MODE as DataMode) || "api"
}

// Extend this interface in specific adapters (e.g., PublicAdapter, AdminAdapter)
export interface BaseApiAdapter {
  // Base interface for adapters
}
