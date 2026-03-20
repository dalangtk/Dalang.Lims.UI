import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { AxiosResponse } from 'axios'
import {
  PretreatDataImportConfigOutput,
  PretreatDataImportConfigListOutput,
  PretreatDataImportConfigAddInput,
  PretreatDataImportConfigUpdateInput,
  PretreatDataImportConfigQueryListInput,
} from './datacontract/dataimportconfig-datacontract'
import { ResultBaseOutput, ResultBasePageOutput, GetPageInput } from '/@/api/lims/basedata/datacontract/base'

export class PretreatDataImportConfigApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags pretreatment
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/pretreatment/pretreat-data-import-config/get-page
   * @secure
   */
  getPage = (data: GetPageInput<PretreatDataImportConfigQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<PretreatDataImportConfigListOutput>, any>({
      path: `/api/pretreatment/pretreat-data-import-config/get-page`,
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
   * @tags pretreatment
   * @name Get
   * @summary 查询导入配置
   * @request GET:/api/pretreatment/pretreat-data-import-config/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<PretreatDataImportConfigOutput>, any>({
      path: `/api/pretreatment/pretreat-data-import-config/get`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags pretreatment
   * @name Get
   * @summary 获取通用导入配置
   * @request GET:/api/pretreatment/pretreat-data-import-config/get-general-import-config
   * @secure
   */
  getGeneralImportConfig = () =>
    this.request<ResultBaseOutput<Array<PretreatDataImportConfigOutput>>, any>({
      path: `/api/pretreatment/pretreat-data-import-config/get-general-import-config`,
      method: 'GET',
      secure: true,
      format: 'json',
    })
  /**
   * No description
   *
   * @tags pretreatment
   * @name GetAll
   * @summary 查询导入配置所有数据
   * @request GET:/api/pretreatment/pretreat-data-import-config/getAll
   * @secure
   */
  getAll = () =>
    this.request<ResultBaseOutput<Array<PretreatDataImportConfigOutput>>, any>({
      path: `/api/pretreatment/pretreat-data-import-config/get-all`,
      method: 'GET',
      secure: true,
      format: 'json',
    })
  /**
   * No description
   *
   * @tags pretreatment
   * @name Add
   * @summary 新增导入配置
   * @request POST:/api/pretreatment/pretreat-data-import-config/add
   * @secure
   */
  add = (data: PretreatDataImportConfigAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/pretreatment/pretreat-data-import-config/add`,
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
   * @tags pretreatment
   * @name Update
   * @summary 修改导入配置
   * @request PUT:/api/pretreatment/pretreat-data-import-config/update
   * @secure
   */
  update = (data: PretreatDataImportConfigUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/pretreatment/pretreat-data-import-config/update`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags pretreatment
   * @name Delete
   * @summary 生成导入配置
   * @request DELETE:/api/pretreatment/pretreat-data-import-config/delete
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
      path: `/api/pretreatment/pretreat-data-import-config/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
}
