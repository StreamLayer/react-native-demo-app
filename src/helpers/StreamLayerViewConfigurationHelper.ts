
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StreamLayerViewConfiguration, StreamLayerViewNotificationFeature, StreamLayerViewOverlayLandscapeMode } from 'react-native-streamlayer';

const STREAMLAYER_VIEW_CONFIGURATION_KEY = 'STREAMLAYER_VIEW_CONFIGURATION_KEY';

export class StreamLayerViewConfigurationHelper {

    static getViewConfiguration = async (): Promise<StreamLayerViewConfiguration> => {
        try {
            const jsonValue = await AsyncStorage.getItem(STREAMLAYER_VIEW_CONFIGURATION_KEY)
            return jsonValue != null ? JSON.parse(jsonValue) : this.getDefaultValue()
        } catch (e) {
            console.error("StramLayerViewConfigurationHelper getViewConfiguration error")
            return this.getDefaultValue()
        }
    }

    static setViewConfiguration = async (value: StreamLayerViewConfiguration) => {
        try {
            const jsonValue = JSON.stringify(value)
            return await AsyncStorage.setItem(STREAMLAYER_VIEW_CONFIGURATION_KEY, jsonValue)
        } catch (e) {
            console.error("StramLayerViewConfigurationHelper getViewConfiguration errorn", e)
        }
    }

    private static getDefaultValue(): StreamLayerViewConfiguration {
        return {
            viewNotificationFeatures: new Array(
                StreamLayerViewNotificationFeature.Games,
                StreamLayerViewNotificationFeature.Chat,
                StreamLayerViewNotificationFeature.WatchParty,
                StreamLayerViewNotificationFeature.Twitter
            ),
            isGamesPointsEnabled: true,
            isGamesPointsStartSide: false,
            isLaunchButtonEnabled: true,
            isMenuAlwaysOpened: false,
            isMenuLabelsVisible: true,
            isMenuProfileEnabled: true,
            isTooltipsEnabled: true,
            isWatchPartyReturnButtonEnabled: true,
            isWhoIsWatchingViewEnabled: true,
            isOverlayExpandable: false,
            overlayHeightSpace: 300,
            overlayWidth: 0,
            overlayLandscapeMode: StreamLayerViewOverlayLandscapeMode.Start
        }
    }
}