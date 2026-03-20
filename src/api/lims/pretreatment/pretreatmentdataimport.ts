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
import { PretreatSampleInfoListOutput, PretreatSampleInfoQueryListInput } from '/@/api/lims/pretreatment/datacontract/pretreatsampleinfo-datacontract'

export class PretreatDataImportApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags pretreatment
   * @name Add
   * @summary 新增导入配置
   * @request POST:/api/pretreatment/pretreat-data-import-config/add
   * @secure
   */
  dataImport = (data: any, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<PretreatSampleInfoListOutput[]>, any>({
      path: `/api/pretreatment/data-import/data-import`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.FormData,
      format: 'json',
      ...params,
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
  getImportedData = (data: GetPageInput<PretreatSampleInfoQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<PretreatSampleInfoListOutput>, any>({
      path: `/api/pretreatment/data-import/get-imported-sample-info`,
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
   * @name Add
   * @summary 删除数据
   * @request POST:/api/pretreatment/pretreat-data-import-config/delete-info
   * @secure
   */
  deleteInfo = (data: any, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<boolean>, any>({
      path: `/api/pretreatment/data-import/delete-info`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
}
