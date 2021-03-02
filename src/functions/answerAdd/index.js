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
  const questionId = event.questionId
  const answer = event.answer

  const answerCollection = db.collection('answers')
  const questionCollection = db.collection('questions')

  const questionQuery = await questionCollection
  .aggregate()
  .match({ _id: questionId })
  .end()
  
  if (!questionQuery.list.length) {
    return null
  }
  
  const question = questionQuery.list[0]
  const cards = question.cards
  const questionCreator = question.creator
  
  // 计算正确的个数
  let right = 0
  const result = []
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].correct === answer[i]) {
      right++
      result[i] = true
    } else {
      result[i] = false
    }
  }

  const score =  `${(right / cards.length * 100).toFixed(0)}%`
  
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
    creator: wxContext.OPENID,
    questionId,
    questionCreator,
    answer,
    score,
    result
  }

  // 集合投票questions：新增记录
  const res = await answerCollection.add({
    data
  })

  if (res._id) {
    // 更新问题里的回答记录
    const questionUpdate = await questionCollection.doc(questionId).update({
      data: {
        answers: db.command.push({
          _id: res._id,
          creator: wxContext.OPENID
        })
      }
    })
    return {
      success: true,
      message: '成功提交',
      data: res._id
    }
  } else {
    return {
      success: false,
      message: res.errMsg
    }
  }
}
