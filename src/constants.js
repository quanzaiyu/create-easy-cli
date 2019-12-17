exports.INJECT_FILES = ['package.json'];

const projectTypes = {
  'vue-cli': 'direct:https://github.com/quanzaiyu/easy-vue-cli-init.git',
  'uniapp': 'direct:https://github.com/quanzaiyu/easy-uniapp-init.git',
  'react-native': 'direct:https://github.com/quanzaiyu/easy-react-native-init.git',
  'flutter': 'direct:https://github.com/quanzaiyu/easy-flutter-init.git'
}

let projectTypesArr = []
for (const type in projectTypes) {
  projectTypesArr.push(type)
}

exports.projectTypes = projectTypes
exports.projectTypesArr = projectTypesArr
