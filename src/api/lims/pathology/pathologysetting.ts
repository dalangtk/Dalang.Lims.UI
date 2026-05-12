import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { AxiosResponse } from 'axios'
import {
  BasePathologySettingOutput,
  BasePathologySettingListOutput,
  BasePathologySettingAddInput,
  BasePathologySettingUpdateInput,
  BasePathologySettingQueryListInput,
} from './datacontract/pathologysetting-datacontract'
import { ResultBaseOutput, ResultBasePageOutput, GetPageInput } from '/@/api/lims/basedata/datacontract/base'

export class BasePathologySettingApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Pathology
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/pathology/base-pathology-setting/get-page
   * @secure
   */
  getPage = (data: GetPageInput<BasePathologySettingQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<BasePathologySettingListOutput>, any>({
      path: `/api/pathology/base-pathology-setting/get-page`,
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
   * @tags Pathology
   * @name Get
   * @summary 查询病理配置
   * @request GET:/api/pathology/base-pathology-setting/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<BasePathologySettingOutput>, any>({
      path: `/api/pathology/base-pathology-setting/get`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags Pathology
   * @name GetAll
   * @summary 查询病理配置所有数据
   * @request GET:/api/pathology/base-pathology-setting/getAll
   * @secure
   */
  getAll = () =>
    this.request<ResultBaseOutput<Array<BasePathologySettingOutput>>, any>({
      path: `/api/pathology/base-pathology-setting/get-all`,
      method: 'GET',
      secure: true,
      format: 'json',
    })
  /**
   * No description
   *
   * @tags Pathology
   * @name Add
   * @summary 新增病理配置
   * @request POST:/pathology/lims/base-pathology-setting/add
   * @secure
   */
  add = (data: BasePathologySettingAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/pathology/base-pathology-setting/add`,
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
   * @tags Pathology
   * @name Update
   * @summary 修改病理配置
   * @request PUT:/api/pathology/base-pathology-setting/update
   * @secure
   */
  update = (data: BasePathologySettingUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/pathology/base-pathology-setting/update`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags Pathology
   * @name Delete
   * @summary 删除病理配置
   * @request DELETE:/api/pathology/base-pathology-setting/delete
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
      path: `/api/pathology/base-pathology-setting/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags Pathology
   * @name Get
   * @summary 查询病理配置
   * @request GET:/api/pathology/base-pathology-setting/get-setting-by-wf-code
   * @secure
   */
  getSettingByWfCode = (
    query?: {
      /** @format string */
      wfCode?: string
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<BasePathologySettingOutput>, any>({
      path: `/api/pathology/base-pathology-setting/get-setting-by-wf-code`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    })
}
