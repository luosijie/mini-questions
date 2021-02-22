/**
 * 新增回答记录
 * @param {String} questionId 题目_id
 * @param {String} answer 答案
 */
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const collection = db.collection('questions')
  
  const questionId = event.questionId

  const data = {
    creator: wxContext.OPENID, // 出题人
    questionId,
    title: event.answer, // 标题
    createTime: `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`
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
