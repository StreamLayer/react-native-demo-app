import React, { useState, useCallback } from 'react';
import {
    Text,
    TextInput,
    Button,
    View,
    Switch,
    ScrollView,
    StyleSheet
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StreamLayerViewConfiguration, StreamLayerViewNotificationFeature, StreamLayerViewOverlayLandscapeMode } from 'react-native-streamlayer';
import { StreamLayerViewConfigurationHelper } from '../helpers/StreamLayerViewConfigurationHelper';

function SettingsScreen(): React.JSX.Element {

    const [viewConfig, setViewConfig] = useState<StreamLayerViewConfiguration>()

    const loadViewConfig = async () => {
        try {
            const config = await StreamLayerViewConfigurationHelper.getViewConfiguration()
            console.log("loaded height=" + config.overlayHeightSpace)
            setViewConfig(config)
        } catch (e) {
            console.error("SettingsScreen loadViewConfig error", e);
        }
    };

    const saveViewConfig = async () => {
        try {
            if (viewConfig !== undefined) await StreamLayerViewConfigurationHelper.setViewConfiguration(viewConfig)
        } catch (e) {
            console.error("SettingsScreen saveViewConfig error", e);
        }
    };

    useFocusEffect(
        useCallback(() => {
            console.log("SettingsScreen is focused")
            if (viewConfig === undefined) loadViewConfig()
            return () => { console.log("SettingsScreen is blurred") };
        }, [])
    );

    const onGamesPointsEnabledChanged = (value: boolean) => {
        setViewConfig((pre) => { return ({ ...pre, ['isGamesPointsEnabled']: value }) });
    }

    const onGamesPointsStartSideChanged = (value: boolean) => {
        setViewConfig((pre) => { return ({ ...pre, ['isGamesPointsStartSide']: value }) });
    }

    const onLaunchButtonChanged = (value: boolean) => {
        setViewConfig((pre) => { return ({ ...pre, ['isLaunchButtonEnabled']: value }) });
    }

    const onMenuAlwaysOpenedChanged = (value: boolean) => {
        setViewConfig((pre) => { return ({ ...pre, ['isMenuAlwaysOpened']: value }) });
    }

    const onMenuLabelsChanged = (value: boolean) => {
        setViewConfig((pre) => { return ({ ...pre, ['isMenuLabelsVisible']: value }) });
    }

    const onMenuProfileChanged = (value: boolean) => {
        setViewConfig((pre) => { return ({ ...pre, ['isMenuProfileEnabled']: value }) });
    }

    const onTooltipsChanged = (value: boolean) => {
        setViewConfig((pre) => { return ({ ...pre, ['isTooltipsEnabled']: value }) });
    }

    const onWatchPartyReturnButtonChanged = (value: boolean) => {
        setViewConfig((pre) => { return ({ ...pre, ['isWatchPartyReturnButtonEnabled']: value }) });
    }

    const onWhosWatchingViewChanged = (value: boolean) => {
        setViewConfig((pre) => { return ({ ...pre, ['isWhoIsWatchingViewEnabled']: value }) });
    }

    const onOverlayExpandableChanged = (value: boolean) => {
        setViewConfig((pre) => { return ({ ...pre, ['isOverlayExpandable']: value }) });
    }

    const onOverlayHeightChanged = (value: string) => {
        const height = Math.max(0, Number.parseInt(value));
        if (Number.isSafeInteger(height)) {
            setViewConfig((pre) => { return ({ ...pre, ['overlayHeightSpace']: height }) });
        } else {
            setViewConfig((pre) => { return ({ ...pre, ['overlayHeightSpace']: 0 }) });
        }
    }


    const onOverlayWidthChanged = (value: string) => {
        const width = Math.max(0, Number.parseInt(value));
        if (Number.isSafeInteger(width)) {
            setViewConfig((pre) => { return ({ ...pre, ['overlayWidth']: width }) });
        } else {
            setViewConfig((pre) => { return ({ ...pre, ['overlayWidth']: 0 }) });
        }
    }

    const onViewNoticationChanged = (feature: StreamLayerViewNotificationFeature, value: boolean) => {
        const includes = viewNotificationFeatures.includes(feature)
        if (value) {
            if (!includes) {
                viewNotificationFeatures.push(feature);
                setViewConfig((pre) => { return ({ ...pre, ['viewNotificationFeatures']: viewNotificationFeatures }) });
            }
        } else {
            if (includes) {
                const newItems = viewNotificationFeatures.filter((e) => e !== feature);
                setViewConfig((pre) => { return ({ ...pre, ['viewNotificationFeatures']: newItems }) });
            }
        }
    }

    const onOverlayLandscapeModeChanged = (mode: StreamLayerViewOverlayLandscapeMode, value: boolean) => {
        if (value) {
            setViewConfig((pre) => { return ({ ...pre, ['overlayLandscapeMode']: mode }) });
        }
        else{
            setViewConfig((pre) => { return ({ ...pre, ['overlayLandscapeMode']: StreamLayerViewOverlayLandscapeMode.Start }) });
        }
    }

    const viewNotificationFeatures = Array<StreamLayerViewNotificationFeature>()
    viewConfig?.viewNotificationFeatures?.forEach(function (value) {
        viewNotificationFeatures.push(value);
    })
    const isWpNotificationEnabled = viewNotificationFeatures.includes(StreamLayerViewNotificationFeature.WatchParty)
    const isChatNotificationEnabled = viewNotificationFeatures.includes(StreamLayerViewNotificationFeature.Chat)
    const isTwitterNotificationEnabled = viewNotificationFeatures.includes(StreamLayerViewNotificationFeature.Twitter)
    const isGamesNotificationEnabled = viewNotificationFeatures.includes(StreamLayerViewNotificationFeature.Games)

    const isOverlayStartMode= viewConfig?.overlayLandscapeMode == StreamLayerViewOverlayLandscapeMode.Start
    const isOverlayEndMode= viewConfig?.overlayLandscapeMode == StreamLayerViewOverlayLandscapeMode.End
    const isOverlayLbarMode= viewConfig?.overlayLandscapeMode == StreamLayerViewOverlayLandscapeMode.Lbar


    return (
        <View style={{ flex: 1, margin: 16 }}>
            <ScrollView style={{ flex: 1 }}>
                <View style={styles.column}>
                    <Text style={styles.text}>Select notification features:</Text>
                    <View style={styles.row}>
                        <Text style={styles.text}>Watch party</Text>
                        <Switch
                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                            thumbColor={isWpNotificationEnabled ? '#f5dd4b' : '#f4f3f4'}
                            onValueChange={value => onViewNoticationChanged(StreamLayerViewNotificationFeature.WatchParty, value)}
                            value={isWpNotificationEnabled}
                        />
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>Chat</Text>
                        <Switch
                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                            thumbColor={isChatNotificationEnabled ? '#f5dd4b' : '#f4f3f4'}
                            onValueChange={value => onViewNoticationChanged(StreamLayerViewNotificationFeature.Chat, value)}
                            value={isChatNotificationEnabled}
                        />
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>Twitter</Text>
                        <Switch
                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                            thumbColor={isTwitterNotificationEnabled ? '#f5dd4b' : '#f4f3f4'}
                            onValueChange={value => onViewNoticationChanged(StreamLayerViewNotificationFeature.Twitter, value)}
                            value={isTwitterNotificationEnabled}
                        />
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>Games</Text>
                        <Switch
                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                            thumbColor={isGamesNotificationEnabled ? '#f5dd4b' : '#f4f3f4'}
                            onValueChange={value => onViewNoticationChanged(StreamLayerViewNotificationFeature.Games, value)}
                            value={isGamesNotificationEnabled}
                        />
                    </View>
                </View>
                <View style={styles.rowWithBorder}>
                    <Text style={styles.text}>Is games points enabled?</Text>
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={viewConfig?.isGamesPointsEnabled ? '#f5dd4b' : '#f4f3f4'}
                        onValueChange={onGamesPointsEnabledChanged}
                        value={viewConfig?.isGamesPointsEnabled}
                    />
                </View>
                <View style={styles.rowWithBorder}>
                    <Text style={styles.text}>Is games points start side?</Text>
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={viewConfig?.isGamesPointsStartSide ? '#f5dd4b' : '#f4f3f4'}
                        onValueChange={onGamesPointsStartSideChanged}
                        value={viewConfig?.isGamesPointsStartSide}
                    />
                </View>
                <View style={styles.rowWithBorder}>
                    <Text style={styles.text}>Is launch button enabled?</Text>
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={viewConfig?.isLaunchButtonEnabled ? '#f5dd4b' : '#f4f3f4'}
                        onValueChange={onLaunchButtonChanged}
                        value={viewConfig?.isLaunchButtonEnabled}
                    />
                </View>
                <View style={styles.rowWithBorder}>
                    <Text style={styles.text}>Is menu always opened?</Text>
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={viewConfig?.isMenuAlwaysOpened ? '#f5dd4b' : '#f4f3f4'}
                        onValueChange={onMenuAlwaysOpenedChanged}
                        value={viewConfig?.isMenuAlwaysOpened}
                    />
                </View>
                <View style={styles.rowWithBorder}>
                    <Text style={styles.text}>Is menu labels visible?</Text>
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={viewConfig?.isMenuLabelsVisible ? '#f5dd4b' : '#f4f3f4'}
                        onValueChange={onMenuLabelsChanged}
                        value={viewConfig?.isMenuLabelsVisible}
                    />
                </View>
                <View style={styles.rowWithBorder}>
                    <Text style={styles.text}>Is menu profile enabled?</Text>
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={viewConfig?.isMenuProfileEnabled ? '#f5dd4b' : '#f4f3f4'}
                        onValueChange={onMenuProfileChanged}
                        value={viewConfig?.isMenuProfileEnabled}
                    />
                </View>
                <View style={styles.rowWithBorder}>
                    <Text style={styles.text}>Is tooltips enabled?</Text>
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={viewConfig?.isTooltipsEnabled ? '#f5dd4b' : '#f4f3f4'}
                        onValueChange={onTooltipsChanged}
                        value={viewConfig?.isTooltipsEnabled}
                    />
                </View>
                <View style={styles.rowWithBorder}>
                    <Text style={styles.text}>Is watch party return button enabled?</Text>
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={viewConfig?.isWatchPartyReturnButtonEnabled ? '#f5dd4b' : '#f4f3f4'}
                        onValueChange={onWatchPartyReturnButtonChanged}
                        value={viewConfig?.isWatchPartyReturnButtonEnabled}
                    />
                </View>
                <View style={styles.rowWithBorder}>
                    <Text style={styles.text}>Is whos watching view enabled?</Text>
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={viewConfig?.isWhoIsWatchingViewEnabled ? '#f5dd4b' : '#f4f3f4'}
                        onValueChange={onWhosWatchingViewChanged}
                        value={viewConfig?.isWhoIsWatchingViewEnabled}
                    />
                </View>
                <View style={styles.rowWithBorder}>
                    <Text style={styles.text}>Is overlay exandable?</Text>
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={viewConfig?.isOverlayExpandable ? '#f5dd4b' : '#f4f3f4'}
                        onValueChange={onOverlayExpandableChanged}
                        value={viewConfig?.isOverlayExpandable}
                    />
                </View>
                <View style={styles.column}>
                    <Text style={styles.text}>Select overlay landscape mode:</Text>
                    <View style={styles.row}>
                        <Text style={styles.text}>Start</Text>
                        <Switch
                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                            thumbColor={isOverlayStartMode ? '#f5dd4b' : '#f4f3f4'}
                            onValueChange={value => onOverlayLandscapeModeChanged(StreamLayerViewOverlayLandscapeMode.Start, value)}
                            value={isOverlayStartMode}
                        />
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>End</Text>
                        <Switch
                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                            thumbColor={isOverlayEndMode ? '#f5dd4b' : '#f4f3f4'}
                            onValueChange={value => onOverlayLandscapeModeChanged(StreamLayerViewOverlayLandscapeMode.End, value)}
                            value={isOverlayEndMode}
                        />
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>Lbar</Text>
                        <Switch
                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                            thumbColor={isOverlayLbarMode ? '#f5dd4b' : '#f4f3f4'}
                            onValueChange={value => onOverlayLandscapeModeChanged(StreamLayerViewOverlayLandscapeMode.Lbar, value)}
                            value={isOverlayLbarMode}
                        />
                    </View>
                </View>
                <View style={styles.rowWithBorder}>
                    <Text style={styles.text}>Overlay height space</Text>
                    <TextInput
                        style={styles.textInput}
                        // placeholder="Enter number value"
                        placeholderTextColor='black'
                        value={viewConfig?.overlayHeightSpace?.toString()}
                        onChangeText={value => onOverlayHeightChanged(value)}
                    />
                </View>
                <View style={styles.rowWithBorder}>
                    <Text style={styles.text}>Overlay width</Text>
                    <TextInput
                        style={styles.textInput}
                        // placeholder="Enter number value"
                        placeholderTextColor='black'
                        value={viewConfig?.overlayWidth?.toString()}
                        onChangeText={value => onOverlayWidthChanged(value)}
                    />
                </View>
                <Button title="Save" onPress={saveViewConfig} />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        color: 'black',
        fontSize: 16
    },
    textInput: {
        height: 44,
        flex: 1,
        margin: 2,
        padding: 4,
        borderWidth: 1,
        color: 'black',
        fontSize: 16
    },
    column:{
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'black',
        margin: 2,
        padding: 4,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 2,
        padding: 4,
    },
    rowWithBorder: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'black',
        margin: 2,
        padding: 4,
    }
});

export default SettingsScreen;