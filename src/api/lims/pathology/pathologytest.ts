import { UserGetOptionOutput } from '../../admin/data-contracts'
import { AuditInput, AuditResultDto, UnAuditInput } from '../exam/datacontract/sampletest-datacontract'
import { ExamInfoOutput } from '../shared/datacontract/examinfo-datacontract'
import { ExamSpecialResultListOutput, ExamSpecialResultQueryListInput } from '../shared/datacontract/examspecialresult-datacontract'
import { ExamPathologySamplingSpotOutput, ExamPathologySamplingSpotUpdateInput } from './datacontract/exampathologysamplingspot-datacontract'
import { PathologyBackInput, PathologyExamListQueryInput, PathologyReceiveInput, SaveResultInput } from './datacontract/pathologytest-datacontract'
import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { ResultBaseOutput } from '/@/api/lims/basedata/datacontract/base'

export class PathologyTestApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags pathology
   * @name getPathologySampleList
   * @summary 获取病理检验样本列表
   * @request POST:/api/pathology/get-pathology-sample-list
   * @secure
   */
  getPathologySampleList = (data: PathologyExamListQueryInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<ExamInfoOutput[]>, any>({
      path: `/api/pathology/pathology-test/get-pathology-sample-list`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags pathology
   * @name pathologyReceive
   * @summary 接收病理检验样本
   * @request POST:/api/pathology/pathology-receive
   * @secure
   */
  pathologyReceive = (data: PathologyReceiveInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<ExamInfoOutput>, any>({
      path: `/api/pathology/pathology-test/pathology-receive`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags pathology
   * @name pathologyReceive
   * @summary 删除病理检验样本
   * @request POST:/api/pathology/pathology-back
   * @secure
   */
  pathologyBack = (data: PathologyBackInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number[]>, any>({
      path: `/api/pathology/pathology-test/pathology-back`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags pathology
   * @name getSpecialResultList
   * @summary 获取特检结果列表
   * @request POST:/api/pathology/get-special-result-list
   * @secure
   */
  getSpecialResultList = (data: ExamSpecialResultQueryListInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<ExamSpecialResultListOutput[]>, any>({
      path: `/api/pathology/pathology-test/get-special-result-list`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags pathology
   * @name saveResult
   * @summary 保存结果
   * @request POST:/api/pathology/save-result
   * @secure
   */
  saveResult = (data: SaveResultInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<boolean>, any>({
      path: `/api/pathology/pathology-test/save-result`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags pathology
   * @name pathologyAudit
   * @summary 病理审核
   * @request POST:/api/pathology/pathology-test/pathology-audit
   * @secure
   */
  pathologyAudit = (data: AuditInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<AuditResultDto>, any>({
      path: `/api/pathology/pathology-test/pathology-audit`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags exam
   * @name unAudit
   * @summary 反审核
   * @request POST:/api/exam/sample-test/audit
   * @secure
   */
  unAudit = (data: UnAuditInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<ExamInfoOutput>, any>({
      path: `/api/exam/sample-test/un-audit`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags pathology
   * @name getPathologySecondAuditUsers
   * @summary 获取病理复诊医生
   * @request GET:/api/pathology/pathology-test/get-pathology-second-audit-users
   * @secure
   */
  getPathologySecondAuditUsers = (
    query?: {
      /** @format string */
      wfCode?: string
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<Array<UserGetOptionOutput>>, any>({
      path: `/api/pathology/pathology-test/get-pathology-second-audit-users`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags pathology
   * @name saveSamplingSpotDetail
   * @summary 保存取材部位明细
   * @request POST:/api/pathology/pathology-test/save-sampling-spot-detail
   * @secure
   */
  saveSamplingSpotDetail = (data: ExamPathologySamplingSpotUpdateInput[], params: RequestParams = {}) =>
    this.request<ResultBaseOutput<boolean>, any>({
      path: `/api/pathology/pathology-test/save-sampling-spot-detail`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags pathology
   * @name getSamplingSpotDetail
   * @summary 获取取材部位明细
   * @request GET:/api/pathology/pathology-test/get-sampling-spot-detail
   * @secure
   */
  getSamplingSpotDetail = (
    query?: {
      examInfoId?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<Array<ExamPathologySamplingSpotOutput>>, any>({
      path: `/api/pathology/pathology-test/get-sampling-spot-detail`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    })
}
