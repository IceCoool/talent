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

##查看固定的页面（不用一级一级的点进页面查找）
> app.json --> pages --> 想看的页面路由放到首行


## 快速新建页面
> 在自己的文件夹选择新建page 输入名字即可 这种方式会把页面自动加到路由中

## 高德key
> cf7f9a6bc988083166ac2d4e06d3bac4