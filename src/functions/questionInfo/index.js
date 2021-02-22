/**
 * 获取问题基本信息
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
  const OPENID = cloud.getWXContext().OPENID
  // 查找集合中的投票数据
  const questionCollection = db.collection('questions')
  // 聚合联表查询
  const questionQuery = await questionCollection
  .aggregate()
  .match({ _id })
  .lookup({
    from: 'users',
    localField: 'creator',
    foreignField: 'OPENID',
    as: 'creator'
  })
  .end()
  if (questionQuery.list.length) {
    const data = questionQuery.list[0]
    if (data.creator && data.creator.length) {
      data.creator = data.creator[0]
    }
    delete data.cards
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
