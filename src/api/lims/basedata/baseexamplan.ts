import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { AxiosResponse } from 'axios'
import {
  BaseExamPlanOutput,
  BaseExamPlanListOutput,
  BaseExamPlanAddInput,
  BaseExamPlanUpdateInput,
  BaseExamPlanQueryListInput,
  BaseExamPlanDetailOutput,
  BaseExamPlanDetailListOutput,
  BaseExamPlanDetailAddInput,
  BaseExamPlanDetailUpdateInput,
} from './datacontract/examplan-datacontract'
import { ResultBaseOutput, ResultBasePageOutput, GetPageInput } from './datacontract/base'

export class BaseExamPlanApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags lims
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/lims/base-exam-plan/get-page
   * @secure
   */
  getPage = (data: GetPageInput<BaseExamPlanQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<BaseExamPlanListOutput>, any>({
      path: `/api/lims/base-exam-plan/get-page`,
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
   * @tags lims
   * @name Get
   * @summary 查询检测计划
   * @request GET:/api/lims/base-exam-plan/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<BaseExamPlanOutput>, any>({
      path: `/api/lims/base-exam-plan/get`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags lims
   * @name GetAll
   * @summary 查询检测计划所有数据
   * @request GET:/api/lims/base-exam-plan/getAll
   * @secure
   */
  getAll = () =>
    this.request<ResultBaseOutput<Array<BaseExamPlanOutput>>, any>({
      path: `/api/lims/base-exam-plan/get-all`,
      method: 'GET',
      secure: true,
      format: 'json',
    })
  /**
   * No description
   *
   * @tags lims
   * @name Add
   * @summary 新增检测计划
   * @request POST:/api/lims/base-exam-plan/add
   * @secure
   */
  add = (data: BaseExamPlanAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/lims/base-exam-plan/add`,
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
   * @tags lims
   * @name Update
   * @summary 修改检测计划
   * @request PUT:/api/lims/base-exam-plan/update
   * @secure
   */
  update = (data: BaseExamPlanUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/lims/base-exam-plan/update`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags lims
   * @name Delete
   * @summary 生成检测计划
   * @request DELETE:/api/lims/base-exam-plan/delete
   * @secure
   */
  delete = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<AxiosResponse, any>({
      path: `/api/lims/base-exam-plan/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
}

export class BaseExamPlanDetailApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags lims
   * @name Get
   * @summary 查询检测计划明细
   * @request GET:/api/lims/base-exam-plan-detail/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<BaseExamPlanDetailOutput>, any>({
      path: `/api/lims/base-exam-plan-detail/get`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags lims
   * @name GetAll
   * @summary 查询检测计划明细所有数据
   * @request GET:/api/lims/base-exam-plan-detail/getAll
   * @secure
   */
  getAll = (
    query?: {
      /** @format String */
      examPlanCode?: string | null
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<Array<BaseExamPlanDetailOutput>>, any>({
      path: `/api/lims/base-exam-plan-detail/get-all`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags lims
   * @name Add
   * @summary 新增检测计划明细
   * @request POST:/api/lims/base-exam-plan-detail/add
   * @secure
   */
  add = (data: BaseExamPlanDetailAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/lims/base-exam-plan-detail/add`,
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
   * @tags lims
   * @name Update
   * @summary 修改检测计划明细
   * @request PUT:/api/lims/base-exam-plan-detail/update
   * @secure
   */
  update = (data: BaseExamPlanDetailUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/lims/base-exam-plan-detail/update`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags lims
   * @name Delete
   * @summary 生成检测计划明细
   * @request DELETE:/api/lims/base-exam-plan-detail/delete
   * @secure
   */
  delete = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<AxiosResponse, any>({
      path: `/api/lims/base-exam-plan-detail/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
}
