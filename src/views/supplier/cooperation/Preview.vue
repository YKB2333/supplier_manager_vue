<template>
  <the-dialog :width="dialogWidth" :title="spuData && spuData.name" :closeOnClickModal="true" ref="dialog">
    <div class="priview-product-page">
      <!-- <el-page-header title="返回列表" @back="$router.back(-1)"></el-page-header> -->
      <!-- spu -->
      <h4>基本信息</h4>
      <div v-loading="loading">
        <el-form
          :model="spuData"
          ref="spuData"
          label-width="100px"
          size="mini">
          <div class="row max-width">
            <div class="flex-2">
              <el-form-item label="分类" prop="cateName">
                <span>{{ spuData && spuData.cateName }}</span>
              </el-form-item>
              <el-form-item label="商品名称" prop="name">
                <span>{{ spuData && spuData.name }}</span>
              </el-form-item>
              <el-form-item label="副标题" prop="title">
                <span>{{ spuData && spuData.title || '-' }}</span>
              </el-form-item>
              <el-form-item label="核心卖点描述" prop="productDescribe">
                <span>{{ spuData && spuData.productDescribe || '-' }}</span>
              </el-form-item>
              <el-form-item label="授权渠道范围" prop="scopeAuthoriza">
                <!-- <span>{{ spuData && spuData.scopeAuthoriza || '-' }}</span> -->
                <select-channel-type
                  :multiple=true
                  :disabled=true
                  v-model="spuData.scopeAuthorizas"
                />
              </el-form-item>

              <el-form-item  label="标签" prop="tag" v-if="spuData">
                <el-tag v-for="(tag, index) in spuData.tag" :key="index">{{tag}}</el-tag>
              </el-form-item>
              <el-form-item v-if="spuData" label="贸易类型">
                <el-checkbox v-model="spuData.isCrossBorderTrade" disabled>跨境贸易</el-checkbox><br />
                <el-checkbox v-model="spuData.isGeneralTrade" disabled>一般贸易</el-checkbox>
              </el-form-item>
            </div>
            <div class="flex-1">
              <el-form-item label="品牌" prop="brandId">
                <span>{{ spuData && spuData.brandName }}</span>
              </el-form-item>
              <el-form-item label="产地" prop="producePlace">
                <span>{{ spuData && spuData.producePlace || '-' }}</span>
              </el-form-item>
              <el-form-item label="保质期（天）" prop="shelfLife">
                <span>{{ spuData && spuData.shelfLife || '-' }}</span>
              </el-form-item>
              <el-form-item label="零售单位" prop="retailUnit">
                <span>{{ spuData && spuData.retailUnit || '-' }}</span>
              </el-form-item>
              <el-form-item label="分类排序" prop="cateOrder">
                <span>{{ spuData && spuData.cateOrder }}</span>
              </el-form-item>
              <el-form-item label="品牌排序" prop="brandOrder">
                <span>{{ spuData && spuData.brandOrder }}</span>
              </el-form-item>
              <el-form-item label="是否需要向品牌方授权" prop="isNeedAuthorized">
                <span v-if="spuData && spuData.isNeedAuthorized == true">是</span>
                <span v-else-if="spuData && spuData.isNeedAuthorized == false">否</span>
              </el-form-item>
              <el-form-item label="状态">
                <el-tag type="danger" v-if="spuData && spuData.isDelete">已删除</el-tag>
                <el-tag type="danger" v-else-if="spuData && !spuData.isOnSale">已下架</el-tag>
                <el-tag type="success" v-else>已发布</el-tag>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
      <!-- sku -->
      <div class="row pt10">
        <div class="fw600 fs16px h30 l-h30">属性规格</div>
        <div class="pl30">
          <!-- 主属性 -->
          <div v-if="spuData && spuData.firstAtbKey">
            <div class="row pt10 center-y" >
              <el-button type="primary" size="mini" style="margin-right: 10px;">主属性：{{ spuData.firstAtbKey }}</el-button>
            </div>
            <div class="row pt10 center-y">
              <!-- <el-button type="info" size="mini" style="margin-right: 10px;">主属性值</el-button> -->
              <el-tag class="mr10" v-for="(item, index) in firstAtbValueArr" :key="index">
                {{ item.firstAtbValue }}
              </el-tag>
            </div>
          </div>
          <!-- 辅属性 -->
          <div v-if="spuData && spuData.secondAtbKey">
            <div class="row pt10">
              <el-button type="primary" size="mini" style="margin-right: 10px;">副属性：{{ spuData.secondAtbKey }}</el-button>
              <!-- <span>{{ spuData.secondAtbKey }}</span> -->
            </div>
            <div class="row pt10">
              <!-- <el-button type="info" size="mini" style="margin-right: 10px;">副属性值</el-button> -->
              <el-tag class="mr10" v-for="(item, index) in secondAtbValueArr" :key="index">{{ item.secondAtbValue }}</el-tag>
            </div>
          </div>
        </div>
      </div>
      <!-- sku列表 -->
      <div class="row fs13 mt20" style="overflow-x: auto;">
        <el-card v-for="(item, index) in skuList" :key="index" class="sku-form-wrapper">
          <div slot="header">
            <div class="row center-y" v-if="spuData && spuData.firstAtbKey">
              <el-tag>{{ spuData && spuData.firstAtbKey }}</el-tag>
              <span class="pl6">{{ item.firstAtbValue }}</span>
            </div>
            <div class="row center-y mt10" v-if="spuData && spuData.secondAtbKey">
              <el-tag>{{ spuData && spuData.secondAtbKey }}</el-tag>
              <span class="pl6">{{ item.secondAtbValue }}</span>
            </div>
          </div>
          <div>
            <el-form label-width="140px">
              <el-form-item label="规格编码">
                <span>{{ item.skuSn }}</span>
              </el-form-item>
              <el-form-item label="商品助记码（屈臣氏商品必填）">
                <span>{{ item.mnemonicCode }}</span>
              </el-form-item>
              <el-form-item label="商品条码">
                <span>{{ item.codeBar }}</span>
              </el-form-item>
              <el-form-item label="建议零售价">
                <span>{{ item.msrp }}</span>
              </el-form-item>
              <el-form-item label="库存">
                <span>{{ item.stock }}</span>
              </el-form-item>
              <el-form-item label="箱规">
                <span>{{ item.wholesaleSpec }}</span>
              </el-form-item>
              <el-form-item label="零售起订量（零售单位）">
                <span>{{ item.retailMinOrder }}</span>
              </el-form-item>
              <el-form-item label="批发起订量（箱）">
                <span>{{ item.wholesaleMinOrder }}</span>
              </el-form-item>
              <el-form-item label="长(mm)">
                <span>{{ item.skuLength }}</span>
              </el-form-item>
              <el-form-item label="宽(mm)">
                <span>{{ item.skuWeight }}</span>
              </el-form-item>
              <el-form-item label="高(mm)">
                <span>{{ item.skuHeight }}</span>
              </el-form-item>
              <el-form-item label="外箱规格长(mm)">
                <span>{{ item.longCartonSize }}</span>
              </el-form-item>
              <el-form-item label="外箱规格宽(mm)">
                <span>{{ item.widthCartonSize }}</span>
              </el-form-item>
              <el-form-item label="外箱规格高(mm)">
                <span>{{ item.highCartonSize }}</span>
              </el-form-item>
              <el-form-item label="外箱体积（立方米）">
                <span>{{ item.cartonVolum }}</span>
              </el-form-item>
              <el-form-item label="单品体积（立方米）">
                <span>{{ item.unitvolume }}</span>
              </el-form-item>
              <el-form-item label="单品重量（KG）">
                <span>{{ item.skuScale }}</span>
              </el-form-item>
              <el-form-item label="分销价(一般合作)">
                <span>{{ item.distributionPrice }}</span>
              </el-form-item>
              <el-form-item label="分销价(战略合作)">
                <span>{{ item.distributionPriceStrategy }}</span>
              </el-form-item>
              <el-form-item label="最低控价">
                <span>{{ item.minPrice }}</span>
              </el-form-item>
              <el-form-item label="一件代发价(一般合作)">
                <span>{{ item.dropShippingPrice }}</span>
              </el-form-item>
              <el-form-item label="一件代发价(战略合作)">
                <span>{{ item.dropShippingPriceStrategy }}</span>
              </el-form-item>
              <el-form-item label="代发费用">
                <span>{{ item.dropShippingExpense }}</span>
              </el-form-item>
              <el-form-item label="合作状态" v-if="item.workStatus">
                <el-tag size="mini">{{ item.workStatus }}</el-tag>
              </el-form-item>
              <el-form-item label="所属部门（屈臣氏商品必填）" prop="department">
                <span>{{ item.departmentName }}</span>
              </el-form-item>
              <el-form-item label="状态">
                <el-tag type="danger" size="mini" v-if="item.isOnSale">已上架</el-tag>
                <el-tag type="success" size="mini" v-else>已下架</el-tag>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </div>
      <!-- 商品图 -->
      <div class="row pt20 pl20 pb80" style="min-height: 280px;">
        <el-radio-group v-model="colRadio" class="col col-radio-box" @change="onColRadioChange">
          <el-radio-button label="spu">商品款图</el-radio-button>
          <el-radio-button v-for="item in skuList" :key="item.id" :label="item.id">{{ item.firstAtbValue }}<span v-if="item.secondAtbValue">：{{ item.secondAtbValue }}</span></el-radio-button>
        </el-radio-group>
        <div class="pl20">
          <el-radio-group v-model="rowRadio" @change="onRowRadioChange">
            <el-radio-button label="1">商品展示图</el-radio-button>
            <el-radio-button label="2">商品详情图</el-radio-button>
          </el-radio-group>
          <div>
            <!-- http://zs-oa.oss-cn-shenzhen.aliyuncs.com/zsoa/goods/20190813/4903367000019/358737137489022976.png -->
            <el-image v-for="(item, index) in fileList" :key="index" fit="contain"
              style="width: 100px; height: 140px; margin: 20px 20px 20px 0;"
              :src="item.url"
              :preview-src-list="previewSrcList"
            />
          </div>
        </div>
      </div>
      <div v-if="videoList.length>0 && videoList[0].attaUrl" class="row pl20">视频：
        <video style="width:560px;"  :src="videoList[0].attaUrl" class="avatar" controls="controls">您的浏览器不支持视频播放</video>
      </div>
    </div>
  </the-dialog>
</template>

<script>
import { uniqueArrByKey, isEmpty, deepClone } from '@/utils'
/*import { getOAThreeSub } from '@/api/client'*/
import TheDialog from '@/components/TheDialog'
import SelectChannelType from '@/components/SelectChannelType'

export default {
  name: 'ProductMaintainingPreview',
  title: '商品查看',
  components: { TheDialog, SelectChannelType },
  props: {
    dialogWidth: {
      type: String,
      default: '50%'
    }
  },
  data() {
    return {
      spuId: null,
      spuData: {},
      skuList: [],
      videoList:[],
      firstAtbValueArr: [], // 主属性值数组
      secondAtbValueArr: [], // 辅属性值数组
      colRadio: 'spu', // 侧边栏当前按钮，默认spu
      rowRadio: '1', // 横向切换按钮，默认商品展示图(1商品展示图, 2商品详情图)
      currentImageList: [],
      loading: false,
      departments:[],//所属公司
      danweis:[], //计量单位
      defaultParams: {
        checkStrictly:true,
        label: '_fullname',
        value: '_departmentid',
        children: 'departmentBeanList'
      },
    }
  },
  computed: {
    fileList() {
      let arr = this.currentImageList.filter(item => {
        return item.imageType === this.rowRadio
      })
      arr.forEach(item => {
        item['name'] = item.id
        item['url'] = item.imagePath
      })
      return arr
    },
    previewSrcList() {
      let srcs = this.fileList.map(item => item.url)
      return srcs
    }
  },
  created() {
    // this.spuId = Number(this.$route.query.id)
    // this.init()
  },
  mounted() {},
  methods: {
    async init(id,skuId) {
      try {
        this.show()
        this.spuId = id
        this.loading = true
        await this.$get(`/goods/spu/getOne/${this.spuId}`)
        .then((res) => {
          console.log('spu=>')
          this.spuData = res
          if(this.spuData.scopeAuthoriza){
            this.spuData['scopeAuthorizas'] = this.spuData.scopeAuthoriza.split(',')
          }else{
            this.spuData['scopeAuthorizas'] = []
          }
          console.log(this.spuData)
        })

        let query = {
          ids: [],
          pageIndex: 1,
          pageSize: this.$maxNumber,
          isDelete: false
        }
        query.ids.push(skuId)
        if(this.spuData.isFiled) {
          query['isFiled'] = true
        }
        this.$post('/goods/sku/getSkuPager', query).then(res => {
          console.log('sku=>')
          console.log(res.list)
          this.skuList = res.list
          this.skuList.forEach(sku => {
            if(sku.departmentCode){
              sku['departmentIds'] = sku.departmentCode.split('-')
            }
          })
          this.initAtbValueArr()
        })
        this.fetchImagesPager('spu', this.spuId)
        this.fetchVideoPager()
      } finally {
        this.loading = false
      }
    },
    // 属性值列表（主、辅）
    initAtbValueArr() {
      let firstAtbValueArr = this.getUniqueAtbList('first')
      let secondAtbValueArr = this.getUniqueAtbList('second')
      this.firstAtbValueArr = firstAtbValueArr.filter(item => {
        return !isEmpty(item.firstAtbValue)
      })
      this.secondAtbValueArr = secondAtbValueArr.filter(item => {
        return !isEmpty(item.secondAtbValue)
      })
      // console.log('主属性值列表', this.firstAtbValueArr)
      // console.log('辅属性值列表', this.secondAtbValueArr)
    },
    // 属性值去重后的数组
    getUniqueAtbList(type) {
      if (type === 'first') {
        // let filter = this.skuList.filter(item => {
        //   return item.firstAtbKey === this.spuData.firstAtbKey
        // })
        // 属性值去重
        return uniqueArrByKey(this.skuList, 'firstAtbValue')
      } else if (type === 'second') {
        // let filter = this.skuList.filter(item => {
        //   return item.secondAtbKey === this.spuData.secondAtbKey
        // })
        // 属性值去重
        return uniqueArrByKey(this.skuList, 'secondAtbValue')
      }
    },
    // 获取视频列表
    fetchVideoPager(){
      this.$get(`/goods/video/videoAttaList/${this.spuId}`)
        .then((res) => {
          console.log('视频',res);
          this.videoList = res
        })
    },
    // 获取图片列表
    fetchImagesPager(type, id) { // type:'spu/sku', id:skuId,spuId
      return new Promise((resolve, reject) => {
        let params = {
          pageIndex: 1,
          pageSize: 1000
        }
        if (type === 'spu') {
          params['spuId'] = id
        } else if (type === 'sku') {
          params['skuId'] = id
        }
        this.$post('/goods/images/getImagesPager', params)
        .then(res => {
          // console.log(res)
          this.currentImageList = res.list
          resolve(res.list)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 侧边切换时
    async onColRadioChange(id) {
      // console.log(id)
      // this.colRadio = id
      this.$store.commit('SHOW_LOADING')
      if (id === 'spu') {
        await this.fetchImagesPager('spu', this.spuId)
      } else {
        await this.fetchImagesPager('sku', id)
      }
      this.$store.commit('SHOW_LOADING', false)
    },
    onRowRadioChange(imagesType) {
      // this.rowRadio = imagesType
    },
    show() {
      this.$refs['dialog'].show()
    }
  },
  watch: {
  }
}
</script>

<style lang="scss" scoped>
.max-width{
  max-width: 1000px;
}
.sku-form-wrapper{
  width: 340px;
  min-width: 320px;
  margin-right: 20px;
  /deep/ .el-card__body{
    padding: 10px;
  }
  /deep/ .el-form-item{
    margin-bottom: 0;
  }
}
</style>
<style lang="scss">
.priview-product-page{
  .el-textarea__inner{
    height: 120px;
  }
  .tag-textarea .el-textarea__inner{
    height: 70px;
  }
  .col-radio-box{
    .el-radio-button__inner{
      width: 100px;
      white-space: pre-wrap;
    }
  }
}
</style>
