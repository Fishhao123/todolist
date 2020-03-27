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
    sortStyle:0, // 排序方式，按默认顺序0，按时间顺序1，按事件级别顺序2
    sortWord:[
      '按时间先后排序',
      '按事件等级排序',
      '按提交先后排序'],
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
    // getApp().setWatcher(this.data, this.watch); // 设置监听器
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
  // watch: {
  //   sortStyle: function (newValue) {
  //     console.log(this.data.lists);
  //     if(newVal === 0){ //默认排序

  //     }else if(newValue === 1){ //按时间排序

  //     }else if(newValue === 2){ //按事件级别排序

  //     }
  //     console.log(newValue); // name改变时，调用该方法输出新值。
  //   }
  // },
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
  },
  //改变事件排序方式
  changeSortStyle(){
    let _this = this;
    let sortStyle = this.data.sortStyle;
    sortStyle = (sortStyle + 1) % 3;
    _this.setData({
      sortStyle: sortStyle
    });
    // console.log("排序方式：" + sortStyle)
    let resultList = [];
    if (sortStyle == 0){ // 默认排序
      resultList = _this.data.lists.sort(_this.sortBy('id'));
    }else if(sortStyle == 1){ // 按时间先后排序
      resultList = _this.data.lists.sort(_this.sortByTime('beginTime'));
    }else{ // 按事件等级排序
      resultList = _this.data.lists.sort(_this.sortByEventLevels('type'));
    }
    _this.setData({ // 赋值改变原列表顺序
      lists: resultList
    });
    // console.log(resultList)
  },
  sortBy(props){
    return function (b, a) {
      return b[props] - a[props]; // 后值减前值大于0，不用换，反之亦然
    }
  },
  sortByEventLevels(props) {
    return function (b, a) { //b是后一个值，a是前一个值
      let num1 = a[props][0] * 2 + a[props][1];
      let num2 = b[props][0] * 2 + b[props][1];
      if(num1 - num2 > 0){
        return -1;
      }else{
        return 1;
      }
    }
  },
  sortByTime(props) {
    return function (b, a) {
      let time1 = a[props].split("-"); // 更改：加上了年月日
      let time2 = b[props].split("-");

      let yearMonthDay1 = time1[0].split('/'); // 数组：年月日,例['2020','3','27']
      let hourMin1 = time1[1].split(':'); // 数组：时分,例['20','48']
      let yearMonthDay2 = time2[0].split('/'); // 年月日
      let hourMin2 = time2[1].split(':'); // 年月日
      let result = 0;

      if (parseInt(yearMonthDay1[0]) < parseInt(yearMonthDay2[0])){
        result = 1;
      } else if (parseInt(yearMonthDay1[0]) > parseInt(yearMonthDay2[0])){
        result = -1;
      } else { //年份一样再比较月份
        if (parseInt(yearMonthDay1[1]) < parseInt(yearMonthDay2[1])){
          result = 1;
        } else if (parseInt(yearMonthDay1[1]) > parseInt(yearMonthDay2[1])){
          result = -1;
        } else { //月份一样再比较天
          if (parseInt(yearMonthDay1[2]) < parseInt(yearMonthDay2[2])) {
            result = 1;
          } else if (parseInt(yearMonthDay1[2]) > parseInt(yearMonthDay2[2])) {
            result = -1;
          } else { //天一样比较时间
            if (parseInt(hourMin1[0]) < parseInt(hourMin2[0])) {
              result = 1; // 小的时间在前，不用换
            } else if (parseInt(hourMin1[0]) > parseInt(hourMin2[0])) {
              result = -1; // 反之需要交换
            } else { // 当时钟相等时比较分钟
              if (parseInt(hourMin1[1]) < parseInt(hourMin2[1])) {
                result = 1; // 不用换
              } else {
                result = -1;
              }
            }
          }
        }
      }
      return result; 
    }
  },
  
})