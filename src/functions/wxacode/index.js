
/**
 * 获取页面小程序码
 * @param {*} event.fileID 微信云存储的图片ID
 * @return {Number} 0:校验失败；1:校验通过
 */
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.wxacode.getUnlimited({
      scene: event.scene,
      page: event.page
    })
    return result
  } catch (err) {
    return err
  }
}
