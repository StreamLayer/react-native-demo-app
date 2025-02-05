import React from 'react';
import {
    Button,
    View,
} from 'react-native';

function LiveScreen({ navigation }): React.JSX.Element {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
            <Button
                title="Open Streamlayer view"
                onPress={() => navigation.navigate('Player', { hocMode: false })}
            />
            <View style={{ marginTop: 20 }} />
            <Button
                title="Open Streamlayer HOC"
                onPress={() => navigation.navigate('Player', { hocMode: true })}
            />
        </View>
    )
}

export default LiveScreen;