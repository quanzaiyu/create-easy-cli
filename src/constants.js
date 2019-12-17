exports.INJECT_FILES = ['package.json'];

const projectTypes = {
  'vue-cli': 'direct:https://github.com/quanzaiyu/vue-cli-init.git',
  'uniapp': 'direct:https://github.com/quanzaiyu/uniapp-init.git',
  'react-native': 'direct:https://github.com/quanzaiyu/react-native-init.git',
  'flutter': 'direct:https://github.com/quanzaiyu/flutter-init.git'
}

let projectTypesArr = []
for (const type in projectTypes) {
  projectTypesArr.push(type)
}

exports.projectTypes = projectTypes
exports.projectTypesArr = projectTypesArr
