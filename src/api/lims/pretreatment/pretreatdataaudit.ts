import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { ResultBaseOutput } from '/@/api/lims/basedata/datacontract/base'
import { DataAuditOutput } from './datacontract/pretreatdataaudit-datacontract'

export class PretreatDataAuditApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags pretreatment
   * @name Add
   * @summary 数据审核
   * @request POST:/api/pretreatment/data-audit/data-audit
   * @secure
   */
  dataAudit = (data: number[], params: RequestParams = {}) =>
    this.request<ResultBaseOutput<DataAuditOutput[]>, any>({
      path: `/api/pretreatment/data-audit/data-audit`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
}
