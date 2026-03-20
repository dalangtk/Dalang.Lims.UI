import { GetPageInput, ResultBaseOutput, ResultBasePageOutput } from '../basedata/datacontract/base'
import {
  ExamTaskListOutput,
  ExamTaskOutput,
  ExamTaskQueryListInput,
  ExamTaskUpdateInput,
} from '/@/api/lims/shared/datacontract/examtask-datacontract'
import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { GetTaskOutput, HandoverInput, QueryHandoverBatchNoOutput } from './datacontract/handover-datacontract'

export class ExamTaskApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags pretreatment
   * @name handover
   * @summary 获取交接任务
   * @request POST:/api/pretreatment/handover/get-task
   * @secure
   */
  getTask = (data: ExamTaskQueryListInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<GetTaskOutput<ExamTaskOutput[]>>, any>({
      path: `/api/pretreatment/handover/get-task`,
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
   * @tags pretreatment
   * @name handover
   * @summary 交接
   * @request POST:/api/pretreatment/handover/handover
   * @secure
   */
  handover = (data: HandoverInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<boolean>, any>({
      path: `/api/pretreatment/handover/handover`,
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
   * @tags pretreatment
   * @name get-handover-batch-no
   * @summary 获取交接批次
   * @request POST://api/pretreatment/handover/get-handover-batch-no
   * @secure
   */
  getBatchList = (data: ExamTaskQueryListInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<GetTaskOutput<QueryHandoverBatchNoOutput[]>>, any>({
      path: `/api/pretreatment/handover/get-handover-batch-no`,
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
   * @tags pretreatment
   * @name get-task-list-by-batch-no
   * @summary 获取交接批次明细
   * @request GET:/api/pretreatment/handover/get-task-list-by-batch-no
   * @secure
   */
  getDetail = (
    query?: {
      /** @format int64 */
      batchNo?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<ExamTaskOutput[]>, any>({
      path: `/api/pretreatment/handover/get-task-list-by-batch-no`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    })
}
