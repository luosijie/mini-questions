// 校验用户是否登录过
export default function () {
  const user = wx.getStorageSync('user')
  if (!user) {
    wx.navigateTo({
      url: 'login'
    })
    return null
  }
  return user
}
