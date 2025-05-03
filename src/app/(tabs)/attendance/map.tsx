import { ButtonComponent, ContainerComponent, TextComponent } from '@/components';
import { checkTimeActive } from '@/utils/dateTime';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import EventMap from '@components/MapBoxComponent';

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
    console.log(
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
    );

    // Parse parameters
    const userLocation =
        userLatitude && userLongitude
            ? {
                  latitude: parseFloat(userLatitude as string),
                  longitude: parseFloat(userLongitude as string),
              }
            : null;

    const eventLocation =
        eventLatitude && eventLongitude
            ? {
                  lat: parseFloat(eventLatitude as string),
                  lng: parseFloat(eventLongitude as string),
                  name: eventName as string,
              }
            : null;

    const parsedHasLocationPermission = hasLocationPermission === 'true';

    // Check if check-in is active
    const activeScan = checkTimeActive(startAt.toString(), endAt.toString());

    return (
        //@ts-ignore
        <ContainerComponent iconLeft='back' title={t('map.map')}>
            <View style={styles.container}>
                <EventMap
                    userLocation={userLocation}
                    eventLocation={eventLocation}
                    hasLocationPermission={parsedHasLocationPermission}
                    fullscreenMode={true}
                    startAt={startAt.toString()}
                />
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
});
