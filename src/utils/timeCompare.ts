class DateTimeComparator {
  /**
   * 比较两个日期时间是否相等（精确到秒）
   * @param {Date|string|number|null|undefined} date1 - 第一个日期
   * @param {Date|string|number|null|undefined} date2 - 第二个日期
   * @param {Object} options - 配置选项
   * @param {boolean} options.useUTC - 是否使用UTC时间
   * @param {boolean} options.treatInvalidAsNull - 是否将无效日期视为null
   * @param {boolean} options.allowStringInput - 是否允许字符串输入
   * @returns {boolean} 是否相等
   */
  static compare = (date1: any, date2: any, options = {} as any): boolean => {
    const { useUTC = false, treatInvalidAsNull = false, allowStringInput = true } = options

    // 处理空值
    if (date1 === null || date1 === undefined || date2 === null || date2 === undefined) {
      return date1 === date2
    }

    // 转换为Date对象
    const d1 = this._safeToDate(date1, allowStringInput)
    const d2 = this._safeToDate(date2, allowStringInput)

    // 如果允许将无效日期视为null
    if (treatInvalidAsNull) {
      const isValid1 = d1 !== null && !isNaN(d1.getTime())
      const isValid2 = d2 !== null && !isNaN(d2.getTime())

      if (!isValid1 || !isValid2) {
        return (!isValid1 && !isValid2) || (d1 === null && d2 === null)
      }
    } else {
      // 检查是否为有效日期
      if (!d1 || !d2 || isNaN(d1.getTime()) || isNaN(d2.getTime())) {
        return false
      }
    }

    // 根据是否使用UTC进行比较
    if (useUTC) {
      return this._compareUTC(d1, d2)
    } else {
      return this._compareLocal(d1, d2)
    }
  }

  /**
   * 安全转换为Date对象
   */
  static _safeToDate(input, allowStringInput) {
    if (input instanceof Date) {
      return input
    }

    if (!allowStringInput) {
      return null
    }

    // 处理空值
    if (input === null || input === undefined) {
      return input
    }

    // 尝试转换
    try {
      const date = new Date(input)
      return date
    } catch (error) {
      return null
    }
  }

  /**
   * 比较本地时间（精确到秒）
   */
  static _compareLocal(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate() &&
      date1.getHours() === date2.getHours() &&
      date1.getMinutes() === date2.getMinutes() &&
      date1.getSeconds() === date2.getSeconds()
    )
  }

  /**
   * 比较UTC时间（精确到秒）
   */
  static _compareUTC(date1, date2) {
    console.log('date1',date1)
    console.log('date2',date2)
    return (
      date1.getUTCFullYear() === date2.getUTCFullYear() &&
      date1.getUTCMonth() === date2.getUTCMonth() &&
      date1.getUTCDate() === date2.getUTCDate() &&
      date1.getUTCHours() === date2.getUTCHours() &&
      date1.getUTCMinutes() === date2.getUTCMinutes() &&
      date1.getUTCSeconds() === date2.getUTCSeconds()
    )
  }

  /**
   * 快速比较（使用时间戳）
   */
  static compareFast(date1, date2) {
    // 处理空值
    if (date1 === null || date1 === undefined || date2 === null || date2 === undefined) {
      return date1 === date2
    }

    // 转换为Date对象
    const d1 = date1 instanceof Date ? date1 : new Date(date1)
    const d2 = date2 instanceof Date ? date2 : new Date(date2)

    // 检查有效性
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      return false
    }

    // 比较到秒的时间戳
    return Math.floor(d1.getTime() / 1000) === Math.floor(d2.getTime() / 1000)
  }
}

export default DateTimeComparator

// // 使用示例
// console.log(DateTimeComparator.compare(null, null)) // true

// console.log(DateTimeComparator.compare(null, new Date())) // false

// console.log(DateTimeComparator.compare('2024-01-15T14:30:45', '2024-01-15T14:30:45')) // true

// console.log(DateTimeComparator.compare('invalid-date', 'invalid-date', { treatInvalidAsNull: true })) // true（两个无效日期视为相等）

// console.log(DateTimeComparator.compare('invalid-date', new Date(), { treatInvalidAsNull: true })) // false
