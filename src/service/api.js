import { fetch, post } from './ajax'

/**
 * 用户帐号密码登录
 */
export const login = ({ loginName, password }) => post('/patientUser/patientLogin', { loginName, password }, { isForm: true })

/**
 * 获取当前用户信息
 */
export const getUserInfo = () => fetch('/patientUser/refreshUserInfo')
// 获取我的科室信息
export const getMyProject = () => fetch('/patientUser/getMyTeam')
// todo
export const getProjectInfo = (id) => fetch('/todo', { id })

/**
 * 首页未读消息
 */
export const getUnreadMsgs = () => fetch('/patientUser/getSign')

/**
 * 免费咨询 聊天模块
 */

//  查询个案师绑定状态，未绑定个案师则提示去绑定
export const getManagerStatus = () => fetch('/patientUser/getManagerId')

// 查询聊天列表
export const getChatList = () => fetch('/patientUser/findByUserContacts')

// 获取单聊记录
export const getChatContents = ({ contactsId, userId }) => fetch('/patientUser/getMessagesBetweenUserContact', { contactsId, userId })

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
