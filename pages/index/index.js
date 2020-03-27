//index.js
var dataUrl = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
var util = require("../../utils/util.js");

//更改数组 第三个参数是对象
function editArr(arr,i,editCnt){
  let newArr = arr,editingObj = newArr[i];   
    for (var x in editCnt){
      editingObj[x]= editCnt[x];
    }
  return newArr;
}

//获取应用实例
var app = getApp()
Page({
  data: { 
    multiArray:[['重要', '非重要'], ['紧急', '非紧急']], //优先级列表 
    multiIndex: [0, 0], //存放用户选择的结果
    userInfo: {},
    curIpt:'',
    showAll:true,
    lists:[],
    curRange:[],
    curBegin:0,//起始和结束时间的下标，通过下标查找对应时间
    curFinish:1,
    remind:[],
    //csl added on 20200327
    begindate: (new Date()).toLocaleDateString(),
    begintime: (new Date()).getHours() + ':' + (new Date()).getMinutes(),
    enddate: (new Date()).toLocaleDateString(),
    endtime: (new Date()).getHours() + ':' + (new Date()).getMinutes(),
  },
  
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this;
    //获取之前保留在缓存里的数据
    wx.getStorage({
      key: 'todolist',
      success: function(res) {
        if(res.data){
           that.setData({
            lists:res.data
          })
        }
      } 
    })
    //获取用户信息
    app.getUserInfo(function(userInfo){
      that.setData({
        userInfo:userInfo
      })
    })
  },
  iptChange(e){ 
    this.subIptChange(e.detail.value);
    // let timeArr = util.setTimeHalf();   
    // this.setData({
    //   curIpt:e.detail.value,
    //   curRange:timeArr
    // })
  },
  // 用户输入或者点击默认按钮共同引起的输入框变动回调函数
  subIptChange(data) {
    let timeArr = util.setTimeHalf();//输出现在以后今天以前所有的半点
    this.setData({
      curIpt: data,
      curRange: timeArr
    })
  },
  // 默认内容按钮回调
  defaultButtonOnClick(e){
    this.subIptChange(e.target.id);
  },
  // 事件类型选择器的回调函数
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      multiIndex: e.detail.value
    });
  },
  //初始化表格
  formReset(){
    this.setData({
      curIpt:'',
      begindate: (new Date()).toLocaleDateString(),
      begintime: (new Date()).getHours() + ':' + (new Date()).getMinutes(),
      enddate: (new Date()).toLocaleDateString(),
      endtime: (new Date()).getHours() + ':' + (new Date()).getMinutes(),
    });
  },
  //提交表格后的动作
  formSubmit(){
    let cnt = this.data.curIpt, newLists = this.data.lists, i = newLists.length, begin = this.data.begindate + "-" + this.data.begintime, finish = this.data.enddate + "-" + this.data.endtime, type = this.data.multiIndex; //type为事件类型 
    if (cnt){
       newLists.push({id:i,content:cnt,done:false,beginTime:begin,finishTime:finish,editing:false, type:type});
       this.setData({
        lists:newLists,
        curIpt: '',
        });
    }
  },
  /*
  //修改起始时间后的动作
  beginChange(e){
     this.setData({
      curBegin: e.detail.value,
      curFinish: Number(e.detail.value)+1
    })
  },
  //修改结束时间后的动作
  finishChange(e){
    this.setData({
      curFinish: e.detail.value
    })
  },
  */
  //csl added on 20200327
  //修改起始日期后的动作
  beginDateChange(e) {
    this.setData({
      begindate: e.detail.value,
    })
  },
  //修改起始时间后的动作
  beginTimeChange(e) {
    this.setData({
      begintime: e.detail.value,
    })
  },
  endDateChange(e) {
    this.setData({
      enddate: e.detail.value,
    })
  },
  //修改起始时间后的动作
  endTimeChange(e) {
    this.setData({
      endtime: e.detail.value,
    })
  },
  //修改备忘录
  toChange(e){
    let i = e.target.dataset.id;
      this.setData({
        lists:editArr(this.data.lists,i,{editing:true})
      })
  },
  iptEdit(e){
    let i = e.target.dataset.id;
    this.setData({
      lists:editArr(this.data.lists,i,{curVal:e.detail.value})
    })
  },
  saveEdit(e){   
    let i = e.target.dataset.id;
    this.setData({
      lists:editArr(this.data.lists,i,{content:this.data.lists[i].curVal,editing:false})
    })
  },
  setDone(e){
    let i = e.target.dataset.id,originalDone = this.data.lists[i].done;
      this.setData({
        lists:editArr(this.data.lists,i,{done:!originalDone})
      })
  },
  toDelete(e){
    let i = e.target.dataset.id,newLists = this.data.lists;
    newLists.map(function(l,index){
      if (l.id == i){      
        newLists.splice(index,1);
      }
    })   
    this.setData({
        lists:newLists
      })
  },
  doneAll(){
    let newLists = this.data.lists;
    newLists.map(function(l){
      l.done = true;
    })   
    this.setData({
        lists:newLists
      })
  },
  deleteAll(){
    this.setData({
        lists:[],
        remind:[]
      })
  },
  showUnfinished (){
    this.setData({
      showAll:false
    })
  },
  showAll(){
    //显示全部事项
     this.setData({
      showAll:true   
    })
  },
  saveData(){
    let listsArr = this.data.lists;
    wx.setStorage({
      key:'todolist',
      data:listsArr
    })
  }
  
})
