import {Text, View} from 'react-native'
import Animated, {runOnJS, runOnUI} from 'react-native-reanimated'
import {Gesture} from 'react-native-gesture-handler'
import {GestureDetector} from 'react-native-gesture-handler'
import {
   useAnimatedStyle,
   useSharedValue,
   withSpring,
   withTiming,
} from 'react-native-reanimated'
import {useEffect} from 'react'

export default function Item({
   color,
   text,
   idx,
   len,
   RemoveDataByName,
}: {
   color: string
   text: string
   idx: number
   len: number
   RemoveDataByName(index: number): void
}) {
   const focusOn = useSharedValue(0)
   const scaleOn = useSharedValue(1)
   const rotateState = useSharedValue(0)
   const scrolUp = useSharedValue(0)

   useEffect(() => {
      focusOn.value = withSpring(1, {damping: 20})
   })

   const resut = () => {
      focusOn.value = withSpring(1, {damping: 20})
      rotateState.value = 0
   }

   const gesture = Gesture.Pan()
      .onBegin(() => {
         runOnJS(resut)()
      })
      .onChange(el => {
         rotateState.value = rotateState.value + (el.changeX / Math.PI) * 0.4
         scrolUp.value = scrolUp.value + (el.changeY / Math.PI) * 0.5
      })
      .onTouchesDown(() => {
         focusOn.value = withSpring(1.2)
         scaleOn.value = withTiming(1.05)
      })
      .onTouchesUp(() => {
         scrolUp.value = withSpring(0, {restSpeedThreshold: 100, mass: 0.5})
         if (Math.abs(rotateState.value) > 10) {
            runOnJS(RemoveDataByName)(idx)
            runOnJS(resut)()
            return
         }
         focusOn.value = withSpring(1)
         scaleOn.value = withTiming(1)
      })
      .onEnd(() => {
         rotateState.value = withSpring(0, {
            damping: 10,
            restSpeedThreshold: 10,
         })
      })

   const animatedValue = useAnimatedStyle(() => ({
      zIndex: focusOn.value > 1 ? 100 : len - idx,
      opacity: 1 - Math.abs((rotateState.value / Math.PI) * 0.05),
      transform: [
         {
            scale: scaleOn.value,
         },
         {
            translateY: idx * 10,
         },
         {
            rotateZ: `${rotateState.value * Math.PI}deg`,
         },
         {
            translateX: rotateState.value * 10,
         },
         {translateY: rotateState.value * 2},
         {
            translateY: scrolUp.value,
         },
      ],
   }))
   return (
      <GestureDetector gesture={gesture} userSelect="auto">
         <Animated.View
            style={[
               {
                  width: '66%',
                  minHeight: 250,
                  height: '50%',
                  position: 'absolute',
                  borderRadius: 8,
                  backgroundColor: color,
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: len - idx,
                  shadowColor: color,
                  elevation: 9,
               },
               animatedValue,
            ]}>
            <Text>{text}</Text>
         </Animated.View>
      </GestureDetector>
   )
}
