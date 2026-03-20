import { TestRuleDto } from '../../basedata/datacontract/auditrule-datacontract'
import { ExamInfoOutput, ExamInfoUpdateInput } from '../../shared/datacontract/examinfo-datacontract'
import { ExecuteTypeEnum, OperationTypeEnum } from '../../shared/enums/operationtypeenum'

/**
 * 审核输入
 */
export interface AuditInput {
  examInfoId: number
  teacherId?: number | null
  teacherName?: string | null
  auditType: OperationTypeEnum
  executeType: ExecuteTypeEnum
  ignoreAuditRuleCodes?: string[] | null
}

export interface AuditResultDto {
  examInfo: ExamInfoOutput
  triggerRules: TestRuleDto[]
}

/**
 * 反审核输入
 */
export interface UnAuditInput {
  examInfoId: number
  reasonCode?: string | null
  reasonContent?: string | null
  executeType: ExecuteTypeEnum
}
/**
 * 刷新项目信息入参
 */

export interface RefreshItemInfoInput {
  examInfoId: number
  isForce: number
}

/**
 * 添加或删除项目入参
 */
export interface AddOrDeletePurposeInput {
  examInfoId: number
  purCodes?: string[] | null
  comboCodes?: string[] | null
}

/**
 * 取消检验输入
 */
export interface CancelTestInput extends UnAuditInput {}

/**
 * 更新患者信息输入
 */
export interface UpdatePatientInfoInput {
  examInfo: ExamInfoUpdateInput
  updateFields: string[]
}
