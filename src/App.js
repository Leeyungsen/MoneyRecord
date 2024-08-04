import { ScrollView, SafeAreaView } from 'react-native'
import React from 'react'
import Main from './pages/Main'

const App = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        <Main />
      </ScrollView>
    </SafeAreaView>
  )
}

export default App;