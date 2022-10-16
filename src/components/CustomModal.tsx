import React from "react"
import { StyleSheet, Text, View, Modal, Pressable } from "react-native"
import { Colors } from "react-native/Libraries/NewAppScreen"
import { Spacings } from "../../theme"
import { Heading, Body } from "../../typography"

interface ModalProps {
    visible: boolean
    setVisible: (value: boolean) => void
    type: "success" | "error"
    title: string
    message: string
    onDismiss?: () => void

}

export const CustomModal = (props: ModalProps) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.visible}
            onRequestClose={() => {
                props.setVisible(!props.visible)
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.modalHeader}>
                        <Heading size="default" weight="Bold" color={Colors.black}>
                            {props.title}
                        </Heading>
                    </View>

                    <View style={styles.modalBody}>
                        <Body size="default" weight="Regular" color={Colors.black}>
                            {props.message}
                        </Body>
                    </View>

                    <View style={styles.modalFooter}>
                        <Pressable

                            style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                                props.setVisible(!props.visible)
                                props.onDismiss && props.onDismiss()
                            }}
                        >
                            <Text style={styles.textStyle}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>

    )
}


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButton: {
        height: 30,
        width: 30,
        backgroundColor: Colors.red,
    },
    modalFooter: {
        marginTop: Spacings.s6,
        width: 200,
    },
    modalHeader: {
        width: '100%',
        alignItems: 'center',
        marginBottom: Spacings.s4,
    },
    modalBody: {
        width: '100%',
        alignItems: 'center',
        marginBottom: Spacings.s4,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: Colors.red,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },

})
