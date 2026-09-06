export interface EstateFormData {
  estateName: string
  estateAddress: string
  stateLocated: string
  lgaLocated: string
  levelStructure: string
  estateStructure: string
  numberOfUnits: string
  customNumberOfUnits: string
  bankAccountNumber: string
  bankName: string
  bankAccountName: string
  stakeholder1Name: string
  stakeholder1Phone: string
  stakeholder1Email: string
  stakeholder1Nin: File | null
  stakeholder2Name: string
  stakeholder2Phone: string
  stakeholder2Email: string
  stakeholder2Nin: File | null
  residentsCsv: File | null
}

export const INITIAL_FORM: EstateFormData = {
  estateName: '',
  estateAddress: '',
  stateLocated: '',
  lgaLocated: '',
  levelStructure: '',
  estateStructure: '',
  numberOfUnits: '',
  customNumberOfUnits: '',
  bankAccountNumber: '',
  bankName: '',
  bankAccountName: '',
  stakeholder1Name: '',
  stakeholder1Phone: '',
  stakeholder1Email: '',
  stakeholder1Nin: null,
  stakeholder2Name: '',
  stakeholder2Phone: '',
  stakeholder2Email: '',
  stakeholder2Nin: null,
  residentsCsv: null,
}

/** Per-field errors — keys match EstateFormData keys */
export type FieldErrors = Partial<Record<keyof EstateFormData, string>>

export const NIGERIAN_BANKS = [
  'Access Bank',
  'Citibank Nigeria',
  'Ecobank Nigeria',
  'Fidelity Bank',
  'First Bank of Nigeria',
  'First City Monument Bank',
  'Globus Bank',
  'Guaranty Trust Bank',
  'Heritage Banking Company',
  'Jaiz Bank',
  'Keystone Bank',
  'Kuda Bank',
  'Lotus Bank',
  'Optimus Bank',
  'Parallex Bank',
  'Polaris Bank',
  'Providus Bank',
  'Stanbic IBTC Bank',
  'Standard Chartered',
  'Sterling Bank',
  'SunTrust Bank',
  'TAJBank',
  'Titan Trust Bank',
  'Union Bank of Nigeria',
  'United Bank for Africa',
  'Unity Bank',
  'VFD Microfinance Bank',
  'Wema Bank',
  'Zenith Bank',
]

/* ── Structure carousel pages ── */

export const STRUCTURE_PAGES = [
  { structures: ['1-level', '2-level'] as const },
  { structures: ['3-level', '4-level'] as const },
  { structures: ['5-level', '6-level'] as const },
]
