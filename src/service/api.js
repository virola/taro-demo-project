import { fetch, post } from './ajax'

/**
 * 用户帐号密码登录
 */
export const login = ({ loginName, password }) => post('/patientUser/patientLogin', { loginName, password }, { isForm: true })

/**
 * 获取当前用户信息
 */
export const getUserInfo = () => fetch('/patientUser/getLoginUserInfo')
// 获取我的科室信息
export const getMyProject = () => fetch('/patientUser/getMyTeam')
// todo
export const getProjectInfo = (id) => fetch('/todo', { id })

/**
 * 支付相关接口
 */


/**
 * 获取送礼的支付参数
 * @param {*} params 礼物字段
 */
export const getGiftPayMap = params => fetch('/patientUser/getPrepaidMap', params)

/**
 * 余额送礼
 * @param {*} params 礼物参数
 */
export const payGiftByBalance = params => fetch('/patientUser/buyFlowerByBalance', params)

/**
 * 宣教支付参数
 * @param {*} params 宣教参数
 */
export const getEduPayMap = params => fetch('/patientUser/getPrepaidMapForEducation', params)

/**
 * 余额购买宣教
 */
export const payEduByBalance = params => fetch('/patientUser/buyEducationByBalance', params)

/**
 * 首页未读消息
 */
export const getUnreadMsgs = () => fetch('/patientUser/getSign')

/**
 * 免费咨询 聊天模块
 */

//  查询个案师绑定状态，未绑定个案师则提示去绑定
export const getManagerStatus = () => fetch('/patientUser/getManagerId')

/**
 * 根据ID查询个案师信息
 * @param {*} id 个案师ID
 */
export const getManagerInfoById = id => fetch('/patientUser/getByManager', { id })

// 查询聊天列表
export const getChatList = () => fetch('/patientUser/findByUserContacts')

// 获取单聊记录
export const getChatContents = ({ contactsId, userId }) => fetch('/patientUser/getMessagesBetweenUserContact', { contactsId, userId })

/**
 * 进入聊天时标记消息已读
 * @param {Object} 参数
 */
export const updateMsgReadStatus = ({ relationId, messageType = 0 }) => post('/patientUser/groupChatMessageUpdateRead', { relationId, messageType }, true)

/**
 * *********************
 * 宣教科普
 * =============
 */

/**
 * 获取系统宣教
 * @param {*} query
 */
export const getSystemEduList = query => fetch('/patientUser/getFilterSystemHealthEducations', query)

// 获取宣教标签
export const getEduLabels = () => fetch('/patientUser/getLabels')


