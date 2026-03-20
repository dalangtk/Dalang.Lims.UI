export interface SampleQueryInput {
  patientName: string | null
  customerCode: string | null
  barcode: string | null
  beginTime: Date | null
  endTime: Date | null
  purCodes: string[] | null
}
