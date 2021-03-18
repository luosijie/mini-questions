/**
 * 校验用户是否登录过
 * 没有登录过跳转到 登录页面
 * */
export default function () {
  const user = wx.getStorageSync('user')
  console.log('current-user', user)
  if (!user) {
    wx.navigateTo({
      url: 'pages/login'
    })
    return null
  }
  return user
}
