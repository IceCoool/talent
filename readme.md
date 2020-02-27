## 公共组件 如弹窗之类可以使用组件库
> https://youzan.github.io/vant-weapp/#/popup

## 页面使用组件
> 在各自页面的JSON文件配置如下
```
  // index.json
  "usingComponents":{
    "van-popup": "/@vant/weapp/popup/index"
  }
```

若组件在多处使用可在app.json全局引入
```
  // app.json
  "usingComponents":{
    "van-popup": "/@vant/weapp/popup/index"
  }
```
