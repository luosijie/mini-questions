/**
 * 获取答案详情
 * @param {String} _id 问题_id
 * @return {Object} 基本信息数据
 */
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  const _id = event._id
  // const OPENID = cloud.getWXContext().OPENID
  // 查找集合中的投票数据
  const answerCollection = db.collection('answers')
  // 聚合联表查询
  const answerQuery = await answerCollection
  .aggregate()
  .match({ _id })
  .lookup({
    from: 'users',
    localField: 'creator',
    foreignField: 'OPENID',
    as: 'creator'
  })
  .lookup({
    from: 'users',
    localField: 'questionCreator',
    foreignField: 'OPENID',
    as: 'questionCreator'
  })
  .lookup({
    from: 'questions',
    localField: 'questionId',
    foreignField: '_id',
    as: 'question'
  })
  .end()
  console.log('asdads', answerQuery)
  if (answerQuery.list.length) {
    const data = answerQuery.list[0]
    if (data.creator && data.creator.length) {
      data.creator = data.creator[0]
    }
    if (data.questionCreator && data.questionCreator.length) {
      data.questionCreator = data.questionCreator[0]
    }
    if (data.question && data.question.length) {
      data.question = data.question[0]
      delete data.questionId
    }
    return {
      success: true,
      data
    }
  } else {
    return {
      success: false,
      data: null
    }
  }
}
