import eventAPI from '@/apis/eventApi';
import { ButtonComponent, ContainerComponent, SectionComponent, SpaceComponent, TextComponent } from '@/components';
import { colors } from '@/constants/colors';
import { useRefreshing } from '@/hooks/useRefreshing';
import { checkTimeActive, dateTimeFormat } from '@/utils/dateTime';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Dimensions, LogBox } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { differenceInMilliseconds, isBefore, isAfter, isWithinInterval } from 'date-fns';

interface Coordinates {
    latitude: number;
    longitude: number;
}

LogBox.ignoreLogs(['Warning: This synthetic event is reused for performance reasons']);

export default function Details() {
    const { id } = useLocalSearchParams();
    const { t } = useTranslation();
    const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
    const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
    const { height: screenHeight } = Dimensions.get('window');

    const { data, refetch } = useQuery({
        queryKey: ['event', id],
        queryFn: () => eventAPI.getDetailEvents(id?.toString() || ''),
        refetchInterval: 60000,
    });

    const { refreshing, handleRefresh } = useRefreshing(refetch);

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

    const calculateDistance = (): string | null => {
        if (!userLocation || !data?.location?.lat || !data?.location?.lng) {
            return null;
        }

        const toRad = (value: number): number => (value * Math.PI) / 180;
        const R = 6371;
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
        } else if (eventEnd && isWithinInterval(now, { start: eventStart, end: eventEnd })) {
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
        } else if (eventEnd && isAfter(now, eventEnd)) {
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
    const activeMap = () => {
        if (
            !userLocation?.latitude ||
            !userLocation?.longitude ||
            !data?.location?.lat ||
            !data?.location?.lng ||
            !hasLocationPermission
        ) {
            return false;
        } else return true;
    };

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

                        {(remainingTime || distance) && (
                            <View style={styles.timeContainer}>
                                {remainingTime && (
                                    <View style={styles.infoCard}>
                                        <Ionicons name='alarm' size={24} color={colors.primary400} />
                                        <TextComponent
                                            text={t('attendance_details.remaining')}
                                            size={12}
                                            className='mt-1 text-gray-500'
                                        />
                                        <TextComponent
                                            text={remainingTime}
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

                    <SectionComponent className='mb-2'>
                        <ButtonComponent
                            title={t('attendance_details.show_map')}
                            size='large'
                            icon={<Ionicons name='map-outline' size={22} color='white' style={{ marginRight: 8 }} />}
                            type={!activeMap() ? 'grey' : 'primary'}
                            disabled={!activeMap()}
                            onPress={() => {
                                router.push({
                                    pathname: '/attendance/map',
                                    params: {
                                        id,
                                        eventCode: data?.eventCode,
                                        userLatitude: userLocation?.latitude?.toString(),
                                        userLongitude: userLocation?.longitude?.toString(),
                                        eventLatitude: data?.location?.lat?.toString(),
                                        eventLongitude: data?.location?.lng?.toString(),
                                        eventName: data?.location?.name,
                                        hasLocationPermission: hasLocationPermission?.toString(),
                                        startAt: data?.startAt,
                                        endAt: data?.endAt,
                                    },
                                });
                            }}
                        />
                    </SectionComponent>

                    <SectionComponent className='items-center px-6 mb-6'>
                        <ButtonComponent
                            title={t('attendance_details.check_in')}
                            type={activeScan ? 'primary' : 'grey'}
                            size='large'
                            disabled={!activeScan}
                            icon={
                                <Ionicons name='qr-code-outline' size={22} color='white' style={{ marginRight: 8 }} />
                            }
                            onPress={() => {
                                router.push({
                                    pathname: '/attendance/scan',
                                    params: {
                                        id,
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
    noDataContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
});
