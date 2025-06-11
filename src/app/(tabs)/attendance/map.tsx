import { useState, useEffect, useMemo } from 'react';
import { ButtonComponent, ContainerComponent, TextComponent } from '@/components';
import { checkTimeActive } from '@/utils/dateTime';
import { router, useLocalSearchParams } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import EventMap from '@components/MapBoxComponent';

const fetchWeather = async (lng: number, lat: number) => {
    const apiKey = '8aaac1532df011f5143ee6759f0b68ef';
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric&lang=vi`,
    );
    const data = await response.json();
    return data;
};

export default function MapScreen() {
    const { t } = useTranslation();

    const {
        id,
        eventCode,
        userLatitude,
        userLongitude,
        eventLatitude,
        eventLongitude,
        eventName,
        hasLocationPermission,
        startAt,
        endAt,
    } = useLocalSearchParams();

    const userLocation = useMemo(
        () =>
            userLatitude && userLongitude
                ? {
                      latitude: parseFloat(userLatitude as string),
                      longitude: parseFloat(userLongitude as string),
                  }
                : null,
        [userLatitude, userLongitude],
    );

    const eventLocation = useMemo(
        () =>
            eventLatitude && eventLongitude
                ? {
                      lat: parseFloat(eventLatitude as string),
                      lng: parseFloat(eventLongitude as string),
                      name: eventName as string,
                  }
                : null,
        [eventLatitude, eventLongitude, eventName],
    );

    const parsedHasLocationPermission = hasLocationPermission === 'true';
    const activeScan = checkTimeActive(startAt.toString(), endAt.toString());

    const [weather, setWeather] = useState<any>(null);

    useEffect(() => {
        if (eventLocation) {
            fetchWeather(eventLocation.lng, eventLocation.lat).then(setWeather);
        }
    }, [eventLocation]);
    return (
        <ContainerComponent iconLeft='back' title={t('map.map')}>
            <View style={styles.container}>
                <EventMap
                    eventLocation={eventLocation}
                    hasLocationPermission={parsedHasLocationPermission}
                    fullscreenMode={true}
                    startAt={startAt.toString()}
                />
                {weather && (
                    <View style={styles.weatherCard}>
                        <TextComponent text={`Thời tiết: ${weather.weather[0].description}, ${weather.main.temp}°C`} />
                    </View>
                )}
                <View style={styles.buttonContainer}>
                    <ButtonComponent
                        title={t('attendance_details.check_in')}
                        type={activeScan ? 'primary' : 'grey'}
                        size='large'
                        disabled={!activeScan}
                        icon={<Ionicons name='qr-code-outline' size={22} color='white' style={{ marginRight: 8 }} />}
                        onPress={() => {
                            router.back();

                            router.push({
                                pathname: '/attendance/scan',
                                params: { id, eventCode },
                            });
                        }}
                    />
                </View>
            </View>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    buttonContainer: {
        padding: 16,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
    },
    poiList: {
        maxHeight: 100,
        padding: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    poiItem: {
        padding: 8,
        marginRight: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    weatherCard: {
        position: 'absolute',
        top: 6,
        left: 16,
        padding: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
});
