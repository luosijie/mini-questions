/**
 * 回答标记已读状态
 * @param {String} _id 答案_id
 */
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  const answerId = event._id

  const answerCollection = db.collection('answers')

  const questionUpdate = await answerCollection.doc(answerId).update({
    data: {
      readed: true
    }
  })

  return {
    success: true,
    message: '已更新为已读',
    data: questionUpdate
  }
}
