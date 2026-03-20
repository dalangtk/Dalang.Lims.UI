import { CustomerPurMatchMainDto } from "./pretreatcustomerpurposematch-datacontract"

export interface DataAuditOutput {
  customerCode?: string
  barcode?: string
  patientName?: string
  auditStatus?: boolean
  auditFailedType?: number
  errMsg?: string
  needMatchPurList?: CustomerPurMatchMainDto[]
}
