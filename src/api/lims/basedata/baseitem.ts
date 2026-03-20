import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { AxiosResponse } from 'axios'
import {
  BaseItemOutput,
  BaseItemListOutput,
  BaseItemAddInput,
  BaseItemUpdateInput,
  BaseItemQueryListInput,
  ItemWithPersonalAddInput,
  ItemWithPersonalUpdateInput,
  ItemWithPersonalOutput,
} from './datacontract/item-datacontract'
import { ResultBaseOutput, ResultBasePageOutput, GetPageInput } from './datacontract/base'

export class BaseItemApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags baseItem
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/lims/base-item/get-page
   * @secure
   */
  getPage = (data: GetPageInput<BaseItemQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<BaseItemListOutput>, any>({
      path: `/api/lims/base-item/get-page`,
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
   * @tags baseItem
   * @name Get
   * @summary 查询组别
   * @request GET:/api/lims/base-item/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<ItemWithPersonalOutput>, any>({
      path: `/api/lims/base-item/get`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags baseItem
   * @name GetAll
   * @summary 查询组别所有数据
   * @request GET:/api/lims/base-item/getAll
   * @secure
   */
  getAll = () =>
    this.request<ResultBaseOutput<BaseItemOutput>, any>({
      path: `/api/lims/base-item/getAll`,
      method: 'GET',
      secure: true,
      format: 'json',
    })
  /**
   * No description
   *
   * @tags baseItem
   * @name Add
   * @summary 新增组别
   * @request POST:/api/lims/base-item/add
   * @secure
   */
  add = (data: ItemWithPersonalAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/lims/base-item/add`,
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
   * @tags baseItem
   * @name Update
   * @summary 修改组别
   * @request PUT:/api/lims/base-item/update
   * @secure
   */
  update = (data: ItemWithPersonalUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/lims/base-item/update`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags baseItem
   * @name Get
   * @summary 查询组别
   * @request GET:/api/lims/base-item/get
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
      path: `/api/lims/base-item/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
}
