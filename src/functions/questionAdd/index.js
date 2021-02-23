/**
 * 新增投票记录
 * @param {String} title 标题
 * @param {String} desc 描述
 * @param {String} startTime 开始日期
 * @param {String} endTime 结束日期
 * @param {String} anonymous 匿名
 * @param {String} min 允许小投票数
 * @param {String} max 允许最大投票数
 * @param {String} type 投票类型：normal; pk
 * @returns {Object} 包含投票_id
 */
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const collection = db.collection('questions')
  
  // 创建时间
  const date = new Date()
  const year  = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()

  const data = {
    createTime: `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`,
    creator: wxContext.OPENID, // 出题人
    title: event.title, // 标题
    cards: event.cards, // 选项
    answers: [] // 回答的记录
  }

  // 集合投票questions：新增记录
  const res = await collection.add({
    data
  })
  return {
    success: true,
    message: '新增投票成功',
    ...res
  }
}
