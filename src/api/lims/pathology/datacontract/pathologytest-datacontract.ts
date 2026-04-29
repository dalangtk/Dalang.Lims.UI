import { ExamListQueryInput } from '../../shared/datacontract/examinfo-datacontract'

export interface PathologyExamListQueryInput extends ExamListQueryInput {
  wfCode?: string | null
}
export interface PathologyReceiveInput {
  barcode: string | null
  sampleNo: string | null
  wfCode: string | null
}
