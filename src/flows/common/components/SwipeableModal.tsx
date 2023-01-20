import React from 'react';
import { View, Text, Modal } from 'react-native';
import Animated, { useCode, call, set, eq, Value, useAnimatedGestureHandler } from 'react-native-reanimated'
import { PanGestureHandler } from 'react-native-gesture-handler';


interface Card {
    title: string;
    description: string;
}
interface Props {
    cards?: Card[];
    visible?: boolean;
    onDismiss?: () => void;
}

const SwipeableModal: React.FC<Props> = ({ visible, onDismiss }) => {
    const cards = [
        { title: 'hello', description: 'world' },
        { title: 'hello', description: 'world' },
        { title: 'hello', description: 'world' },
    ]
    const translateX = new Value(0);
    const gestureHandler = useAnimatedGestureHandler({
        onStart: (_, ctx) => {
            ctx.startX = translateX.value;
        },
        onActive: ({ translationX }, ctx) => {
            translateX.value = ctx.startX + translationX;
        },
        onEnd: () => {
            if (translateX.value > 100) {
                translateX.value = 0;
            }
        },
    });


    const dismiss = new Value(0);

    return (
        <Modal visible={visible} onDismiss={onDismiss}>
            <PanGestureHandler
                {...gestureHandler}
                onHandlerStateChange={({ nativeEvent: { state } }) => {
                    if (state === 5) {
                        set(dismiss, 1);
                    }
                }}
            >
                <Animated.View
                    style={{
                        transform: [{ translateX }],
                    }}
                >
                    {cards.map((card, index) =>
                        <View key={index}>
                            <Text>hello</Text>
                        </View>
                    )}
                </Animated.View>
            </PanGestureHandler>
        </Modal>
    );
};

export default SwipeableModal;
