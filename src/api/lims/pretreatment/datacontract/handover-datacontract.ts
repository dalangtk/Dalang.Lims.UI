import { ApplyPurposeOutput } from '../../shared/datacontract/applypurpose-datacontract'
import { ExamTaskOutput } from '../../shared/datacontract/examtask-datacontract'
import { CodeNameOutput } from '/@/api/admin/data-contracts'

/**
 * 交接入参
 */
export interface HandoverInput {
  taskIds: number[]
  verifyCode?: number | null
}

export interface HandoverOutput {
  status: number
  barcode: string
  sampleTypeList: CodeNameOutput[]
  examTask: ExamTaskOutput[]
  purposeList: ApplyPurposeOutput[]
}

export interface QueryHandoverBatchNoOutput {
  batchNo: number
  handoverId: number
  handoverName: string
  handoverTime: Date
  total: number
}

export interface GetTaskOutput<T> {
  status: number
  sampleTypeList: CodeNameOutput[]
  outputList: T
}
