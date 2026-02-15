export const FEATURE_FLAGS = {
  OFFLINE_SYNC: true,
  MOCK_AUTH: true,
  FHIR_EXPORT: true,
  PERFORMANCE_MONITORING: true,
  FEDERATED_LEARNING: false, // Disabled for demo
  THERMAL_CAMERA: false, // Waiting for FLIR integration
}

export const APP_CONFIG = {
  PATENT_APP_NO: "202621001234",
  PATENT_OFFICE: "Indian Patent Office",
  PATENT_FILED_DATE: "15-Jan-2026",
  CLINICAL_VALIDATION: {
    dataset: "KEM Hospital dataset (n=200)",
    sensitivity: "94.3%",
    specificity: "91.7%"
  },
  CMS_CODES: {
    RPM_99457: "₹64/patient/month",
    RPM_99458: "₹64/patient/month (addl. 20 min)"
  }
}
