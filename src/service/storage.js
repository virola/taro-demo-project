/**
 * 获取localStorage中的值，并解析Object
 * @param {*} key
 */
export const getLocalStorage = (key) => {
  let value = localStorage.getItem(key)
  if (value) {
    try {
      return JSON.parse(value)
    } catch (err) {
      return value
    }
  }
  return null
}

export const setLocalStorage = (key, value) => {
  return localStorage.setItem(key, JSON.stringify(value))
}
