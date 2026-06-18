import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { AxiosResponse } from 'axios'
import {
  BasePathologyTemplateOutput,
  BasePathologyTemplateListOutput,
  BasePathologyTemplateAddInput,
  BasePathologyTemplateUpdateInput,
  BasePathologyTemplateQueryListInput,
  GrossExaminationTemplateQueryInput,
  GrossExaminationTemplateOutput,
} from './datacontract/pathologytemplate-datacontract'
import { ResultBaseOutput, ResultBasePageOutput, GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import { LabelValueOutput } from '../../admin/data-contracts'

export class BasePathologyTemplateApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags pathology
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/pathology/base-pathology-template/get-page
   * @secure
   */
  getPage = (data: GetPageInput<BasePathologyTemplateQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<BasePathologyTemplateListOutput>, any>({
      path: `/api/pathology/base-pathology-template/get-page`,
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
   * @name Get
   * @summary 查询诊断模板
   * @request GET:/api/pathology/base-pathology-template/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<BasePathologyTemplateOutput>, any>({
      path: `/api/pathology/base-pathology-template/get`,
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
   * @name GetListByWfCode
   * @summary 查询工作流下的诊断模板列表
   * @request GET:/api/pathology/base-pathology-template/get-list-by-wf-code
   * @secure
   */
  getListByWfCode = (
    query?: {
      /** @format string */
      wfCode?: string
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<Array<BasePathologyTemplateOutput>>, any>({
      path: `/api/pathology/base-pathology-template/get-list-by-wf-code`,
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
   * @name Add
   * @summary 新增诊断模板
   * @request POST:/api/pathology/base-pathology-template/add
   * @secure
   */
  add = (data: BasePathologyTemplateAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/pathology/base-pathology-template/add`,
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
   * @name Update
   * @summary 修改诊断模板
   * @request PUT:/api/pathology/base-pathology-template/update
   * @secure
   */
  update = (data: BasePathologyTemplateUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/pathology/base-pathology-template/update`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags pathology
   * @name Delete
   * @summary 删除诊断模板
   * @request DELETE:/api/pathology/base-pathology-template/delete
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
      path: `/api/pathology/base-pathology-template/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags pathology
   * @name GetPathologyTemplateList
   * @summary 获取诊断模板列表
   * @request POST:/api/pathology/base-pathology-template/get-pathology-template-list
   * @secure
   */
  getPathologyTemplateList = (data: string[], params: RequestParams = {}) =>
    this.request<ResultBaseOutput<LabelValueOutput[]>, any>({
      path: `/api/pathology/base-pathology-template/get-pathology-template-list`,
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
   * @name GetGrossExaminationTemplate
   * @summary 获取巨检模板
   * @request POST:/api/pathology/base-pathology-template/get-gross-examination-template
   * @secure
   */
  getGrossExaminationTemplate = (data: GrossExaminationTemplateQueryInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<GrossExaminationTemplateOutput[]>, any>({
      path: `/api/pathology/base-pathology-template/get-gross-examination-template`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
}
