import React from 'react'
import { Pressable } from 'react-native'
import { PageLayout } from '../../../components/Layouts/PageLayout'
import { useNavigation } from '@react-navigation/native'

export const ChangePayment = () => {
    const navigation = useNavigation()
    return (
        <Pressable onPress={() => navigation.goBack()}>
            <PageLayout header={'Change Payment'} />
        </Pressable>
    )
}
