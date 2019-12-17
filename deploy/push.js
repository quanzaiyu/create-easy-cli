const fs = require('fs')
const { execSync } = require('child_process')
let readline = require('readline')

// 创建readline接口实例
let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("请输入git commit: ", (answer) => {
  console.log(execSync('git add .', { encoding: 'utf-8'}))
  console.log(execSync(`git commit -am "${answer}"`, { encoding: 'utf-8'}))
  console.log(execSync('git push origin master', { encoding: 'utf-8'}))
  rl.close();
})
