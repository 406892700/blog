// 密码正则
export const password = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,18}$/;

//手机号码
export const phone = /^1[3-8]\d{9}$/;

// 邮箱
export const email = /@/;
