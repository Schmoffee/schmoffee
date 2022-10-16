import { useNavigation } from '@react-navigation/native'
import React, { useContext, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { CONST_SCREEN_HOME, CONST_SCREEN_RATING_PAGE } from '../../../../constants'
import { Body } from '../../../../typography'
import { CustomModal } from '../../../components/CustomModal'
import { PageLayout } from '../../../components/Layouts/PageLayout'
import { TrackOrderContext } from '../../../contexts'
import { TrackOrderRoutes } from '../../../utils/types/navigation.types'


export const OrderPage = () => {
    const navigation = useNavigation<TrackOrderRoutes>()
    const { track_order_state } = useContext(TrackOrderContext)

    const [showSuccessModal, setShowSuccessModal] = useState(true)
    const [showRejectionModal, setShowRejectionModal] = useState(false)


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
            <View style={styles.container}>
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
})


