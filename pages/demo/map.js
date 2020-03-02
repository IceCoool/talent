const app = getApp()

Page({
  data: {},
  onLoad: function() {
    var self = this;
    this.mapCtx = wx.createMapContext('myMap');
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        self.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: [{
            id: 1,
            latitude: res.latitude,
            longitude: res.longitude,
            callout: {
              content: "西土城",
              bgColor: "#fff",
              padding: "5px",
              borderRadius: "2px"
            }
          }],
        });
      }
    })
  },
})