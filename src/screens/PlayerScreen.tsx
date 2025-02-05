import React, { useState, useEffect, useRef, useCallback, ReactElement } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    StyleSheet,
    View,
    ScrollView,
    Dimensions,
    Text,
    Image,
    Pressable
} from 'react-native';
import { PlayerConfiguration, SourceDescription, PlayerEventType, THEOplayer, THEOplayerView } from 'react-native-theoplayer';
import { UiContainer, CenteredControlBar, SkipButton, PlayButton, DEFAULT_THEOPLAYER_THEME } from '@theoplayer/react-native-ui';
import { StreamLayer, StreamLayerView, StreamLayerViewPlayer, StreamLayerViewConfiguration, StreamLayerDemoEvent } from 'react-native-streamlayer';
import { StreamLayerViewConfigurationHelper } from '../helpers/StreamLayerViewConfigurationHelper';
import {SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const playerConfig: PlayerConfiguration = {
    license: undefined,
};

const source: SourceDescription = {
    sources: [
        {
            src: "https://cdn.theoplayer.com/video/elephants-dream/playlist-single-audio.m3u8",
            type: "application/x-mpegurl"
        },
    ],
};

class LBarState {
    slideX: number;
    slideY: number;

    constructor(slideX: number, slideY: number) {
        this.slideX = slideX
        this.slideY = slideY
    }
}

function PlayerScreen({ route, navigation }): React.JSX.Element {
    const { hocMode } = route.params;
    const { invite } = route.params;

    const [volumeBeforeDucking, setVolumeBeforeDucking] = useState<number | undefined>(undefined)
    const [player, setPlayer] = useState<THEOplayer | undefined>(undefined);
    const [isPortrait, setPortrait] = useState(isScreenPortrait());
    const [lbarState, setLbarState] = useState(new LBarState(0, 0));
    const [viewConfig, setViewConfig] = useState<StreamLayerViewConfiguration>()
    const [events, setEvents] = useState<Array<StreamLayerDemoEvent>>()
    const [currentEventId, setCurrentEventId] = useState<String>()

    const viewRef = useRef<StreamLayerView>(null);
    const insets = useSafeAreaInsets()

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window, screen }) => {
            setPortrait(isScreenPortrait)
        },
        );
        return () => subscription?.remove();
    });

    useFocusEffect(
        useCallback(() => {
            console.log("PlayerScreen is focused")
            {
                loadViewConfig()
                loadDemoEvents()
                // Use only for testing
                // setTimeout(() => {viewRef.current?.hideMenu()}, 5000)
                // setTimeout(() => {viewRef.current?.hideOverlay()}, 10000)
                // setTimeout(() => {viewRef.current?.showOverlay(ViewOverlay.WatchParty)}, 3000)
            }
            return () => {
                console.log("PlayerScreen is blurred")
                {
                    StreamLayer.releaseEventSession()
                }
            };
        }, [])
    );

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (invite !== undefined) {
                viewRef.current?.handleInvite(invite)
            }
        }, 1000);
        return () => clearTimeout(timeoutId);
    }, []);

    const loadViewConfig = async () => {
        try {
            const config = await StreamLayerViewConfigurationHelper.getViewConfiguration()
            setViewConfig(config)
        } catch (e) {
            console.error("PlayerScreen loadViewConfig error", e);
        }
    };

    const loadDemoEvents = async () => {
        try {
            // TODO: probably move date to SL config page later
            const events = await StreamLayer.getDemoEvents("2022-01-01")
            setEvents(events)
            if (events !== undefined && events !== null && events.length > 0) {
                createEventSession(events[0].id)
            }
        } catch (e) {
            console.error("PlayerScreen loadDemoEvents error", e);
        }
    }

    // TODO: we need to add better thread managment here - probably also in native sdk part
    // add StreamLayerDemoEvent support on demand
    const createEventSession = async (id: string) => {
        try {
            await StreamLayer.createEventSession(id);
            console.log(`Created a new event with id ${id}`);
            setCurrentEventId(id)
        } catch (e) {
            console.error(e);
        }
    };

    const playerHeight = isScreenPortrait() ? 300 : Dimensions.get('screen').height;

    const onReady = (player: THEOplayer) => {
        setPlayer(player);
        player.autoplay = true
        player.source = source;
        player.addEventListener(PlayerEventType.ERROR, console.log);
    }

    const onRequestStream = (id: string) => {
        console.log("onRequestStream id=" + id)
        createEventSession(id)
    }

    const onLBarStateChanged = (slideX: number, slideY: number) => {
        setLbarState(new LBarState(slideX, slideY));
    }

    const onRequestAudioDucking = (level: number) => {
        console.log("onRequestAudioDucking level=" + level)
        if (player !== undefined) {
            const playerVolume = player.volume;
            if (volumeBeforeDucking == undefined) {
                setVolumeBeforeDucking(playerVolume);
            }
            console.log("onRequestAudioDucking change player volume=" + playerVolume)
            player.volume = Math.min(playerVolume, level)
        }
    }

    const onDisableAudioDucking = () => {
        console.log("onDisableAudioDucking")
        if (player !== undefined) {
            if (volumeBeforeDucking !== undefined) {
                player.volume = volumeBeforeDucking
                console.log("onDisableAudioDucking change player volume=" + volumeBeforeDucking)
                setVolumeBeforeDucking(undefined)
            }
        }
    }

    const streamLayerViewPlayer: StreamLayerViewPlayer = {

        get volume() {
            if (player !== undefined) {
                return player.volume
            } else {
                return 0.0
            }
        },

        set volume(value) {
            if (player !== undefined) {
                player.volume = value
            }
        },

    }

    var scrollItems = new Array<ReactElement>();
    if (events !== undefined && isPortrait) {
        events.forEach((event) => {
            scrollItems.push(
                <Pressable key={event.id} onPress={() => createEventSession(event.id)}>
                    <View style={styles.eventRow}>
                        {event.previewUrl !== undefined && (
                            <Image source={{ uri: event.previewUrl }}
                                style={styles.eventRowImage} />
                        )}
                        <Text style={styles.eventRowTitle} numberOfLines={1} ellipsizeMode='tail'>{event.title}</Text>
                    </View>
                </Pressable>
            )
        })
    }

    var currentEvent: StreamLayerDemoEvent | undefined;
    if (events !== undefined && currentEventId !== undefined) {
        currentEvent = events.find((event) => {
            return event.id == currentEventId
        })
    }

    const isHocMode = hocMode == true


    console.log("Render new state playerHeight=" + playerHeight + " slideX="
        + lbarState.slideX + " slideY=" + lbarState.slideY
        + " hocMode=" + hocMode + " currentEventId=" + currentEventId + " currentEvent=" + currentEvent
        + " invite=" + invite)

    return (
        <SafeAreaView style={{...styles.container, marginTop: insets.top }}  edges={['top']}>
            {(isPortrait) &&
                <View style={{ flex: 1, marginTop: playerHeight  - insets.top }}>
                    {currentEvent !== undefined && (
                        <Text style={styles.eventTitle}>{currentEvent.title}</Text>
                    )}
                    <ScrollView style={{ flex: 1 }}>
                        {scrollItems}
                    </ScrollView>
                </View>
            }
            {(!isHocMode) &&
                <View style={isPortrait ? {...styles.portrait, height: Dimensions.get('screen').height - insets.top, width: Dimensions.get('screen').width } : styles.landscape}>
                    <THEOplayerView config={playerConfig} onPlayerReady={onReady}
                        style={{
                            width: Dimensions.get('screen').width - lbarState.slideX,
                            height: playerHeight-lbarState.slideY,
                            paddingTop: 0,
                        }}>
                        {player !== undefined && (
                            <UiContainer
                                theme={DEFAULT_THEOPLAYER_THEME}
                                player={player}
                                center={
                                    <CenteredControlBar
                                        left={<SkipButton skip={-10} />}
                                        middle={<PlayButton />}
                                        right={<SkipButton skip={10} />}
                                    />
                                } />
                        )}
                    </THEOplayerView>
                    <StreamLayerView
                        style={{ flex: 1 }}
                        ref={viewRef}
                        config={viewConfig}
                        applyWindowInsets={true}
                        onRequestStream={onRequestStream}
                        onLBarStateChanged={onLBarStateChanged}
                        onRequestAudioDucking={onRequestAudioDucking}
                        onDisableAudioDucking={onDisableAudioDucking}
                    />
                </View>
            }
            {(isHocMode) &&
              <StreamLayerView
                    style={isPortrait ? {...styles.portrait, height: Dimensions.get('screen').height - insets.top, width: Dimensions.get('screen').width } : styles.landscape}
                    ref={viewRef}
                    config={viewConfig}
                    applyWindowInsets={false}
                    onRequestStream={onRequestStream}
                    onLBarStateChanged={onLBarStateChanged}
                    onRequestAudioDucking={onRequestAudioDucking}
                    onDisableAudioDucking={onDisableAudioDucking}
                    player={streamLayerViewPlayer}
                    playerView={
                        <THEOplayerView config={playerConfig} onPlayerReady={onReady}
                            style={{
                                width: Dimensions.get('screen').width - lbarState.slideX,
                                height: playerHeight-lbarState.slideY,
                                paddingTop: 0,
                            }}>
                            {player !== undefined && (
                                <UiContainer
                                    theme={DEFAULT_THEOPLAYER_THEME}
                                    player={player}
                                    center={
                                        <CenteredControlBar
                                            left={<SkipButton skip={-10} />}
                                            middle={<PlayButton />}
                                            right={<SkipButton skip={10} />}
                                        />
                                    } />
                            )}
                        </THEOplayerView>
                    }
                />
            }
        </SafeAreaView>
    )
}

function isScreenPortrait(): boolean {
    return Dimensions.get('window').height > Dimensions.get('window').width
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'gray',
    },
    eventTitle: {
        color: 'white',
        fontSize: 24,
        margin: 4
    },
    eventRowTitle: {
        flex: 1,
        color: 'white',
        fontSize: 16,
        margin: 4
    },
    eventRow: {
        flexDirection: 'row',
        margin: 4,
        padding: 4,
        height: 58,
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'black',
    },
    eventRowImage: {
        width: 100,
        height: 50
    },
    overlay: {
        paddingTop: 500,
        backgroundColor: '#00000000',
        flex: 1,
    },
    portrait: {
        height: Height,
        width: Width,
        position: 'absolute'
    },
    landscape: {
        flex: 1
    },
});

export default PlayerScreen