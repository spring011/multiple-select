<template>
  <div id="app">
    <meta-multiple-select :sourceList='sourceList' :sourceSelectedList='sourceSelectedList' @returnData="changeData"></meta-multiple-select>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        sourceList: [{database:'数据库1'},{database:'数据库2'},{database:'数据库3'},{database:'数据库4'},{database:'数据库5'},{database:'数据库6'},{database:'数据库7'}],
        sourceSelectedList: [{database:'数据库1'},{database:'数据库4'}]
      }
    },
    methods: {
      changeData(selectedDatabaseList) {
        console.log(selectedDatabaseList)
      }
    }
  }
</script>
<style lang="less">
#app {
  /deep/ .meta-select-box {
    width: 370px;
  }
}
</style>