/**
 * 简化表单验证配置的工具函数
 */

//demo数据
// let obj = {
//   pass: {
//       type: /^\d+$/,
//       eMsg: '年龄3不能为空',
//       iMsg: '年龄2输入格式有误'
//     },
//   checkPass: {
//       type: /^\d+$/,
//       eMsg: '年龄1不能为空',
//       iMsg: '年龄2输入格式有误'
//     },
//   age: {
//       type: /^\d+$/,
//       eMsg: '年龄不能为空',
//       iMsg: '年龄输入格式有误'
//     }
//
// }

const validate = (rule, value, callback)=>{
	let {
  			type,
        eMsg,
        iMsg
  } = rule;

	if (!value) {
    return callback(new Error(eMsg || '该字段不能为空'));
  }else{
		if(type && type instanceof RegExp && !type.test(value)){
    	 callback(new Error(iMsg || '该字段格式有误'));
    }else{
    	callback();
    }
  }
}

export const mapValidate =  (vConfig) =>{
  let cConfigArr = Object.keys(vConfig);
  let tmpConfig = {};
  cConfigArr.map(item=>{
    let originRule = vConfig[item];
    !originRule.validator && (originRule.validator = validate);//如果没有指定特定的验证方式，则使用默认方式
    tmpConfig[item] = [originRule]
  });

  return tmpConfig;
}
