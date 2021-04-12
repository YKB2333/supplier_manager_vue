const mobile = (rule, value, callback) => {
    if (!value) {
    //   return callback(new Error('手机号不能为空'));
    } else {
      const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
    //   console.log(reg.test(value));
      if (reg.test(value)) {
        callback();
      } else {
        return callback(new Error('请输入正确的手机号'));
      }
    }
  }
export { mobile }