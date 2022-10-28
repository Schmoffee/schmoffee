import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useContext, useMemo, useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { CONST_SCREEN_HOME, CONST_SCREEN_RATING_PAGE } from '../../../../constants'
import { Body } from '../../../../typography'
import { CustomModal } from '../../../components/CustomModal'
import { PageLayout } from '../../../components/Layouts/PageLayout'
import { TrackOrderContext } from '../../../contexts'
import { TrackOrderRoutes } from '../../../utils/types/navigation.types'
import BottomSheet from '@gorhom/bottom-sheet'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { Spacings } from '../../../../theme'


export const OrderPage = () => {
    const navigation = useNavigation<TrackOrderRoutes>()
    const { track_order_state } = useContext(TrackOrderContext)

    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showRejectionModal, setShowRejectionModal] = useState(false)



    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['20%', '50%', '90%'], []);

    // callbacks
    const handleSheetChange = useCallback((index: number) => {
        // console.log("handleSheetChange", index);
    }, []);

    const handleCollected = () => {
        if (track_order_state.current_order?.status === 'COLLECTED') {
            setShowSuccessModal(true)
        }
        navigation.navigate(CONST_SCREEN_RATING_PAGE)

    }

    const handleRejected = () => {
        if (track_order_state.current_order?.status === 'REJECTED') {
            setShowRejectionModal(true)
        }
        navigation.navigate('Coffee', { screen: CONST_SCREEN_HOME })

    }
    return (
        <PageLayout header='Your Order'
            footer={{
                buttonDisabled: false,
                onPress: () => navigation.navigate(CONST_SCREEN_RATING_PAGE),
                buttonText: 'Finish Order'
            }}
        >
            <View style={styles.bottomSheetContainer}>
                <BottomSheet
                    ref={bottomSheetRef}
                    snapPoints={snapPoints}
                    onChange={handleSheetChange}
                    index={1}>
                    <Body size="large" weight="Bold" color={Colors.darkBrown2} style={styles.bottomSheetHeader}>
                        Order details
                    </Body>
                    <View style={styles.orderDetailsContainer}>
                        <Body size='large' weight='Bold' style={styles.text}>
                            Order ID: {track_order_state.current_order?.id}
                        </Body>
                        <Body size='large' weight='Bold' style={styles.text}>
                            Order Status: {track_order_state.current_order?.status}
                        </Body>
                        <Body size='large' weight='Bold' style={styles.text}>
                            Order Total: {track_order_state.current_order?.total}
                        </Body>
                    </View>
                    <View style={styles.orderItemsContainer}>
                        <Body size='large' weight='Bold' style={styles.text}>
                            Order Items
                        </Body>
                        <View style={styles.orderItems}>
                            {track_order_state.current_order?.items?.map((item: any, index: number) => {
                                return (
                                    <View key={index} style={styles.orderItem}>
                                        <Body size='large' weight='Regular' style={styles.text}>
                                            {item.name}
                                        </Body>
                                        <Body size='large' weight='Regular' style={styles.text}>
                                            {item.options}
                                        </Body>
                                        <Body size='large' weight='Regular' style={styles.text}>
                                            {item.quantity}
                                        </Body>
                                        <Body size='large' weight='Regular' style={styles.text}>
                                            {item.price}
                                        </Body>
                                    </View>
                                )
                            })}
                        </View>
                    </View>
                </BottomSheet>
            </View>
            <CustomModal
                onDismiss={handleCollected}
                visible={showSuccessModal} setVisible={setShowSuccessModal} type='success' title='Order Collected' message='Your order has been collected' />
            <CustomModal
                onDismiss={handleRejected}
                visible={showRejectionModal} setVisible={setShowRejectionModal} type='error' title='Order Rejected' message='Your order has been rejected' />
        </PageLayout>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    orderDetailsContainer: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    text: {
        marginBottom: 10,
    },
    orderItemsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    orderItems: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    orderItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    bottomSheetContainer: {
        height: '100%',
        elevation: 200,
        zIndex: 100,
        position: 'absolute',
        width: '100%',
        bottom: -35,

    },
    bottomSheetHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: Spacings.s7,
        // marginTop: Spacings.s10,
    },

    bottomSheetHeader: {
        marginTop: Spacings.s5,
        alignSelf: 'center',
        fontSize: 25,
    },
    bottomSheetHandleContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    bottomSheetHandle: {
        width: 20,
        height: 20,
        borderRadius: 2.5,
        backgroundColor: Colors.brown2,
        marginTop: Spacings.s5,
        marginRight: Spacings.s5,
    },

})


