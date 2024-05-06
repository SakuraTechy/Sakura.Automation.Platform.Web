<!--
 * @Author: liuzhi liuzhi@sakura.com
 * @Date: 2022-07-18 15:04:51
 * @LastEditors: liuzhi liuzhi@sakura.com
 * @LastEditTime: 2022-07-18 16:29:16
 * @FilePath: Sakura.Test.Platform.Web\src\components\NumberInfo\NumberInfo.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div :class="[prefixCls]">
    <slot name="subtitle">
      <div :class="[`${prefixCls}-subtitle`]">{{ typeof subTitle === 'string' ? subTitle : subTitle() }}</div>
    </slot>
    <div class="number-info-value">
      <span>{{ total }}</span>
      <span class="sub-total">
        {{ subTotal }}
        <icon :type="`caret-${status}`" />
      </span>
    </div>
  </div>
</template>

<script>
import Icon from 'ant-design-vue/es/icon'

export default {
  name: 'NumberInfo',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-number-info'
    },
    total: {
      type: Number,
      required: true
    },
    subTotal: {
      type: Number,
      required: true
    },
    subTitle: {
      type: [String, Function],
      default: ''
    },
    status: {
      type: String,
      default: 'up'
    }
  },
  components: {
    Icon
  },
  data () {
    return {}
  }
}
</script>
