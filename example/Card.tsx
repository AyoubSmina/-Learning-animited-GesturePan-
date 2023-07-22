import {Text} from 'react-native'
import {StyleSheet, View} from 'react-native'
import {FlatList, Gesture, GestureDetector} from 'react-native-gesture-handler'
import Animated, {
   Extrapolate,
   interpolate,
   runOnJS,
   useAnimatedStyle,
   useDerivedValue,
   useSharedValue,
   withSpring,
   withTiming,
} from 'react-native-reanimated'
import 'react-native-gesture-handler'
import Item from './Item'
import {useEffect, useState} from 'react'
import {Button} from '../../../src/components'

const defdata = [
   {color: '#efb7ad', text: 'Notes'},
   {color: '#e867a2', text: 'Camera'},
   {color: '#8f91e5', text: 'Netflix'},
   {color: '#96E6B3', text: 'Games'},
   {color: '#F2E94E', text: 'Store'},
]

export default function Card() {
   const pointerSharedValue = useSharedValue(1)
   const absoluteX = useSharedValue(0)
   const absoluteY = useSharedValue(0)
   const [data, setData] = useState(defdata)
   const displyPointer = (value: number) => {
      pointerSharedValue.value = value
   }

   const RemoveDataByName = (index: number) => {
      runOnJS(setData)(data.filter((el, idx) => idx !== index))
   }

   useEffect(() => {
      console.log(data.length)
   }, [data])

   const pointerAnimeted = useAnimatedStyle(() => {
      return {
         opacity: withTiming(pointerSharedValue.value ? 1 : 0, {duration: 100}),
         left: withTiming(absoluteX.value - 10, {duration: 44}),
         top: withTiming(absoluteY.value - 10, {duration: 44}),
      }
   })

   const gesture = Gesture.Pan()
      .onStart(() => {})
      .onChange(el => {
         absoluteX.value = el.absoluteX
         absoluteY.value = el.absoluteY
      })
      .onBegin(el => {
         absoluteX.value = el.absoluteX
         absoluteY.value = el.absoluteY
         runOnJS(displyPointer)(1)
      })
      .onFinalize(() => {
         runOnJS(displyPointer)(0)
      })
      .onEnd(() => {})

   return (
      <GestureDetector gesture={gesture}>
         <Animated.View style={styles.container}>
            {data.map(({color, text}, idx) => (
               <Item
                  color={color}
                  text={text}
                  key={idx}
                  idx={idx}
                  len={data.length}
                  RemoveDataByName={RemoveDataByName}
               />
            ))}
            <Animated.View style={[styles.pointer, pointerAnimeted]} />
            <Button
               onPress={() => {
                  setData(defdata)
               }}
               style={{
                  position: 'absolute',
                  width: '100%',
                  height: 44,
                  bottom: 0,
               }}
               variant="blue">
               reset Data
            </Button>
         </Animated.View>
      </GestureDetector>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
   },
   pointer: {
      width: 20,
      height: 20,
      top: 0,
      left: 0,
      backgroundColor: '#ED841B',
      borderRadius: 100,
      position: 'absolute',
      zIndex: 100,
   },
})
