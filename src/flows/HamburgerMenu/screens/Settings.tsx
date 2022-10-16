import React from 'react'
import { Pressable } from 'react-native'
import { PageLayout } from '../../../components/Layouts/PageLayout'
import { useNavigation } from '@react-navigation/native'

const Settings = () => {
    const navigation = useNavigation()
    return (
        <Pressable onPress={() => navigation.goBack()}>
            <PageLayout header={'Settings'} />
        </Pressable>
    )
}

export default Settings