import api from "../../utils/api"

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持 
  },
  /** 
   * 组件的属性列表 
   * 用于组件自定义设置 
  */
  properties: {
    isShowProduct: {
      type: Boolean,
      value: false
    },
    // 导航数组 
    navList: { // 属性名 
      type: Array, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型） 
      value: [{content:'默认排序'},{content:'销量'},{content:'价格'}] // 属性初始值（可选），如果未指定则会根据类型选择一个 
    },
    // 第一项数组
    productList:{ 
      type: Array,
      value: ''
    },
    id:{
      type: String
    },
    content: {
      type: String
    },
    switchKey:{
      type: Number
    },
    swiperClass:{
      type: String,
      value: 'swiperMain'
    }
  },
  /** 
   * 私有数据,组件的初始数据 
   * 可用于模版渲染 
   */
  data: { // 弹窗显示控制 
    isShow: false,
    productList: [],
    switchKey: 0,
    boolTrue: true,
    boolFalse : false
  },
  created: function () { 
    console.log("created")
  },
  attached: function () {
    console.log("attached")
  },
  ready() {
    console.log("ready")
  },
  /**
   * 组件的方法列表 
   * 更新属性和数据的方法与更新页面数据的方法类似 
  */
  methods: {
    /** 
    * 公有方法 
    */
    // 切换导航
    _switchNav(e) {
      this.triggerEvent("switchNav",{id:e.currentTarget.id,content:e.currentTarget.dataset.content,search:e.currentTarget.dataset.search});
    },
    // 获取商品列表
    getProductsList(id, content, page, nums){
      const content1 = encodeURIComponent(content);
      const page1 = page || 1;
      const nums1 = nums || 18;
      api.getProductsList(content1, page1, nums1)
        .then(res=>{
          if( res.code == 0 ){
            this.setData({
              productList: res.data.prolist,
              switchKey: id
            })
          } else {
            wx.showToast({
              title: res.message,
              duration: 1500,
              icon: 'none',
            })
          }
        })
        .catch(err=>{
          console.log(err)
        })
    },
    // 跳转商品详情页
    toProductDetail(e) {
      wx.navigateTo({
        url: "/pages/homePage/productDetail/productDetail?id=" + e.currentTarget.id
      })
    },
    addCart(e){
      console.log(e);
      this.triggerEvent("addCart", {id:e.currentTarget.id})
    },
    /** 
     * 内部私有方法建议以下划线开头 
     * triggerEvent 用于触发事件 
    */
    _cancelEvent() { //触发取消回调 
      this.triggerEvent("cancelEvent")
    },
    _confirmEvent() { //触发成功回调 
      this.triggerEvent("confirmEvent");
    }
  }
})