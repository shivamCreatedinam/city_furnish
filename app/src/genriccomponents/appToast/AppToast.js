import Toast from 'react-native-simple-toast'

const TIME = 3 // 3 seconds

function AppToast(label) {
    Toast.show(label, TIME)
}

export default AppToast