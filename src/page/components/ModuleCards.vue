<template>
  <el-row :gutter="8">
    <el-col :span="8">
        <el-card :body-style="{ padding: '0px' }" class="module-cards" @click.native="handleClick('/questionnaire')" shadow="hover">
          <img src="@/assets/images/products-lg-questionnaire.png" style="width: 100%;">
          <div>
            <strong>问卷系统</strong>
            <div v-if="details" class="details">
              通过填写问卷来赚取闲钱币！
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px' }" class="module-cards" @click.native="handleClick('/errand')" shadow="hover">
          <img src="@/assets/images/delivery_779px_1229802_easyicon.net.png" style="width: 100%; padding: 10px;">
          <div>
            <strong>跑腿办事</strong>
            <div v-if="details" class="details">
              您办事，我跑腿
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px' }" class="module-cards" shadow="hover" @click.native="handleClick('/balance')">
          <img src="@/assets/images/coins_782px_1227591_easyicon.net.png" style="width: 100%; padding: 10px;">
          <div>
            <strong>闲钱币</strong>
            <div v-if="details" class="details">
              闲钱币提现和充值
            </div>
          </div>
        </el-card>
      </el-col>
  </el-row>
</template>

<script>
export default {
  methods: {
    handleClick (routePath) {
      this.$router.push(routePath)
    }
  },
  props: ['details']
}
</script>

<style lang="scss" scoped>
.module-cards {
  padding: 4px;
  cursor: pointer;
  text-align: center;
}
.details {
  font-size: 12px;
}
</style>
