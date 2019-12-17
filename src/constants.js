exports.INJECT_FILES = ['package.json'];

const projectTypes = {
  'vue-cli': 'direct:https://github.com/quanzaiyu/easy-vue-cli-scaffold.git',
  'uniapp': 'direct:https://github.com/quanzaiyu/easy-uniapp-scaffold.git',
  'react-native': 'direct:https://github.com/quanzaiyu/easy-react-native-scaffold.git',
  'flutter': 'direct:https://github.com/quanzaiyu/easy-flutter-scaffold.git'
}

let projectTypesArr = []
for (const type in projectTypes) {
  projectTypesArr.push(type)
}

exports.projectTypes = projectTypes
exports.projectTypesArr = projectTypesArr
