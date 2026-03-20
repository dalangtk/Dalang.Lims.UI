import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { AxiosResponse } from 'axios'
import {
  BaseComboOutput,
  BaseComboListOutput,
  ComboAddOrUpdateInput,
  BaseComboQueryInput,
  BaseComboDetailOutput,
  BaseComboWithPurcodesDto,
} from './datacontract/combo-datacontract'
import { ResultBaseOutput, ResultBasePageOutput, GetPageInput } from '/@/api/lims/basedata/datacontract/base'

export class BaseComboApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags lims
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/lims/base-combo/get-page
   * @secure
   */
  getPage = (data: GetPageInput<BaseComboQueryInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<BaseComboListOutput>, any>({
      path: `/api/lims/base-combo/get-page`,
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
   * @summary 查询套餐管理
   * @request GET:/api/lims/base-combo/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<BaseComboOutput>, any>({
      path: `/api/lims/base-combo/get`,
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
   * @summary 查询套餐管理所有数据
   * @request GET:/api/lims/base-combo/getAll
   * @secure
   */
  getAll = () =>
    this.request<ResultBaseOutput<Array<BaseComboOutput>>, any>({
      path: `/api/lims/base-combo/get-all`,
      method: 'GET',
      secure: true,
      format: 'json',
    })
  /**
   * No description
   *
   * @tags lims
   * @name Add
   * @summary 新增套餐管理
   * @request POST:/api/lims/base-combo/add
   * @secure
   */
  add = (data: ComboAddOrUpdateInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/lims/base-combo/add`,
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
   * @summary 修改套餐管理
   * @request PUT:/api/lims/base-combo/update
   * @secure
   */
  update = (data: ComboAddOrUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/lims/base-combo/update`,
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
   * @summary 删除套餐管理
   * @request DELETE:/api/lims/base-combo/delete
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
      path: `/api/lims/base-combo/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags lims
   * @name GetComboDetail
   * @summary 获取套餐明细
   * @request GET:/api/lims/base-combo/get-combo-detail
   * @secure
   */
  getComboDetail = (
    query?: {
      comboCode?: string
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<BaseComboDetailOutput[]>, any>({
      path: `/api/lims/base-combo/get-combo-detail`,
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
   * @name GetComboWithPurcodes
   * @summary 获取套餐及对应的目的代码
   * @request POST:/api/lims/base-combo/get-combo-with-purcodes-list
   * @secure
   */
  getComboWithPurcodes = (data: BaseComboQueryInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<BaseComboWithPurcodesDto[]>, any>({
      path: `/api/lims/base-combo/get-combo-with-purcodes-list`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
}
