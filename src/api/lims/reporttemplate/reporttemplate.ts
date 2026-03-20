import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { AxiosResponse } from 'axios'
import {
  ReportTemplateOutput,
  ReportTemplateListOutput,
  ReportTemplateAddInput,
  ReportTemplateUpdateInput,
  ReportTemplateQueryListInput,
} from './datacontract/reporttemplate-datacontract'
import { ResultBaseOutput, ResultBasePageOutput, GetPageInput } from '/@/api/lims/basedata/datacontract/base'

export class ReportTemplateApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags lims
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/lims/report-template/get-page
   * @secure
   */
  getPage = (data: GetPageInput<ReportTemplateQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<ReportTemplateListOutput>, any>({
      path: `/api/template/report-template/get-page`,
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
   * @summary 查询模板
   * @request GET:/api/lims/report-template/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<ReportTemplateOutput>, any>({
      path: `/api/template/report-template/get`,
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
   * @name Get
   * @summary 查询模板
   * @request GET:/api/lims/report-template/get
   * @secure
   */
  getByCode = (
    query?: {
      templateCode?: string
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<ReportTemplateOutput>, any>({
      path: `/api/template/report-template/get-by-code`,
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
   * @summary 新增模板
   * @request POST:/api/lims/report-template/add
   * @secure
   */
  add = (data: ReportTemplateAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/template/report-template/add`,
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
   * @summary 修改模板
   * @request PUT:/api/lims/report-template/update
   * @secure
   */
  update = (data: ReportTemplateUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/template/report-template/update`,
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
   * @summary 删除模板
   * @request DELETE:/api/lims/report-template/delete
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
      path: `/api/template/report-template/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags lims
   * @name Get
   * @summary 查询模板
   * @request GET:/api/lims/report-template/get
   * @secure
   */
  getReportData = (
    query?: {
      sourceName?: string
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<any>, any>({
      path: `/api/template/report-template/get-report-data`,
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
   * @name Update
   * @summary 修改模板
   * @request PUT:/api/lims/report-template/update
   * @secure
   */
  updateContent = (data: any, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/template/report-template/update-content`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
}
