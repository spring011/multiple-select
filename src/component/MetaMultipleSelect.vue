<template>
  <div class="meta-select-box" style="" @click.stop='clickDropDown'>
    <div class="meta-select" :class="{'meta-select-visible': showDropDownList}">
      <div class="meta-select-selection">
        <div v-if="selectedList.length > 0">
          <Tag v-for="(item,index) in selectedList" :key="index" closable @on-close="deleteSelectItem(item,index)">{{item.database}}</Tag>
        </div>
        <div class="no-select-data" v-if="selectedList.length == 0">
          <span>请选择</span>
        </div>
      </div>
      <i class="ivu-icon ivu-select-arrow ivu-icon-ios-arrow-down" v-if="!showDropDownList"></i>
      <i class="ivu-icon ivu-select-arrow ivu-icon-ios-arrow-up" v-if="showDropDownList"></i>
    </div>
    <div v-if='showDropDownList' class="meta-select-dropdown-wrap">
      <div class="meta-select-dropdown">
        <div class="meta-select-search">
          <div class="meta-select-search-input" @click.stop>
            <Input search placeholder="模糊匹配" v-model="key" @on-change="searchDatabase"/>
          </div>
          <div class="meta-select-search-action">
            <span @click.stop="selectMatch">选中匹配</span>
          </div>
        </div>
        <div v-if="searchMatchList.length == 0" class="no-data">
          <span>无数据～</span>
        </div>
        <ul class="meta-select-dropdown-list" v-if="searchMatchList.length > 0">
          <li class="meta-select-dropdown-item"
              :class="{'selected': item.selected}"
              @click.stop="changeSelectStatus(item,index)"
              v-for="(item,index) in searchMatchList"
              :key="index">
            {{item.database}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  const _ = require('lodash')

  export default {
    name: "meta-multiple-select",
    props: {
      'sourceList': {
        type: Array,
        default: () => {
          return {};
        }
      },
      'sourceSelectedList': {
        type: Array,
        default: () => {
          return {};
        }
      },
    },
    data () {
      return {
        showDropDownList:false,
        dropDownList:[],
        selectedList: [],
        key: '',
        searchMatchList: []
      }
    },
    methods:{
      selectMatch() {
        _.forEach(this.searchMatchList, (item) => {
          if (!item.selected) {
            this.selectedList.push(item);
            item.selected = true;
          }
        })
        this.setData();
      },
      fuzzySearch(keyword, List) {
        if (!keyword) {
          return this.dropDownList;
        }
        let matchList = [];
        _.forEach(List, (item) => {
          let matchDatabaseStr = item.database;
          if (matchDatabaseStr.indexOf(keyword) >= 0) {
            matchList.push(item);
          }
        });
        return matchList;
      },
      debounceSearchDatabase: _.debounce((self) => {
        self.searchMatchList = self.fuzzySearch(self.key, self.dropDownList);
      },300),
      searchDatabase() {
        this.debounceSearchDatabase(this);
      },
      deleteSelectItem(item,index) {
        this.selectedList.splice(index, 1);
        for (let i= 0; i < this.searchMatchList.length; i++ ){
          if (this.searchMatchList[i].database == item.database) {
            this.searchMatchList[i].selected = false;
            break;
          }
        }
        this.setData();
      },
      changeSelectStatus(item) {
        this.$set(item, 'selected', !item.selected);
        if (item.selected) {
          this.selectedList.push(item);
        } else {
          for (let i = 0; i < this.selectedList.length; i++) {
            if (this.selectedList[i].database== item.database) {
              this.selectedList.splice(i, 1);
              break;
            }
          }
        }
        this.setData();
      },
      setData(){
        let returnData = []
        for (let i = 0; i < this.sourceList.length; i++) {
          for (let j = 0; j < this.selectedList.length; j++) {
            if (this.sourceList[i].database === this.selectedList[j].database) {
              returnData.push(this.sourceList[i])
            }
          }
        }
        this.$emit('returnData',returnData)
      },
      clickDropDown(){
        this.showDropDownList= !this.showDropDownList;
        setTimeout(()=>{
          //展开菜单的时候添加到document的click事件
          document.addEventListener("click",this.removeEvt)
        },0)
      },
      removeEvt(){
        document.removeEventListener("click",()=>{})
        this.showDropDownList = false;
      },
      initDropDownListStatus() {
        _.forEach(this.selectedList, (item) => {
          for(let i = 0; i < this.dropDownList.length; i++) {
            if (item.database == this.dropDownList[i].database) {
              this.dropDownList[i].selected = true;
              break;
            }
          }
        })
      },
    },
    mounted() {
      console.log(111)
      this.dropDownList = _.cloneDeep(this.sourceList);
        this.selectedList = _.cloneDeep(this.sourceSelectedList);
      this.initDropDownListStatus();
      this.searchMatchList = this.dropDownList;
    },
    watch: {
      sourceList(val) {
        console.log(111)
        this.dropDownList = _.cloneDeep(val);
        this.initDropDownListStatus();
        this.searchMatchList = this.dropDownList;
          console.log('this.searchMatchList')
          console.log(this.searchMatchList)
      },
      sourceSelectedList(val) {
        this.selectedList = _.cloneDeep(val);
        this.initDropDownListStatus();
        this.searchMatchList = this.dropDownList;
      }
    }
  }

</script>

<style scoped lang="less">
  .meta-select-box{
    position: relative;
    width:100%;
    margin-bottom: 4px;
  }
  .meta-select-dropdown-wrap{
    position: absolute;
    top: 100%;
    margin-top:4px;
    width:100%;
    max-height: 200px;
    min-height: 50px;
    overflow: auto;
    padding: 5px 0;
    background-color: #fff;
    box-sizing: border-box;
    border-radius: 4px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    z-index: 5000;
    .meta-select-dropdown {
      .no-data {
        text-align: center;
        span{
          display: inline-block;
          line-height: 32px;
          color: #c5c8ce;
        }
      }
      .meta-select-search {
        display: flex;
        padding: 6px 8px 6px 12px;
        .meta-select-search-input {
          flex: 1;
          /deep/.ivu-input {
            height: 30px;
            line-height: 30px;
          }
        }
        .meta-select-search-action {
          flex-basis: 60px;
          margin-left: 6px;
          span{
            color: #409eff;
            line-height: 32px;
            cursor: pointer;
          }
        }
      }
      .meta-select-dropdown-list {
        miin-width: 100%;
        list-style: none;
        .meta-select-dropdown-item {
          margin: 0;
          line-height: normal;
          padding: 7px 16px;
          clear: both;
          color: #515a6e;
          font-size: 14px !important;
          white-space: nowrap;
          list-style: none;
          cursor: pointer;
          transition: background 0.2s ease-in-out;
          &:hover {
            background: #f3f3f3;
          }
          &.selected {
            background: #f3f3f3;
            color: #409eff;
          }
        }
      }
    }
  }
  .meta-select{
    display: inline-block;
    width: 100%;
    box-sizing: border-box;
    vertical-align: middle;
    color: #515a6e;
    font-size: 14px;
    line-height: normal;
    height: auto;
    position: relative;
    .meta-select-selection {
      max-height: 126px;
      overflow: auto;
      min-height: 32px;
      padding: 2px 24px 2px 4px;
      display: block;
      box-sizing: border-box;
      outline: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      position: relative;
      background-color: #fff;
      border-radius: 4px;
      border: 1px solid #dcdee2;
      transition: all 0.2s ease-in-out;
      .no-select-data {
        span {
          color: #c5c8ce;
          display: inline-block;
          line-height: 28px;
        }
      }
      /deep/ .ivu-tag {
        position: relative;
        padding-right: 20px;
        .ivu-icon-ios-close {
          position: absolute;
          top: 4px;
          translate: transformY(-50%);
          right: 4px;

        }
      }
    }
  }
  .meta-select.meta-select-visible{
    .meta-select-selection{
      border-color: #57a3f3;
      outline: 0;
      box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
    }
  }
</style>
