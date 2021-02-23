/**
 * 获取我的投票记录分页
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
  const wxContext = cloud.getWXContext()
  const type = event.type
  const size = event.size
  //获取接口参数
  const no = event.no
  const OPENID = wxContext.OPENID
  const collection = db.collection('questions')
  const match = {}
  if (type === 'create') {
    match.creator = OPENID
  }
  if (type === 'answer') {
    match.answers = db.command.elemMatch({
      creator: OPENID
    })
  }
  // 查找集合中的投票数据
  const votes = await collection.aggregate()
  .match(match)
  .lookup({
    from: 'options',
    localField: '_id',
    foreignField: 'vote_id',
    as: 'options'
  })
  .sort({
    _id: -1
  })
  .skip((no - 1) * size)
  .limit(size)
  .end()
  // 计算总数
  const count = await collection.count()
  return {
    total: count.total,
    data: votes.list
  }
}
