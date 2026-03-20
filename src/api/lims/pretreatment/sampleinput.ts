import { InputSaveDto, InputSaveSuccessOutput } from './datacontract/sampleinput-datacontract'
import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { ResultBaseOutput } from '/@/api/lims/basedata/datacontract/base'

export class SampleInputApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags pretreatment
   * @name CheckBarcodeInUse
   * @summary 判断条码是否已使用
   * @request GET:/api/pretreatment/input/check-barcode-in-use
   * @secure
   */
  checkBarcodeInUse = (
    query?: {
      barcode?: string
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<boolean>, any>({
      path: `/api/pretreatment/sample-input/check-barcode-in-use`,
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
   * @name SaveInfoAndItem
   * @summary 保存录入信息和项目
   * @request POST:/api/pretreatment/sample-input/save-info-and-item
   * @secure
   */
  saveInfoAndItem = (data: InputSaveDto, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<InputSaveSuccessOutput>, any>({
      path: `/api/pretreatment/sample-input/save-info-and-item`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
}
