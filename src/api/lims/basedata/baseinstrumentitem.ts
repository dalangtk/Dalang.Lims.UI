import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { AxiosResponse } from 'axios'
import {
  BaseInstrumentItemOutput,
  BaseInstrumentItemListOutput,
  BaseInstrumentItemAddInput,
  BaseInstrumentItemUpdateInput,
  BaseInstrumentItemQueryListInput,
} from './datacontract/instrumentitem-datacontract'

import {
  BaseInstrumentItemDetailOutput,
  BaseInstrumentItemDetailListOutput,
  BaseInstrumentItemDetailAddInput,
  BaseInstrumentItemDetailUpdateInput,
  BaseInstrumentItemDetailQueryListInput,
} from './datacontract/instrumentitem-datacontract'

import { ResultBaseOutput, ResultBasePageOutput, GetPageInput } from './datacontract/base'

export class BaseInstrumentItemApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags lims
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/lims/base-instrument-item/get-page
   * @secure
   */
  getPage = (data: GetPageInput<BaseInstrumentItemQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<BaseInstrumentItemListOutput>, any>({
      path: `/api/lims/base-instrument-item/get-page`,
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
   * @summary 查询上机项目
   * @request GET:/api/lims/base-instrument-item/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<BaseInstrumentItemOutput>, any>({
      path: `/api/lims/base-instrument-item/get`,
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
   * @name GetByCodeList
   * @summary 根据上机项目代码查询
   * @request POST:/api/lims/base-instrument-item/get-by-code
   * @secure
   */
  getByCodeList = (data: string[], params: RequestParams = {}) =>
    this.request<ResultBaseOutput<BaseInstrumentItemOutput[]>, any>({
      path: `/api/lims/base-instrument-item/get-by-code`,
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
   * @name GetAll
   * @summary 查询上机项目所有数据
   * @request GET:/api/lims/base-instrument-item/getAll
   * @secure
   */
  getAll = () =>
    this.request<ResultBaseOutput<Array<BaseInstrumentItemOutput>>, any>({
      path: `/api/lims/base-instrument-item/get-all`,
      method: 'GET',
      secure: true,
      format: 'json',
    })
  /**
   * No description
   *
   * @tags lims
   * @name Add
   * @summary 新增上机项目
   * @request POST:/api/lims/base-instrument-item/add
   * @secure
   */
  add = (data: BaseInstrumentItemAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/lims/base-instrument-item/add`,
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
   * @summary 修改上机项目
   * @request PUT:/api/lims/base-instrument-item/update
   * @secure
   */
  update = (data: BaseInstrumentItemUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/lims/base-instrument-item/update`,
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
   * @summary 生成上机项目
   * @request DELETE:/api/lims/base-instrument-item/delete
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
      path: `/api/lims/base-instrument-item/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
}

export class BaseInstrumentItemDetailApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags lims
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/lims/base-instrument-item-detail/get-page
   * @secure
   */
  getPage = (data: GetPageInput<BaseInstrumentItemDetailQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<BaseInstrumentItemDetailListOutput>, any>({
      path: `/api/lims/base-instrument-item-detail/get-page`,
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
   * @summary 查询上机项目
   * @request GET:/api/lims/base-instrument-item-detail/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<BaseInstrumentItemDetailOutput>, any>({
      path: `/api/lims/base-instrument-item-detail/get`,
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
   * @summary 根据上机项目代码查询上机项目明细
   * @request GET:/api/lims/base-instrument-item-detail/get-list-by-instrument-item-code
   * @secure
   */
  getListByInstrumentItemCode = (data: string[], params: RequestParams = {}) =>
    this.request<ResultBaseOutput<BaseInstrumentItemDetailOutput[]>, any>({
      path: `/api/lims/base-instrument-item-detail/get-list-by-instrument-item-code`,
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
   * @name GetAll
   * @summary 查询上机项目明细所有数据
   * @request GET:/api/lims/base-instrument-item-detail/getAll
   * @secure
   */
  getAll = () =>
    this.request<ResultBaseOutput<Array<BaseInstrumentItemDetailOutput>>, any>({
      path: `/api/lims/base-instrument-item-detail/get-all`,
      method: 'GET',
      secure: true,
      format: 'json',
    })
  /**
   * No description
   *
   * @tags lims
   * @name Add
   * @summary 新增上机项目明细
   * @request POST:/api/lims/base-instrument-item-detail/add
   * @secure
   */
  add = (data: BaseInstrumentItemDetailAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/lims/base-instrument-item-detail/add`,
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
   * @name addList
   * @summary 新增上机项目明细列表
   * @request POST:/api/lims/base-instrument-item-detail/add-list
   * @secure
   */
  addList = (data: BaseInstrumentItemDetailAddInput[], params: RequestParams = {}) =>
    this.request<ResultBaseOutput<boolean>, any>({
      path: `/api/lims/base-instrument-item-detail/add-list`,
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
   * @summary 修改上机项目明细
   * @request PUT:/api/lims/base-instrument-item-detail/update
   * @secure
   */
  update = (data: BaseInstrumentItemDetailUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/lims/base-instrument-item-detail/update`,
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
   * @summary 生成上机项目明细
   * @request DELETE:/api/lims/base-instrument-item-detail/delete
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
      path: `/api/lims/base-instrument-item-detail/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
}
