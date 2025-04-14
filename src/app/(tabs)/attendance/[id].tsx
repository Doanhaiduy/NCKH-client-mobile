import eventAPI from '@/apis/eventApi';
import { ButtonComponent, ContainerComponent, SectionComponent, SpaceComponent, TextComponent } from '@/components';
import { colors } from '@/constants/colors';
import { useRefreshing } from '@/hooks/useRefreshing';
import { checkTimeActive, dateTimeFormat } from '@/utils/dateTime';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Linking, Platform, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { differenceInMilliseconds, isBefore, isAfter, isWithinInterval } from 'date-fns';

interface Coordinates {
    latitude: number;
    longitude: number;
}

export default function Details() {
    const { id } = useLocalSearchParams();
    const { t } = useTranslation();
    const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
    const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);

    const { data, refetch } = useQuery<EventDetails>({
        queryKey: ['event', id],
        queryFn: () => eventAPI.getDetailEvents(id?.toString() || ''),
        refetchInterval: 60000,
    });

    const { refreshing, handleRefresh } = useRefreshing(refetch);

    // Request location permission and get current location
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            setHasLocationPermission(status === 'granted');

            if (status !== 'granted') {
                console.log('Quyền truy cập vị trí bị từ chối');
                return;
            }

            try {
                const location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });
                setUserLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });
            } catch (error) {
                console.log('Lỗi khi lấy vị trí:', error);
            }
        })();
    }, []);

    // Handle directions to event location
    const handleGetDirections = () => {
        if (!data?.location?.lat || !data?.location?.lng) {
            return;
        }

        const latitude = data.location.lat;
        const longitude = data.location.lng;
        const label = data.location.name || t('attendance_details.event_location');

        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${latitude},${longitude}`;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`,
        });

        if (url) {
            Linking.openURL(url);
        }
    };

    const calculateDistance = (): string | null => {
        if (!userLocation || !data?.location?.lat || !data?.location?.lng) {
            return null;
        }

        const toRad = (value: number): number => (value * Math.PI) / 180;
        const R = 6371; // Earth radius (km)
        const dLat = toRad(data.location.lat - userLocation.latitude);
        const dLon = toRad(data.location.lng - userLocation.longitude);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(userLocation.latitude)) *
                Math.cos(toRad(data.location.lat)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return distance.toFixed(1);
    };

    // Display remaining time until event starts
    const getRemainingTime = (): string | null => {
        if (!data?.startAt) return null;

        const now = new Date();
        const eventStart = new Date(data.startAt);
        const eventEnd = data.endAt ? new Date(data.endAt) : null;

        if (isBefore(now, eventStart)) {
            const diffMs = differenceInMilliseconds(eventStart, now);
            const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

            if (days > 0) {
                return `${t('attendance_details.starts_in')} ${days} ${t('attendance_details.days')} ${hours} ${t('attendance_details.hours')}`;
            } else if (hours > 0) {
                return `${t('attendance_details.starts_in')} ${hours} ${t('attendance_details.hours')} ${minutes} ${t('attendance_details.minutes')}`;
            } else {
                return `${t('attendance_details.starts_in')} ${minutes} ${t('attendance_details.minutes')}`;
            }
        }

        // Trường hợp 2: Sự kiện đang diễn ra
        else if (eventEnd && isWithinInterval(now, { start: eventStart, end: eventEnd })) {
            const diffMs = differenceInMilliseconds(eventEnd, now);
            const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

            if (days > 0) {
                return `${t('attendance_details.ends_in')} ${days} ${t('attendance_details.days')} ${hours} ${t('attendance_details.hours')}`;
            } else if (hours > 0) {
                return `${t('attendance_details.ends_in')} ${hours} ${t('attendance_details.hours')} ${minutes} ${t('attendance_details.minutes')}`;
            } else {
                return `${t('attendance_details.ends_in')} ${minutes} ${t('attendance_details.minutes')}`;
            }
        }

        // Trường hợp 3: Sự kiện đã kết thúc
        else if (eventEnd && isAfter(now, eventEnd)) {
            const diffMs = differenceInMilliseconds(now, eventEnd);
            const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

            if (days > 0) {
                return `${t('attendance_details.ended')} ${days} ${t('attendance_details.days')} ${t('attendance_details.ago')}`;
            } else if (hours > 0) {
                return `${t('attendance_details.ended')} ${hours} ${t('attendance_details.hours')} ${t('attendance_details.ago')}`;
            } else {
                return `${t('attendance_details.ended')} ${minutes} ${t('attendance_details.minutes')} ${t('attendance_details.ago')}`;
            }
        }

        return null;
    };

    const remainingTime = getRemainingTime();
    const distance = calculateDistance();

    const activeScan = checkTimeActive(data?.startAt || 0, data?.endAt || 0);

    return (
        <ContainerComponent
            iconLeft='back'
            notification
            title={t('attendance_details.title')}
            isScroll
            _refreshing={refreshing}
            handleRefresh={handleRefresh}
        >
            {data ? (
                <>
                    <SectionComponent className='mb-4'>
                        <View style={styles.eventHeader}>
                            <TextComponent text={data?.name || ''} size={22} className='font-bold text-center' />

                            <View style={styles.eventMeta}>
                                <View style={styles.metaItem}>
                                    <Ionicons name='qr-code' size={16} color={colors.primary400} />
                                    <TextComponent text={data?.eventCode || ''} size={14} className='ml-1' />
                                </View>

                                <View style={styles.metaItem}>
                                    <Ionicons name='location' size={16} color={colors.primary400} />
                                    <TextComponent text={data?.location?.name || ''} size={14} className='ml-1' />
                                </View>
                            </View>
                        </View>

                        {/* Event time */}
                        <View style={styles.timeContainer}>
                            <View style={styles.timeItem}>
                                <Ionicons name='time-outline' size={18} color={colors.primary400} />
                                <View>
                                    <TextComponent
                                        text={t('attendance_details.start')}
                                        size={12}
                                        className='ml-2 text-gray-500'
                                    />
                                    <TextComponent
                                        text={dateTimeFormat(data?.startAt || '')}
                                        size={14}
                                        className='ml-2 font-semibold'
                                    />
                                </View>
                            </View>
                            <SpaceComponent width={16} />
                            <View style={styles.timeItem}>
                                <Ionicons name='time-outline' size={18} color={colors.error} />
                                <View>
                                    <TextComponent
                                        text={t('attendance_details.end')}
                                        size={12}
                                        className='ml-2 text-gray-500'
                                    />
                                    <TextComponent
                                        text={dateTimeFormat(data?.endAt || '')}
                                        size={14}
                                        className='ml-2 font-semibold'
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Countdown and distance */}
                        {(remainingTime || distance) && (
                            <View style={styles.timeContainer}>
                                {true && (
                                    <View style={styles.infoCard}>
                                        <Ionicons name='alarm' size={24} color={colors.primary400} />
                                        <TextComponent
                                            text={t('attendance_details.remaining')}
                                            size={12}
                                            className='mt-1 text-gray-500'
                                        />
                                        <TextComponent
                                            text={remainingTime || ''}
                                            size={16}
                                            className='font-bold text-center'
                                        />
                                    </View>
                                )}
                                <SpaceComponent width={16} />
                                <View style={styles.infoCard}>
                                    <Ionicons name='navigate' size={24} color={colors.primary400} />
                                    <TextComponent
                                        text={t('attendance_details.distance')}
                                        size={12}
                                        className='mt-1 text-gray-500'
                                    />
                                    {distance ? (
                                        <TextComponent text={`${distance} km`} size={16} className='font-bold' />
                                    ) : (
                                        <>
                                            <ActivityIndicator color={colors.primary400} />
                                            <TextComponent
                                                text={t('attendance_details.loading')}
                                                size={16}
                                                className='mt-1 text-gray-500 text-[8px]'
                                            />
                                        </>
                                    )}
                                </View>
                            </View>
                        )}
                    </SectionComponent>

                    {/* QR Code */}
                    <SectionComponent className='items-center mb-2'>
                        <TouchableOpacity onPress={handleGetDirections} style={styles.qrContainer}>
                            <View style={styles.qrHeader}>
                                <Ionicons name='navigate' size={20} color={colors.primary400} />
                                <TextComponent
                                    text={t('attendance_details.get_directions')}
                                    size={16}
                                    className='ml-2 font-extrabold'
                                />
                            </View>
                        </TouchableOpacity>
                    </SectionComponent>

                    {/* Check In Button */}
                    <SectionComponent className='items-center px-6 mb-6'>
                        <ButtonComponent
                            title={t('attendance_details.check_in')}
                            type={activeScan ? 'primary' : 'grey'}
                            size='large'
                            disabled={!activeScan}
                            icon={<Ionicons name='scan-outline' size={22} color='white' style={{ marginRight: 8 }} />}
                            onPress={() => {
                                router.push({
                                    pathname: '/attendance/scan',
                                    params: {
                                        id: id,
                                        eventCode: data?.eventCode,
                                    },
                                });
                            }}
                        />
                    </SectionComponent>
                </>
            ) : (
                <View style={styles.noDataContainer}>
                    <Ionicons name='calendar-outline' size={60} color={colors.text400 || '#a0aec0'} />
                    <TextComponent
                        text={t('attendance_details.no_event')}
                        size={18}
                        className='text-center mt-4 text-gray-500'
                    />
                </View>
            )}
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({
    eventHeader: {
        paddingVertical: 16,
        paddingHorizontal: 8,
        width: '100%',
    },
    eventMeta: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 12,
        flexWrap: 'wrap',
        columnGap: 16,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    timeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 12,
        flex: 1,
    },

    infoCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        flex: 1,
    },
    mapContainer: {
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        marginVertical: 10,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    markerContainer: {
        alignItems: 'center',
    },
    userMarkerContainer: {
        backgroundColor: colors.primary400,
        borderRadius: 50,
        padding: 6,
    },
    directionsButton: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        backgroundColor: colors.primary400,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    qrContainer: {
        backgroundColor: '#f8f9fa',
        borderRadius: 16,
        padding: 16,
    },
    qrHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        fontWeight: 'bold',
    },
    qrImageContainer: {
        alignItems: 'center',
        padding: 8,
    },
    qrImage: {
        width: '100%',
        height: 260,
        resizeMode: 'contain',
    },
    noDataContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
});
