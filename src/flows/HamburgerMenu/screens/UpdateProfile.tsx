import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import FormField from '../../../components/FormField';
import { PageLayout } from '../../../components/Layouts/PageLayout';
import { GlobalContext } from '../../../contexts';



const UpdateProfile = () => {
    const { global_state, global_dispatch } = useContext(GlobalContext);
    const navigation = useNavigation();
    const [first_name, setFirstName] = useState(global_state.current_user?.name)

    function changeDetailsConfirm() {
        Alert.alert('Details Updated!', '', [
            {
                text: 'OK',
                onPress: () => navigation.goBack(),
            },
        ]);
    }

    function handleChangeDetailsErrorsFrontEnd() {
        let validity = true;
        if (first_name === '') {
            validity = false;
            Alert.alert('Empty First Name', 'Please enter your first name.');
        }
        return validity;
    }

    // /**
    //  * Manage response to database failure
    //  * @param errorCode firebase auth error code
    //  */
    // function handleChangeDetailsErrorsBackEnd(errorCode) {
    //     if (errorCode === 'auth/wrong-password') {
    //         Alerts.wrongPasswordAlert();
    //     } else if (errorCode === 'auth/network-request-failed') {
    //         Alerts.connectionErrorAlert();
    //     } else {
    //         //Anything else
    //         Alerts.elseAlert();
    //     }
    // }


    return (
        <PageLayout header="Update Details"
            footer={{
                buttonDisabled: false,
                buttonText: 'Update Details',
                onPress: () => {
                    if (handleChangeDetailsErrorsFrontEnd()) {
                        changeDetailsConfirm();
                    }
                },

            }}>

            <View style={styles.form}>
                <View style={styles.DetailsContainer}>
                    <FormField
                        title={'First Name'}
                        setField={setFirstName}
                        value={first_name}
                        type={'name'}
                    />
                </View >
            </View >
        </PageLayout >
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#EDEBE7',
        flex: 1,
    },
    form: {
        margin: '5%',
    },
    button: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    DetailsContainer: {
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'space-between',
        paddingVertical: '2%',
    },
    subDetails: {
        flex: 1,
    },
    spaceLeft: {
        marginLeft: '2%',
    },
    spaceRight: {
        marginRight: '2%',
    },
});

export default UpdateProfile;
