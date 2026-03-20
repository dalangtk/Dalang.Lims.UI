import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { AxiosResponse } from 'axios'
import {
  BaseTenantReportExtendOutput,
  BaseTenantReportExtendListOutput,
  BaseTenantReportExtendAddInput,
  BaseTenantReportExtendUpdateInput,
  BaseTenantReportExtendQueryListInput,
} from './datacontract/tenantreportextend-datacontract'
import { ResultBaseOutput, ResultBasePageOutput, GetPageInput } from '/@/api/lims/basedata/datacontract/base'

export class BaseTenantReportExtendApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags lims
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/lims/base-tenant-report-extend/get-page
   * @secure
   */
  getPage = (data: GetPageInput<BaseTenantReportExtendQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<BaseTenantReportExtendListOutput>, any>({
      path: `/api/lims/base-tenant-report-extend/get-page`,
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
   * @summary 查询机构设置
   * @request GET:/api/lims/base-tenant-report-extend/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<BaseTenantReportExtendOutput>, any>({
      path: `/api/lims/base-tenant-report-extend/get`,
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
   * @summary 查询机构设置所有数据
   * @request GET:/api/lims/base-tenant-report-extend/getAll
   * @secure
   */
  getAll = () =>
    this.request<ResultBaseOutput<Array<BaseTenantReportExtendOutput>>, any>({
      path: `/api/lims/base-tenant-report-extend/get-all`,
      method: 'GET',
      secure: true,
      format: 'json',
    })
  /**
   * No description
   *
   * @tags lims
   * @name Add
   * @summary 新增机构设置
   * @request POST:/api/lims/base-tenant-report-extend/add
   * @secure
   */
  add = (data: BaseTenantReportExtendAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/lims/base-tenant-report-extend/add`,
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
   * @summary 修改机构设置
   * @request PUT:/api/lims/base-tenant-report-extend/update
   * @secure
   */
  update = (data: BaseTenantReportExtendUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/lims/base-tenant-report-extend/update`,
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
   * @summary 删除机构设置
   * @request DELETE:/api/lims/base-tenant-report-extend/delete
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
      path: `/api/lims/base-tenant-report-extend/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
}
