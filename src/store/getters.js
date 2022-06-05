const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  permission_routes: state => state.permission.routes,
  token: state => state.user.token,
  username: state => state.user.username,
  user: state => state.user.user,
  weather: state => state.user.weather,
  hasInfo: state => state.user.hasInfo,
}
export default getters
