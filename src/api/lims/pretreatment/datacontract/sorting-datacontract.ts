import { ApplyInfoOutput } from '../../shared/datacontract/applyinfo-datacontract'
import { ApplyPurposeOutput } from '../../shared/datacontract/applypurpose-datacontract'
import { ExamTaskOutput } from '../../shared/datacontract/examtask-datacontract'
import { CodeTypeEnum } from '../../shared/enums/codetypeenum'
import { CodeNameOutput } from '/@/api/admin/data-contracts'

export interface StartSortingInput {
  sorterCode: string
}

export interface SortingInput {
  sortInfoCode: string
  barcode: string
  sampletypeCode?: string | null
  barcodeType?: CodeTypeEnum | null
}

export interface SortingOutput {
  barcode?: string | null
  /**
   * 1选择目的检测计划 2选择目的标本类型  3选择分拣标本类型  4分血  5分拣成功
   */
  status: SortingStatusEnum
  sampleTypeList?: CodeNameOutput[] | null
  shelfName?: string | null
  holePosition?: number | null
  selectPurSampleTypeList?: SelectPurSampleTypeDto[] | null
  applyPurposeList?: ApplyPurposeOutput[] | null
  applyInfo?: ApplyInfoOutput | null
  examTaskList?: ExamTaskOutput[] | null
  message?: string | null
}

export interface SelectPurSampleTypeDto {
  purpose: ApplyPurposeOutput
  sampleTypeList?: CodeNameOutput[] | null
}
/**
 * 1选择目的检测计划 2选择目的标本类型  3选择要分拣的标本类型  4分血  5分拣成功
 */
export enum SortingStatusEnum {
  /**
   * 1选择目的检测计划
   */
  SettingExamPlan = 1,
  /**
   * 2选择目的标本类型
   */
  SelectPurposeSampleType = 2,
  /**
   * 3选择要分拣的标本类型
   */
  SelectSortSampleType = 3,
  /**
   * 4分血
   */
  SplitBlood = 4,
  /**
   * 5分拣成功
   */
  SortSuccess = 5,
  /**
   * 6分拣失败
   */
  SortFailed = 6,
}
