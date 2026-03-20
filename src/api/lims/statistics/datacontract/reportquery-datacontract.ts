import { ExamInfoOutput } from '../../shared/datacontract/examinfo-datacontract'
import { ExamResultOutput } from '../../shared/datacontract/examresult-datacontract'
import { ExamSampleTrackOutput } from '../../shared/datacontract/sampletrack-datacontract'

export interface ReportQureryInput {
  patientName: string | null
  customer: string | null
  barcode: string | null
  begin: Date | null
  end: Date | null
  logisticsRoute: string | null
  purCodes: string | null,
  paperType: string | null,
}

export interface ReportQureryOutput extends ExamInfoOutput {
  reportUrl: string | null
  resultList: ExamResultOutput[] | null
  trackList: ExamSampleTrackOutput[] | null
}
