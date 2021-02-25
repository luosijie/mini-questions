/**
 * 获取回答记录分页
 * @param {Number} no 页码
 * @param {Number} size 页数
 * @return {Object} 投票数据列表和总数
 */
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  //获取接口参数
  const wxContext = cloud.getWXContext()
  const size = event.size
  const no = event.no
  const OPENID = wxContext.OPENID
  const collection = db.collection('answers')
  // 查找集合中的投票数据
  const votes = await collection.aggregate()
  .match({
    questionCreator: OPENID
  })
  .lookup({
    from: 'users',
    localField: 'creator',
    foreignField: 'OPENID',
    as: 'creator'
  })
  .lookup({
    from: 'questions',
    localField: 'questionId',
    foreignField: '_id',
    as: 'question'
  })
  .sort({
    readed: 1,
    _id: -1
  })
  .skip((no - 1) * size)
  .limit(size)
  .end()
  const data = votes.list.map(e => {
    return {
      ...e,
      creator: e.creator[0],
      question: e.question[0]
    }
  })
  // 计算总数
  const count = await collection.count()
  return {
    total: count.total,
    data
  }
}
