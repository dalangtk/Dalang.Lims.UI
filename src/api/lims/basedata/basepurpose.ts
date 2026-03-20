import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { AxiosResponse } from 'axios'
import {
  BasePurposeOutput,
  BasePurposeListOutput,
  BasePurposeAddInput,
  BasePurposeUpdateInput,
  BasePurposeQueryListInput,
  BasePurposeDetailOutput,
  BasePurposeDetailListOutput,
  BasePurposeDetailAddInput,
  BasePurposeDetailUpdateInput,
  BasePurposeDetailQueryListInput,
  PurposeDetailInput,
  BasePurposePersonalizeOutput,
  BasePurposePersonalizeListOutput,
  BasePurposePersonalizeAddInput,
  BasePurposePersonalizeUpdateInput,
  PurposeAndComboQueryInput,
  PurposeAndComboOutput,
  PurposeWithTenantSettingOutput,
} from './datacontract/purpose-datacontract'
import { ResultBaseOutput, ResultBasePageOutput, GetPageInput } from './datacontract/base'

export class BasePurposeApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags lims
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/lims/base-purpose/get-page
   * @secure
   */
  getPage = (data: GetPageInput<BasePurposeQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<BasePurposeListOutput>, any>({
      path: `/api/lims/base-purpose/get-page`,
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
   * @name getPageWithPersonalizeName
   * @summary 查询分页
   * @request POST:/api/lims/base-purpose/get-page-with-personalize-name
   * @secure
   */
  getPageWithPersonalizeName = (data: GetPageInput<BasePurposeQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<BasePurposeListOutput>, any>({
      path: `/api/lims/base-purpose/get-page-with-personalize-name`,
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
   * @name getPurposeWithPersonalizeName
   * @summary 获取目的明细(已取个性化配置)
   * @request POST:/api/lims/base-purpose/get-purpose-with-personalize
   * @secure
   */
  getPurposeWithPersonalizeName = (
    query?: {
      purCodes: string[]
      customerCode?: string
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<BasePurposeListOutput[]>, any>({
      path: `/api/lims/base-purpose/get-purpose-with-personalize`,
      method: 'GET',
      query: query,
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
   * @summary 查询检验目的
   * @request GET:/api/lims/base-purpose/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<BasePurposeOutput>, any>({
      path: `/api/lims/base-purpose/get`,
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
   * @summary 获取目的及机构设置
   * @request GET:/api/lims/base-purpose/get-purpose-with-tenant-setting
   * @secure
   */
  getPurposeWithTenantSetting = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<PurposeWithTenantSettingOutput>, any>({
      path: `/api/lims/base-purpose/get-purpose-with-tenant-setting`,
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
   * @name getPurposeDetail
   * @summary 查询目的明细
   * @request POST:/api/lims/base-purpose-detail/get-purpose-detail
   * @secure
   */
  getPurposeDetail = (data: BasePurposeQueryListInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<Array<BasePurposeDetailListOutput>>, any>({
      path: `/api/lims/base-purpose-detail/get-purpose-detail`,
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
   * @summary 查询检验目的所有数据
   * @request GET:/api/lims/base-purpose/getAll
   * @secure
   */
  getAll = () =>
    this.request<ResultBaseOutput<Array<BasePurposeOutput>>, any>({
      path: `/api/lims/base-purpose/get-all`,
      method: 'GET',
      secure: true,
      format: 'json',
    })
  /**
   * No description
   *
   * @tags lims
   * @name Add
   * @summary 新增检验目的
   * @request POST:/api/lims/base-purpose/add
   * @secure
   */
  add = (data: PurposeDetailInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/lims/base-purpose/add`,
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
   * @summary 修改检验目的
   * @request PUT:/api/lims/base-purpose/update
   * @secure
   */
  update = (data: PurposeDetailInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/lims/base-purpose/update`,
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
   * @summary 生成检验目的
   * @request DELETE:/api/lims/base-purpose/delete
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
      path: `/api/lims/base-purpose/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags lims
   * @name getPurposeAndCombo
   * @summary 获取目的和套餐
   * @request POST:/api/lims/base-purpose/get-purpose-and-combo-list
   * @secure
   */
  getPurposeAndCombo = (data: PurposeAndComboQueryInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<PurposeAndComboOutput[]>, any>({
      path: `/api/lims/base-purpose/get-purpose-and-combo-list`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
}

export class BasePurposeDetailApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags lims
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/lims/base-purpose-detail/get-page
   * @secure
   */
  getPage = (data: GetPageInput<BasePurposeDetailQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<BasePurposeDetailListOutput>, any>({
      path: `/api/lims/base-purpose-detail/get-page`,
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
   * @summary 查询目的明细
   * @request GET:/api/lims/base-purpose-detail/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<BasePurposeDetailOutput>, any>({
      path: `/api/lims/base-purpose-detail/get`,
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
   * @summary 查询目的明细所有数据
   * @request GET:/api/lims/base-purpose-detail/getAll
   * @secure
   */
  getAll = () =>
    this.request<ResultBaseOutput<Array<BasePurposeDetailOutput>>, any>({
      path: `/api/lims/base-purpose-detail/get-all`,
      method: 'GET',
      secure: true,
      format: 'json',
    })
  /**
   * No description
   *
   * @tags lims
   * @name Add
   * @summary 新增目的明细
   * @request POST:/api/lims/base-purpose-detail/add
   * @secure
   */
  add = (data: BasePurposeDetailAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/lims/base-purpose-detail/add`,
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
   * @summary 修改目的明细
   * @request PUT:/api/lims/base-purpose-detail/update
   * @secure
   */
  update = (data: BasePurposeDetailUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/lims/base-purpose-detail/update`,
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
   * @summary 生成目的明细
   * @request DELETE:/api/lims/base-purpose-detail/delete
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
      path: `/api/lims/base-purpose-detail/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags lims
   * @name deleteByInstrumentItemCode
   * @summary 根据上机项目代码和目的代码删除目的明细
   * @request DELETE:/api/lims/base-purpose-detail/delete-by-instrument-item-code
   * @secure
   */
  deleteByInstrumentItemCode = (
    query?: {
      /** @format string */
      purCode: string
      /** @format string */
      instrumentItemCode: string
    },
    params: RequestParams = {}
  ) =>
    this.request<AxiosResponse, any>({
      path: `/api/lims/base-purpose-detail/delete-by-instrument-item-code`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
}

export class BasePurposePersonalizeApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags lims
   * @name Get
   * @summary 查询目的定制
   * @request GET:/api/lims/base-purpose-personalize/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<BasePurposePersonalizeOutput>, any>({
      path: `/api/lims/base-purpose-personalize/get`,
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
   * @summary 根据目的代码查询定制
   * @request GET:/api/lims/base-purpose-personalize/get-purpose-personalize-list
   * @secure
   */
  getPurposePersonalizeList = (
    query?: {
      /** @format string */
      purcode?: string
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<BasePurposePersonalizeOutput[]>, any>({
      path: `/api/lims/base-purpose-personalize/get-purpose-personalize-list`,
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
   * @summary 新增目的定制
   * @request POST:/api/lims/base-purpose-personalize/add
   * @secure
   */
  add = (data: BasePurposePersonalizeAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/lims/base-purpose-personalize/add`,
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
   * @summary 修改目的定制
   * @request PUT:/api/lims/base-purpose-personalize/update
   * @secure
   */
  update = (data: BasePurposePersonalizeUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/lims/base-purpose-personalize/update`,
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
   * @summary 生成目的定制
   * @request DELETE:/api/lims/base-purpose-personalize/delete
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
      path: `/api/lims/base-purpose-personalize/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
}
