const inquirer = require('inquirer');

const question = [{
  type: 'input',
  name: 'project',
  message: '请输入项目名',
  default: 'qzy-uniapp',
  filter(val) {
    return val.trim()
  },
  validate(val) {
    if (!val.length) {
      console.log('? 请输入项目名~');
      return false
    }
    return true;
  }
}, {
  type: 'input',
  name: 'author',
  message: '请输入用户名',
  default: 'quanzaiyu',
  filter(val) {
    return val.trim()
  },
  validate(val) {
    if (val.length < 2) {
      console.log(' (提示) 用户名太短, 请输入两个字及以上~');
      return false
    }
    return true;
  }
}, {
  type: 'rawlist',
  name: 'color',
  message: '请选择你喜欢的背景颜色',
  choices: ['red', 'green', 'blue']
}];

const confirms = [{
  type: 'confirm',
  name: 'confirm',
  message: '确定'
}]

module.exports = inquirer
  .prompt(question)
  .then(answers => {
    console.log('\n请确认你的输入:');
    console.log('==================');
    console.log('项目名: ' + answers.project);
    console.log('用户名: ' + answers.author);
    console.log('背景颜色: ' + answers.color);
    console.log('==================\n');
    inquirer
      .prompt(confirms)
      .then(answers => {
        if (answers.confirm) {
          console.log('操作成功');
        } else {
          console.log('用户已取消');
        }
      });
  });
