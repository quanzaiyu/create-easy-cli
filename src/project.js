const inquirer = require('inquirer');
const fse = require('fs-extra');
const download = require('download-git-repo');
const { INJECT_FILES, projectTypesArr, projectTypes } = require('./constants');
const chalk = require('chalk');
const ora = require('ora');
const path = require('path');
const memFs = require('mem-fs');
const editor = require('mem-fs-editor');
const { getDirFileName } = require('./utils');
const { exec } = require('child_process');

function Project(options) {
  this.config = {
    projectName: '', // 项目名
    description: '', // 描述
    packageTool: '', // 包管理工具
    projectType: '', // 项目类型
    ...options
  }
  const store = memFs.create();
  this.memFsEditor = editor.create(store);
}

// 创建项目
Project.prototype.create = function() {
  this.inquire()
    .then((answer) => {
      this.config = {...this.config, ...answer};
      this.generate();
    });
};

// 询问项目配置
Project.prototype.inquire = function() {
  const prompts = [];
  const { projectName, description } = this.config;

  if (typeof projectName !== 'string') {
    prompts.push({
      type: 'input',
      name: 'projectName',
      default: 'easy-project',
      message: '请输入项目名',
      validate(input) {
        if (!input) {
          return '项目名不能为空';
        }
        if (fse.existsSync(input)) {
          return '当前目录已存在同名项目，请更换项目名';
        }
        return true;
      }
    });
  } else if (fse.existsSync(projectName)) {
    prompts.push({
      type: 'input',
      name: 'projectName',
      default: 'easy-project',
      message: '当前目录已存在同名项目，请更换项目名',
      validate(input) {
        if (!input) {
          return '项目名不能为空';
        }
        if (fse.existsSync(input)) {
          return '当前目录已存在同名项目，请更换项目名';
        }
        return true;
      }
    });
  }

  if (typeof description !== 'string') {
    prompts.push({
      type: 'input',
      name: 'description',
      default: 'easy-project description',
      message: '请输入项目描述'
    });
  }

  prompts.push({
    type: 'rawlist',
    name: 'projectType',
    message: '请选择项目类型',
    choices: projectTypesArr
  });

  prompts.push({
    type: 'rawlist',
    name: 'packageTool',
    message: '请选择你要使用的包管理工具',
    choices: ['yarn', 'npm']
  });

  return inquirer.prompt(prompts);
};

/**
 * 模板替换
 * @param {string} source 源文件路径
 * @param {string} dest 目标文件路径
 * @param {object} data 替换文本字段
 */
Project.prototype.injectTemplate = function(source, dest, data) {
  this.memFsEditor.copyTpl(
    source,
    dest,
    data
  );
}

Project.prototype.generate = function() {
  const { projectName, description } = this.config;
  const projectPath = path.join(process.cwd(), projectName);
  const downloadPath = path.join(projectPath, '__download__');

  const downloadSpinner = ora('正在下载模板，请稍等...');
  downloadSpinner.start();

  if (!projectTypes[this.config.projectType]) {
    downloadSpinner.fail('项目不存在');
    return
  }

  // 下载git repo
  download(projectTypes[this.config.projectType], downloadPath, { clone: true }, (err) => {
    if (err) {
      downloadSpinner.color = 'red';
      downloadSpinner.fail(err.message);
      return;
    }

    downloadSpinner.color = 'green';
    downloadSpinner.succeed('下载成功');

    // 复制文件
    console.log();
    const copyFiles = getDirFileName(downloadPath);

    copyFiles.forEach((file) => {
      fse.copySync(path.join(downloadPath, file), path.join(projectPath, file));
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建: ${projectName}/${file}`)}`);
    });

    INJECT_FILES.forEach((file) => {
      this.injectTemplate(path.join(downloadPath, file), path.join(projectName, file), {
        projectName,
        description
      });
    });

    this.memFsEditor.commit(() => {
      INJECT_FILES.forEach((file) => {
        console.log(`${chalk.green('✔ ')}${chalk.grey(`创建: ${projectName}/${file}`)}`);
      })

      fse.remove(downloadPath);

      process.chdir(projectPath);

      // git 初始化
      console.log();
      const gitInitSpinner = ora(`cd ${chalk.green.bold(projectName)}目录, 执行 ${chalk.green.bold('git init')}`);
      gitInitSpinner.start();

      const gitInit = exec('git init');
      gitInit.on('close', (code) => {
        if (code === 0) {
          gitInitSpinner.color = 'green';
          gitInitSpinner.succeed(gitInit.stdout.read());
        } else {
          gitInitSpinner.color = 'red';
          gitInitSpinner.fail(gitInit.stderr.read());
        }

        // 安装依赖
        console.log();
        const installSpinner = ora(`安装项目依赖 ${chalk.green.bold(`${this.config.packageTool} install`)}, 请稍后...`);
        installSpinner.start();
        exec(`${this.config.packageTool} install`, (error, stdout, stderr) => {
          if (error) {
            installSpinner.color = 'red';
            installSpinner.fail(chalk.red('安装项目依赖失败，请自行重新安装！'));
            console.log(error);
          } else {
            installSpinner.color = 'green';
            installSpinner.succeed('安装依赖成功');
            console.log(`${stderr}${stdout}`);

            console.log();
            console.log(chalk.green('创建项目成功！😝'));
          }
        })
      })
    });
  });
}

module.exports = Project;
