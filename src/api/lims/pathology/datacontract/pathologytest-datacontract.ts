import { ExamListQueryInput } from '../../shared/datacontract/examinfo-datacontract'
import { ExamSpecialResultListOutput } from '../../shared/datacontract/examspecialresult-datacontract'

export interface PathologyExamListQueryInput extends ExamListQueryInput {
  wfCode?: string
}
export interface PathologyReceiveInput {
  barcode: string | null
  sampleNo: string | null
  wfCode: string | null
}
export interface PathologyBackInput {
  wfCode: string | null
  examInfoIdList: number[] | null
}

export interface PathologyDoctor {
  firstDoctorId: number | null
  firstDoctor: string | null
  secondDoctorId: number | null
  secondDoctor: string | null
  reportDoctorId: number | null
  reportDoctor: string | null
  reportTime: string | null
}

export interface SaveResultInput {
  examInfoId: number | null
  doctor: PathologyDoctor | null
  resultType: number | null
  specialResultList: ExamSpecialResultListOutput[] | null
}
