import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { AxiosResponse } from 'axios'
import {
  QuartzTaskOutput,
  QuartzTaskListOutput,
  QuartzTaskAddInput,
  QuartzTaskUpdateInput,
  QuartzTaskQueryListInput,
  QuartzTaskLogListOutput,
} from './data-contracts'
import { ResultBaseOutput, ResultBasePageOutput, GetPageInput } from '/@/api/lims/basedata/datacontract/base'

export class QuartzTaskApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags admin
   * @name GetList
   * @summary 查询定时任务列表
   * @request POST:/api/admin/quartz-task/get-list
   * @secure
   */
  getList = (data: QuartzTaskQueryListInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<QuartzTaskListOutput[]>, any>({
      path: `/api/admin/quartz-task/get-list`,
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
   * @tags admin
   * @name Get
   * @summary 查询定时任务
   * @request GET:/api/admin/quartz-task/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<QuartzTaskOutput>, any>({
      path: `/api/admin/quartz-task/get`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags admin
   * @name GetAll
   * @summary 查询定时任务所有数据
   * @request GET:/api/admin/quartz-task/get-all
   * @secure
   */
  getAll = () =>
    this.request<ResultBaseOutput<Array<QuartzTaskOutput>>, any>({
      path: `/api/admin/quartz-task/get-all`,
      method: 'GET',
      secure: true,
      format: 'json',
    })
  /**
   * No description
   *
   * @tags admin
   * @name Add
   * @summary 新增定时任务
   * @request POST:/api/admin/quartz-task/add
   * @secure
   */
  add = (data: QuartzTaskAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/admin/quartz-task/add`,
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
   * @tags admin
   * @name Update
   * @summary 修改定时任务
   * @request POST:/api/admin/quartz-task/update
   * @secure
   */
  update = (data: QuartzTaskUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/admin/quartz-task/update`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags admin
   * @name Delete
   * @summary 删除定时任务
   * @request POST:/api/admin/quartz-task/delete
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
      path: `/api/admin/quartz-task/delete`,
      method: 'POST',
      query: query,
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags admin
   * @name Delete
   * @summary 删除定时任务
   * @request DELETE:/api/admin/quartz-task/delete
   * @secure
   */
  start = (data: QuartzTaskListOutput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/admin/quartz-task/start`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags admin
   * @name Delete
   * @summary 暂停定时任务
   * @request POST:/api/admin/quartz-task/pause
   * @secure
   */
  pause = (data: QuartzTaskListOutput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/admin/quartz-task/pause`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags admin
   * @name Run
   * @summary 执行一次定时任务
   * @request POST:/api/admin/quartz-task/run
   * @secure
   */
  run = (data: QuartzTaskListOutput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/admin/quartz-task/run`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags admin
   * @name GetLogPage
   * @summary 查询定时任务日志分页
   * @request POST:/api/admin/quartz-task/get-log-page
   * @secure
   */
  getLogPage = (data: GetPageInput<number>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<QuartzTaskLogListOutput>, any>({
      path: `/api/admin/quartz-task/get-log-page`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
}
