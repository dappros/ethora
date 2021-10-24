/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import React from 'react';
import {
    StatusBar,
    StyleSheet,
    View,
    Image
} from 'react-native';
import { connect } from 'react-redux';
import { getUserToken } from '../actions/auth';


class AuthLoadingScreen extends React.Component {
    constructor() {
        super();
        
    }

    componentDidMount() {

        this._bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = () => {

        this.props.getUserToken().then(() => {
            this.props.navigation.navigate(this.props.loginReducer.token !== null ? 'ChatHomeComponent' : 'LoginComponent');
        })
            .catch(error => {
                this.setState({ error })
            })

    };

    // Render any loading content that you like here
    render() {
        return (
            <View style={styles.container}>
                {/* <ActivityIndicator animating={this.state.isloading} /> */}
                {/* <StatusBar barStyle="default" /> */}
                <Image source={require('../assets/Dappros-platform-logo.png')} style={{height:100,width:100}}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

// const mapStateToProps = state => ({
//     token: state.token,
// });


// const mapDispatchToProps = dispatch => ({
//     getUserToken: () => dispatch(getUserToken()),
// });

const mapStateToProps = state => {
    return {
      ...state,
    };
};

module.exports = connect(mapStateToProps,{
    getUserToken
})(AuthLoadingScreen)

// export default connect(mapStateToProps, mapDispatchToProps)(AuthLoadingScreen);
