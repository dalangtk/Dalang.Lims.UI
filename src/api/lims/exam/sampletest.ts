import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { AxiosResponse } from 'axios'
import { ExamInfoOutput, ExamInfoAddInput, ExamInfoUpdateInput, ExamListQueryInput } from '../shared/datacontract/examinfo-datacontract'
import { ResultBaseOutput } from '/@/api/lims/basedata/datacontract/base'
import { ExamResultOutput, ExamResultUpdateInput } from '../shared/datacontract/examresult-datacontract'
import {
  AddOrDeletePurposeInput,
  AuditInput,
  AuditResultDto,
  CancelTestInput,
  RefreshItemInfoInput,
  UnAuditInput,
  UpdatePatientInfoInput,
} from './datacontract/sampletest-datacontract'
import { ReportFilesListOutput } from './datacontract/rptfiles-datacontract'

export class SampleTestApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags exam
   * @name getSampleList
   * @summary 获取检验列表
   * @request POST:/api/exam/sample-test/get-sample-list
   * @secure
   */
  getSampleList = (data: ExamListQueryInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<ExamInfoOutput[]>, any>({
      path: `/api/exam/sample-test/get-sample-list`,
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
   * @name getExamInfo
   * @summary 获取检验信息
   * @request GET:/api/exam/sample-test/get-exam-info
   * @secure
   */
  getExamInfo = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<ExamInfoOutput>, any>({
      path: `/api/exam/sample-test/get-exam-info`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags exam
   * @name getResultList
   * @summary 获取检验结果
   * @request GET:/api/exam/sample-test/get-result-list
   * @secure
   */
  getResultList = (
    query?: {
      /** @format int64 */
      examInfoId?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<ExamResultOutput[]>, any>({
      path: `/api/exam/sample-test/get-result-list`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags exam
   * @name saveItemResult
   * @summary 新增检验信息
   * @request POST:/api/exam/sample-test/save-item-result
   * @secure
   */
  saveItemResult = (data: ExamResultUpdateInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<ExamResultOutput>, any>({
      path: `/api/exam/sample-test/save-item-result`,
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
   * @name addExamInfo
   * @summary 新增检验信息
   * @request POST:/api/exam/sample-test/add-exam-info
   * @secure
   */
  addExamInfo = (data: ExamInfoAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/exam/sample-test/add-exam-info`,
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
   * @name updateExamInfo
   * @summary 修改检验信息
   * @request PUT:/api/exam/sample-test/update-exam-info
   * @secure
   */
  updateExamInfo = (data: ExamInfoUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/exam/sample-test/update-exam-info`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags exam
   * @name deleteExamInfo
   * @summary 删除检验信息
   * @request DELETE:/api/exam/sample-test/delete-exam-info
   * @secure
   */
  deleteExamInfo = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<AxiosResponse, any>({
      path: `/api/exam/sample-test/delete-exam-info`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags exam
   * @name refreshItemInfo
   * @summary 刷新项目信息
   * @request POST:/api/exam/sample-test/refresh-item-info
   * @secure
   */
  refreshItemInfo = (data: RefreshItemInfoInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<boolean>, any>({
      path: `/api/exam/sample-test/refresh-item-info`,
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
   * @name audit
   * @summary 审核
   * @request POST:/api/exam/sample-test/audit
   * @secure
   */
  audit = (data: AuditInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<AuditResultDto>, any>({
      path: `/api/exam/sample-test/audit`,
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
   * @tags exam
   * @name AddItem
   * @summary 增项
   * @request POST:/api/exam/sample-test/add-item
   * @secure
   */
  addItem = (data: AddOrDeletePurposeInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<ExamInfoOutput>, any>({
      path: `/api/exam/sample-test/add-item`,
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
   * @name BackItem
   * @summary 退项
   * @request POST:/api/exam/sample-test/back-item
   * @secure
   */
  backItem = (data: AddOrDeletePurposeInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<ExamInfoOutput>, any>({
      path: `/api/exam/sample-test/back-item`,
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
   * @name CancelTest
   * @summary 取消检测
   * @request POST:/api/exam/sample-test/cancel-test
   * @secure
   */
  cancelTest = (data: CancelTestInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<ExamInfoOutput>, any>({
      path: `/api/exam/sample-test/cancel-test`,
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
   * @name CancelTest
   * @summary 取消检测
   * @request POST:/api/exam/sample-test/cancel-test
   * @secure
   */
  rptPreview = (data: any, params: RequestParams = {}) =>
    this.request<any, any>({
      path: `/api/exam/sample-test/rpt-preview`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'blob',
      ...params,
    })
  /**
   * No description
   *
   * @tags exam
   * @name getRptFiles
   * @summary 获取报告文件列表
   * @request GET:/api/exam/sample-test/get-report-files
   * @secure
   */
  getRptFiles = (
    query?: {
      /** @format int64 */
      examInfoId?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<ReportFilesListOutput[]>, any>({
      path: `/api/exam/sample-test/get-report-files`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags exam
   * @name CancelTest
   * @summary 取消检测
   * @request POST:/api/exam/sample-test/cancel-test
   * @secure
   */
  updatePatientInfo = (data: UpdatePatientInfoInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<ExamInfoOutput>, any>({
      path: `/api/exam/sample-test/update-patient-info`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
}
