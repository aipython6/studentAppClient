const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  // showSettings: state => state.settings.showSettings,
  token: state => state.user.token,
  username: state => state.user.username,
  user: state => state.user.user,
  hasInfo: state => state.user.hasInfo,
}
export default getters
