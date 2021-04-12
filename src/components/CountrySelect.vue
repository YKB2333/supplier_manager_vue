<template>
  <el-select v-model="selectVal" placeholder="请选择" filterable :disabled="disabled" @change="onChange">
    <el-option
      v-for="item in countryList"
      :key="item.label"
      :label="item.label"
      :value="item.label">
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'CountrySelect',
  props: { 
    value: {
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      countryList: [
        {value: "CN", label: "中国"},
        {value: "JP", label: "日本"},   
        {value: "KR", label: "韩国"},   
        {value: "FR", label: "法国"},   
        {value: "AO", label: "安哥拉"},
        {value: "AF", label: "阿富汗"},   
        {value: "AL", label: "阿尔巴尼亚"},   
        {value: "DZ", label: "阿尔及利亚"},   
        {value: "AD", label: "安道尔共和国"},   
        {value: "AI", label: "安圭拉岛"},   
        {value: "AG", label: "安提瓜和巴布达"},
        {value: "AR", label: "阿根廷"},   
        {value: "AM", label: "亚美尼亚"},   
        {value: "AU", label: "澳大利亚"},   
        {value: "AT", label: "奥地利"},   
        {value: "AZ", label: "阿塞拜疆"},   
        {value: "BS", label: "巴哈马"},   
        {value: "BH", label: "巴林"},   
        {value: "BD", label: "孟加拉国"},   
        {value: "BB", label: "巴巴多斯"},   
        {value: "BY", label: "白俄罗斯"},   
        {value: "BE", label: "比利时"},   
        {value: "BZ", label: "伯利兹"},   
        {value: "BJ", label: "贝宁"},   
        {value: "BM", label: "百慕大群岛"},   
        {value: "BO", label: "玻利维亚"},   
        {value: "BW", label: "博茨瓦纳"},   
        {value: "BR", label: "巴西"},   
        {value: "BN", label: "文莱"},   
        {value: "BG", label: "保加利亚"},   
        {value: "BF", label: "布基纳法索"},   
        {value: "MM", label: "缅甸"},   
        {value: "BI", label: "布隆迪"},   
        {value: "CM", label: "喀麦隆"},   
        {value: "CA", label: "加拿大"},
        {value: "CF", label: "中非共和国"},
        {value: "TD", label: "乍得"},
        {value: "CL", label: "智利"},
        {value: "CO", label: "哥伦比亚"},   
        {value: "CG", label: "刚果"},   
        {value: "CK", label: "库克群岛"},   
        {value: "CR", label: "哥斯达黎加"},   
        {value: "CU", label: "古巴"},   
        {value: "CY", label: "塞浦路斯"},   
        {value: "CZ", label: "捷克"},   
        {value: "DK", label: "丹麦"},   
        {value: "DJ", label: "吉布提"},   
        {value: "DO", label: "多米尼加共和国"},   
        {value: "EC", label: "厄瓜多尔"},   
        {value: "EG", label: "埃及"},   
        {value: "SV", label: "萨尔瓦多"},   
        {value: "EE", label: "爱沙尼亚"},   
        {value: "ET", label: "埃塞俄比亚"},   
        {value: "FJ", label: "斐济"},   
        {value: "FI", label: "芬兰"},   
        {value: "GF", label: "法属圭亚那"},   
        {value: "GA", label: "加蓬"},   
        {value: "GM", label: "冈比亚"},   
        {value: "GE", label: "格鲁吉亚"},   
        {value: "DE", label: "德国"},   
        {value: "GH", label: "加纳"},   
        {value: "GI", label: "直布罗陀"},   
        {value: "GR", label: "希腊"},   
        {value: "GD", label: "格林纳达"},   
        {value: "GU", label: "关岛"},   
        // {value: "TW", label: "台湾省"},   // 台湾是中国的一部分，有一个中国的选项就够了
        {value: "GT", label: "危地马拉"},   
        {value: "GN", label: "几内亚"},   
        {value: "GY", label: "圭亚那"},   
        {value: "HT", label: "海地"},   
        {value: "HN", label: "洪都拉斯"},   
        {value: "HU", label: "匈牙利"},   
        {value: "IS", label: "冰岛"},   
        {value: "IN", label: "印度"},   
        {value: "ID", label: "印度尼西亚"},   
        {value: "IR", label: "伊朗"},   
        {value: "IQ", label: "伊拉克"},   
        {value: "IE", label: "爱尔兰"},   
        {value: "IL", label: "以色列"},   
        {value: "IT", label: "意大利"},   
        {value: "JM", label: "牙买加"},   
        {value: "JO", label: "约旦"},   
        {value: "KH", label: "柬埔寨"},   
        {value: "KZ", label: "哈萨克斯坦"},   
        {value: "KE", label: "肯尼亚"},   
        {value: "KW", label: "科威特"},   
        {value: "KG", label: "吉尔吉斯坦"},   
        {value: "LA", label: "老挝"},   
        {value: "LV", label: "拉脱维亚"},   
        {value: "LB", label: "黎巴嫩"},   
        {value: "LS", label: "莱索托"},   
        {value: "LR", label: "利比里亚"},   
        {value: "LY", label: "利比亚"},   
        {value: "LI", label: "列支敦士登"},   
        {value: "LT", label: "立陶宛"},   
        {value: "LU", label: "卢森堡"},   
        {value: "MO", label: "澳门"},   
        {value: "MG", label: "马达加斯加"},   
        {value: "MW", label: "马拉维"},   
        {value: "MY", label: "马来西亚"},   
        {value: "MV", label: "马尔代夫"},   
        {value: "ML", label: "马里"},   
        {value: "MT", label: "马耳他"},   
        {value: "MU", label: "毛里求斯"},   
        {value: "MX", label: "墨西哥"},   
        {value: "MD", label: "摩尔多瓦"},   
        {value: "MC", label: "摩纳哥"},   
        {value: "MN", label: "蒙古"},   
        {value: "MS", label: "蒙特塞拉特岛"},   
        {value: "MA", label: "摩洛哥"},   
        {value: "MZ", label: "莫桑比克"},   
        {value: "NA", label: "纳米比亚"},   
        {value: "NR", label: "瑙鲁"},   
        {value: "NP", label: "尼泊尔"},   
        {value: "NL", label: "荷兰"},   
        {value: "NZ", label: "新西兰"},   
        {value: "NI", label: "尼加拉瓜"},   
        {value: "NE", label: "尼日尔"},   
        {value: "NG", label: "尼日利亚"},   
        {value: "KP", label: "朝鲜"},   
        {value: "NO", label: "挪威"},   
        {value: "OM", label: "阿曼"},   
        {value: "PK", label: "巴基斯坦"},   
        {value: "PA", label: "巴拿马"},   
        {value: "PG", label: "巴布亚新几内亚"},   
        {value: "PY", label: "巴拉圭"},   
        {value: "PE", label: "秘鲁"},   
        {value: "PH", label: "菲律宾"},   
        {value: "PL", label: "波兰"},   
        {value: "PF", label: "法属玻利尼西亚"},   
        {value: "PT", label: "葡萄牙"},   
        {value: "PR", label: "波多黎各"},   
        {value: "QA", label: "卡塔尔"},   
        {value: "RO", label: "罗马尼亚"},   
        {value: "RU", label: "俄罗斯"},   
        {value: "LC", label: "圣卢西亚"},   
        {value: "VC", label: "圣文森特岛"},   
        {value: "SM", label: "圣马力诺"},   
        {value: "ST", label: "圣多美和普林西比"},   
        {value: "SA", label: "沙特阿拉伯"},   
        {value: "SN", label: "塞内加尔"},   
        {value: "SC", label: "塞舌尔"},   
        {value: "SL", label: "塞拉利昂"},   
        {value: "SG", label: "新加坡"},   
        {value: "SK", label: "斯洛伐克"},   
        {value: "SI", label: "斯洛文尼亚"},   
        {value: "SB", label: "所罗门群岛"},   
        {value: "SO", label: "索马里"},   
        {value: "ZA", label: "南非"},   
        {value: "ES", label: "西班牙"},   
        {value: "LK", label: "斯里兰卡"},   
        {value: "SD", label: "苏丹"},   
        {value: "SR", label: "苏里南"},   
        {value: "SZ", label: "斯威士兰"},   
        {value: "SE", label: "瑞典"},   
        {value: "CH", label: "瑞士"},   
        {value: "SY", label: "叙利亚"},   
        {value: "TJ", label: "塔吉克斯坦"},   
        {value: "TZ", label: "坦桑尼亚"},   
        {value: "TH", label: "泰国"},   
        {value: "TG", label: "多哥"},   
        {value: "TO", label: "汤加"},   
        {value: "TT", label: "特立尼达和多巴哥"},   
        {value: "TN", label: "突尼斯"},   
        {value: "TR", label: "土耳其"},   
        {value: "TM", label: "土库曼斯坦"},   
        {value: "UG", label: "乌干达"},   
        {value: "UA", label: "乌克兰"},   
        {value: "AE", label: "阿拉伯联合酋长国"},   
        {value: "GB", label: "英国"},   
        {value: "US", label: "美国"},   
        {value: "UY", label: "乌拉圭"},   
        {value: "UZ", label: "乌兹别克斯坦"},   
        {value: "VE", label: "委内瑞拉"},   
        {value: "VN", label: "越南"},   
        {value: "YE", label: "也门"},   
        {value: "YU", label: "南斯拉夫"},   
        {value: "ZW", label: "津巴布韦"},   
        {value: "ZR", label: "扎伊尔"},   
        {value: "ZM", label: "赞比亚"}   
      ],
      selectVal: ''
    }
  },
  computed: {},
  created() {
  },
  mounted() {},
  methods: {
    onChange(val) {
      this.selectVal = val
      // console.log(val)
      this.$emit('input', val)
    }
  },
  watch: {
    value: {
      handler: function(val) {
        this.selectVal = val
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
</style>
