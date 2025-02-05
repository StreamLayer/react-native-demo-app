import React from 'react';
import {
    Text,
    View,
    Button
} from 'react-native';

function FeedScreen({ navigation }): React.JSX.Element {
    
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{color:'black'}}>Feed Screen</Text>
        </View>
    )
}

export default FeedScreen;