const app = getApp();

/**
 * 搜索事件
 * @param key_word      搜索关键词
 * @param has_Result    结果数
 * @param is_word_type  [推荐词，历史词，自主输入]
 */
export const search = function (key_word, has_Result, is_word_type) {
  app.sensors.track('Search_SJKMP', {key_word, has_Result, page_position: app.globalData.currentTab, is_word_type})
};

/**
 * 搜索结果点击事件
 * @param results_name   [需求名称、企业名称、？]
 * @param click_position [位置 index]
 */
export const searchResultClick = function (results_name, click_position) {
  app.sensors.track('SearchResultsClick_SJKMP', {result_type: app.globalData.currentTab, results_name, click_position: click_position + 1})
};

/**
 * 广告曝光
 * @param content_ID     [小程序内部、解放号内部H5、外部url]
 * @param show_position  [0，1，2，3]
 */
export const contentExposure = function (content_ID, show_position) {
  app.sensors.track('ContentExposure_SJKMP', {tab_name: app.globalData.currentTab, content_ID, show_position})
}

/**
 * 市场操作
 * @param content_ID
 * @param content_title
 * @param content_channel   区间值[1万以下、1-5万、5-10万、10-20万、20万以上]
 * @param content_operation [收藏、取消收藏、咨询、转发、立即投标、复制网址、无操作]
 */
export const demandOperation = function (content_ID, content_title, content_channel, content_operation) {
  app.sensors.track('ArticleOperation_SJKMP', {content_show_type: '市场', content_ID, content_title, content_channel, content_operation})
}

/**
 * 人脉操作
 * @param content_ID
 * @param content_title
 * @param content_operation [收藏、取消收藏、查看名片、咨询、留言、分享、复制网址、无操作]
 */
export const cardOperation = function (content_ID, content_title, content_operation) {
  app.sensors.track('ArticleOperation_SJKMP', { content_show_type: '人脉', content_channel: '', content_ID, content_title, content_operation})
}

/**
 * 需求咨询内容离开
 * @param content_ID
 * @param content_title
 * @param read_duration     浏览时长 [s]
 */
export const articleExit = function (content_ID, content_title, read_duration) {
  app.sensors.track('ArticleExit_SJKMP', {content_show_type: app.globalData.currentTab, content_ID, content_title, read_duration})
}

/**
 * 点击页面元素
 * @param icon_name [发需求、市场tab页中的“顶部banner”；名片tab页中的“创建名片（+）”；我的tab页中的“数据”、“名片夹”、“消息”、“我的企业”、“设置”、“联系客服”]
 */
export const channelClick = function(icon_name) {
  app.sensors.track('ChannelClick_SJKMP', { tab_name: app.globalData.currentTab, icon_name})
}

/**
 * 音视频添加
 * @param content_channel [视频、音频]
 */
export const avAdd = function(content_channel) {
  app.sensors.track('VideoAudioAddition_SJKMP', { tab_name: app.globalData.currentTab, content_channel})
}

/**
 * 音视频播放
 * @param play_type [主动播放，自动播放]
 * @param content_channel [视频、音频]
 */
export const avPlay = function (play_type, content_channel) {
  app.sensors.track('VideoAudioPlay_SJKMP', { tab_name: app.globalData.currentTab, play_type, content_channel })
}  

/**
 * 联系触发
 * @param contact_type [复制微信、打电话、联系客服]
 */
export const contact = function (contact_type) {
  app.sensors.track('Contact_SJKMP', { contact_type })
}

/**
 * 秒表，用于时长计算
 * begin: 开始计时
 * stop: 停止计时，返回秒数时长
 */
export const stopWatch = function () {
  let time;
  return {
    begin() {
      time = Date.now()
    },
    stop() {
      return Math.round((Date.now() - time) / 1000)
    }
  }
}();