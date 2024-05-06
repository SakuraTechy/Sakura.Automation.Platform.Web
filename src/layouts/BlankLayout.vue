<template>
  <div>
    <div class="return-header">
      <div>
        <div class="header-title">{{ $route.query.title }}</div>
        <div class="header-return" @click="$router.push({name:$route.query.aliveFrom})">
          <span style="margin-right:5px"><<</span>
          <span>返回</span>
        </div>

      </div>
    </div>
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'BlankLayout',
  data() {
    return {}
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.return-header {
  position: relative;
  width: 100%;
  height:80px;
  background-color: #3356e8;
  color:#fff;
  font-size: 18px;
  line-height: 80px;
  .header-return {
    position: absolute;
    width: 150px;
    left:20px;
    cursor: pointer;
  }
  .header-title {
    position: absolute;
    width: 200px;
    left:50%;
    transform: translateX(-50%);
  }
}
</style>
