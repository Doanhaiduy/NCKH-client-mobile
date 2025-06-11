import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Platform, Linking, Animated, Text } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors } from '@/constants/colors';
import { TextComponent } from '@/components';
import PortalizeComponent from './PortalizeComponent';
import { Modalize } from 'react-native-modalize';
import { intervalToDuration } from 'date-fns';
import * as Location from 'expo-location';

const EventMap = ({
    eventLocation,
    hasLocationPermission,
    previewMode = false,
    fullscreenMode = false,
    startAt,
}: {
    eventLocation: { lat: number; lng: number; name?: string } | null;
    hasLocationPermission: boolean | null;
    previewMode?: boolean;
    fullscreenMode?: boolean;
    startAt?: string | null;
}) => {
    const { t } = useTranslation();
    const [route, setRoute] = useState(null);
    const [isMapReady, setIsMapReady] = useState(false);
    const [mapError, setMapError] = useState<string | null>(null);
    const [isRouteFetching, setIsRouteFetching] = useState(false);
    const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/streets-v12');
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const cameraRef = useRef<Mapbox.Camera>(null);
    const [centerUserLocation, setCenterUserLocation] = useState(false);
    const [travelTime, setTravelTime] = useState<string | null>(null);
    const [travelDistance, setTravelDistance] = useState<string | null>(null);
    const [selectedTransportMode, setSelectedTransportMode] = useState<string>('walking');
    const [showBottomControls, setShowBottomControls] = useState(false);
    const [lateMinutes, setLateMinutes] = useState<number>(0);
    const modalizeRef = useRef<Modalize>(null);
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    const transportModes = [
        {
            id: 'driving',
            icon: 'bicycle-outline',
            label: t('map.bike'),
            externalMap: { google: 'bicycling', apple: 'd' },
        },
        {
            id: 'driving-traffic',
            icon: 'car-outline',
            label: t('map.car'),
            externalMap: { google: 'driving', apple: 'd' },
        },
        { id: 'walking', icon: 'walk-outline', label: t('map.walk'), externalMap: { google: 'walking', apple: 'w' } },
    ];

    const formatTime = (minutes: number): string => {
        if (minutes < 60) {
            return `${minutes} ${t('map.minutes')}`;
        }
        const duration = intervalToDuration({ start: 0, end: minutes * 60 * 1000 });
        const parts = [];
        if (duration.days && duration.days > 0) {
            parts.push(`${duration.days} ${t('attendance_details.days')}`);
        }
        if (duration.hours && duration.hours > 0) {
            parts.push(`${duration.hours} ${t('attendance_details.hours')}`);
        }
        if (duration.minutes && duration.minutes > 0) {
            parts.push(`${duration.minutes} ${t('map.minutes')}`);
        }
        return parts.join(' ');
    };

    useEffect(() => {
        let locationSubscription: Location.LocationSubscription | null = null;

        const subscribeToLocation = async () => {
            if (!hasLocationPermission) return;

            locationSubscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    distanceInterval: 5, // cập nhật mỗi khi di chuyển 5m
                    timeInterval: 5000, // hoặc 5 giây
                },
                (locationUpdate) => {
                    const { latitude, longitude } = locationUpdate.coords;
                    setUserLocation({ latitude, longitude });
                },
            );
        };

        subscribeToLocation();

        return () => {
            locationSubscription?.remove();
        };
    }, [hasLocationPermission]);

    const handleGetDirections = useCallback(async () => {
        if (!userLocation || !eventLocation?.lat || !eventLocation?.lng) {
            setLateMinutes(0);
            modalizeRef.current?.open();
            return;
        }

        setIsRouteFetching(true);
        const start = [userLocation.longitude, userLocation.latitude];
        const end = [eventLocation.lng, eventLocation.lat];

        try {
            const response = await fetch(
                `https://api.mapbox.com/directions/v5/mapbox/${selectedTransportMode}/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${process.env.EXPO_PUBLIC_MAPBOX_API_KEY}`,
            );

            if (!response.ok) {
                throw new Error(`Directions API error: ${response.status}`);
            }

            const responseData = await response.json();
            if (responseData.routes && responseData.routes.length > 0) {
                setRoute(responseData.routes[0].geometry);

                const durationInSeconds = responseData.routes[0].duration;
                const minutes = Math.round(durationInSeconds / 60);
                const newTravelTime = formatTime(minutes);
                if (newTravelTime !== travelTime) {
                    setTravelTime(newTravelTime);
                }

                const distanceInMeters = responseData.routes[0].distance;
                const newTravelDistance =
                    distanceInMeters < 1000
                        ? `(${Math.round(distanceInMeters)} m)`
                        : `(${(distanceInMeters / 1000).toFixed(1)} km)`;
                if (newTravelDistance !== travelDistance) {
                    setTravelDistance(newTravelDistance);
                }

                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: 1.1,
                        duration: 150,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 150,
                        useNativeDriver: true,
                    }),
                ]).start();
            } else {
                setLateMinutes(0);
                modalizeRef.current?.open();
            }
        } catch (error) {
            console.error('Lỗi khi lấy lộ trình:', error);
            setLateMinutes(0);
            modalizeRef.current?.open();
        } finally {
            setIsRouteFetching(false);
        }
    }, [userLocation, eventLocation, selectedTransportMode, t, travelTime, travelDistance]);

    useEffect(() => {
        const checkMapboxStatus = async () => {
            if (!process.env.EXPO_PUBLIC_MAPBOX_API_KEY) {
                setMapError(t('map.missing_token'));
                return;
            }
            try {
                if (userLocation && eventLocation) {
                    const response = await fetch(
                        `https://api.mapbox.com/geocoding/v5/mapbox.places/${eventLocation.lng},${eventLocation.lat}.json?access_token=${process.env.EXPO_PUBLIC_MAPBOX_API_KEY}`,
                        { method: 'GET' },
                    );
                    if (!response.ok) {
                        throw new Error(`Mapbox API error: ${response.status}`);
                    }
                    setIsMapReady(true);
                }
            } catch (error) {
                console.error('Lỗi khi kiểm tra Mapbox:', error);
                setMapError(t('map.mapbox_error'));
            }
        };
        checkMapboxStatus();
    }, [userLocation, eventLocation, t]);

    useEffect(() => {
        if (userLocation && eventLocation) {
            handleGetDirections();
        }
    }, [userLocation, eventLocation, selectedTransportMode, handleGetDirections]);

    useEffect(() => {
        if (startAt && travelTime && lateMinutes === 0) {
            const eventStart = new Date(startAt);
            const durationMinutes = Math.round(
                travelTime.split(' ').reduce((acc, part, index, arr) => {
                    if (part === t('map.days')) {
                        return acc + parseInt(arr[index - 1]) * 24 * 60;
                    }
                    if (part === t('map.hours')) {
                        return acc + parseInt(arr[index - 1]) * 60;
                    }
                    if (part === t('map.minutes')) {
                        return acc + parseInt(arr[index - 1]);
                    }
                    return acc;
                }, 0),
            );
            const expectedArrival = new Date(Date.now());
            expectedArrival.setMinutes(expectedArrival.getMinutes() + durationMinutes);
            if (expectedArrival > eventStart) {
                const minutesLate = Math.round((expectedArrival.getTime() - eventStart.getTime()) / 60000);
                setLateMinutes(minutesLate);
                modalizeRef.current?.open();
            }
        }
    }, [startAt, travelTime, lateMinutes, t]);

    const calculateZoomLevel = () => {
        if (!userLocation || !eventLocation) return 14;

        const R = 6371;
        const dLat = ((eventLocation.lat - userLocation.latitude) * Math.PI) / 180;
        const dLon = ((eventLocation.lng - userLocation.longitude) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((userLocation.latitude * Math.PI) / 180) *
                Math.cos((eventLocation.lat * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        if (previewMode) return 13;
        if (fullscreenMode) {
            if (distance > 10) return 10;
            if (distance > 5) return 11;
            if (distance > 1) return 13;
            return 14;
        }

        // Default for small map
        if (distance > 10) return 9;
        if (distance > 5) return 11;
        if (distance > 1) return 13;
        return 14;
    };

    const openExternalMap = () => {
        if (!userLocation || !eventLocation?.lat || !eventLocation?.lng) {
            setLateMinutes(0);
            modalizeRef.current?.open();
            return;
        }

        const latitude = eventLocation.lat;
        const longitude = eventLocation.lng;
        const label = eventLocation.name || t('map.event_location');
        const latLng = `${latitude},${longitude}`;

        const transportModeFinal = transportModes.find((mode) => mode.id === selectedTransportMode);

        if (Platform.OS === 'ios') {
            const appleMode = transportModeFinal?.externalMap.apple || 'd';
            const appleMapsUrl = `maps://?q=${encodeURIComponent(label)}&sll=${latLng}&dirflg=${appleMode}`;
            const googleMapsUrl = `comgooglemaps://?q=${encodeURIComponent(label)}&center=${latLng}&zoom=15&daddr=${latLng}&directionsmode=${transportModeFinal?.externalMap.google || 'driving'}`;

            Linking.canOpenURL(googleMapsUrl).then((supported) => {
                if (supported) {
                    Linking.openURL(googleMapsUrl).catch(() => {
                        setLateMinutes(0);
                        modalizeRef.current?.open();
                    });
                } else {
                    Linking.openURL(appleMapsUrl).catch(() => {
                        setLateMinutes(0);
                        modalizeRef.current?.open();
                    });
                }
            });
        } else {
            const googleMode = transportModeFinal?.externalMap.google || 'driving';
            const geoUrl = `geo:0,0?q=${latLng}(${encodeURIComponent(label)})`;
            const navigationUrl = `google.navigation:q=${latLng}&mode=${googleMode}`;

            Linking.canOpenURL(navigationUrl).then((supported) => {
                if (supported) {
                    Linking.openURL(navigationUrl).catch(() => {
                        setLateMinutes(0);
                        modalizeRef.current?.open();
                    });
                } else {
                    const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latLng}&travelmode=${googleMode}`;

                    Linking.openURL(webUrl).catch(() => {
                        setLateMinutes(0);
                        modalizeRef.current?.open();
                    });
                }
            });
        }
    };

    const toggleMapStyle = () => {
        if (mapStyle === 'mapbox://styles/mapbox/streets-v12') {
            setMapStyle('mapbox://styles/mapbox/satellite-streets-v12');
        } else {
            setMapStyle('mapbox://styles/mapbox/streets-v12');
        }
    };

    const renderTransportOptions = () => {
        if (previewMode) return null;

        return (
            <View style={styles.transportOptionsContainer}>
                <View style={styles.transportOptionsHeader}>
                    <View style={styles.transportIcons}>
                        {transportModes.map((mode) => (
                            <TouchableOpacity
                                key={mode.id}
                                style={[
                                    styles.transportIcon,
                                    selectedTransportMode === mode.id ? styles.transportIconSelected : null,
                                ]}
                                onPress={() => {
                                    setSelectedTransportMode(mode.id);
                                    setCenterUserLocation(false);
                                }}
                            >
                                <Ionicons
                                    // @ts-ignore
                                    name={mode.icon}
                                    size={20}
                                    color={selectedTransportMode === mode.id ? 'white' : '#4b5563'}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                    {travelTime && (
                        <TextComponent
                            style={{
                                maxWidth: '50%',
                            }}
                            text={`${travelTime} ${travelDistance}`}
                            size={12}
                            className='text-gray-600 ml-2 font-medium'
                            numberOfLines={1}
                            ellipsizeMode='tail'
                        />
                    )}
                    <TouchableOpacity style={styles.transportOptionsToggle}></TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderBottomInfo = () => {
        if (previewMode) return null;

        return (
            <View style={styles.bottomInfoContainer}>
                <TouchableOpacity style={styles.infoTab} onPress={() => setShowBottomControls(!showBottomControls)}>
                    <View style={styles.infoTabContent}>
                        <View style={styles.infoHeader}>
                            <Ionicons
                                name={
                                    selectedTransportMode === 'walking'
                                        ? 'walk'
                                        : selectedTransportMode === 'driving'
                                          ? 'bicycle'
                                          : 'car'
                                }
                                size={18}
                                color={colors.primary400}
                            />
                            {travelTime && travelDistance && (
                                <TextComponent
                                    text={`${travelTime} ${travelDistance}`}
                                    size={14}
                                    className='font-medium ml-2'
                                />
                            )}
                        </View>
                        <Ionicons name={showBottomControls ? 'chevron-down' : 'chevron-up'} size={18} color='#4b5563' />
                    </View>
                </TouchableOpacity>
                {showBottomControls && (
                    <View style={styles.expandedInfo}>
                        <TouchableOpacity style={styles.startButton} onPress={openExternalMap}>
                            <Ionicons name='navigate' size={18} color='white' />
                            <TextComponent
                                text={t('map.start_navigation')}
                                size={14}
                                className='text-white font-bold ml-2'
                            />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

    const renderMapControls = () => {
        return (
            <View style={styles.mapControls}>
                {!previewMode && (
                    <>
                        <TouchableOpacity
                            style={styles.mapButton}
                            onPress={() => {
                                if (cameraRef.current && userLocation) {
                                    cameraRef.current?.setCamera({
                                        centerCoordinate: [userLocation.longitude, userLocation.latitude],
                                        zoomLevel: 15,
                                        animationDuration: 1000,
                                    });
                                    setCenterUserLocation(true);
                                }
                            }}
                        >
                            <Ionicons
                                name='locate'
                                size={20}
                                color={centerUserLocation ? colors.primary400 : '#4b5563'}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.mapButton} onPress={toggleMapStyle}>
                            <Ionicons name='layers' size={20} color='#4b5563' />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.mapButton}
                            onPress={() => {
                                if (boundingBox && cameraRef.current) {
                                    cameraRef.current?.setCamera({
                                        bounds: boundingBox,
                                        animationDuration: 1000,
                                    });
                                }
                            }}
                        >
                            <Ionicons name='expand' size={20} color='#4b5563' />
                        </TouchableOpacity>
                    </>
                )}
            </View>
        );
    };

    const renderLateWarningModal = () => {
        return (
            <PortalizeComponent
                ref={modalizeRef}
                radius={20}
                onClose={() => {
                    setLateMinutes(0);
                }}
            >
                <View style={styles.modalContainer}>
                    <Ionicons name='warning-outline' size={40} color={colors.error} />
                    <TextComponent text={t('map.warning')} size={18} className='font-bold mt-4 text-center' />
                    <TextComponent
                        text={
                            lateMinutes > 0
                                ? t('map.late_warning', { minutes: formatTime(lateMinutes) })
                                : t('map.missing_location_info')
                        }
                        size={16}
                        className='text-center mt-2 text-gray-600'
                    />
                    <TouchableOpacity style={styles.modalButton} onPress={() => modalizeRef.current?.close()}>
                        <TextComponent text={t('map.close')} size={16} className='text-white font-bold' />
                    </TouchableOpacity>
                </View>
            </PortalizeComponent>
        );
    };

    if (mapError) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name='warning-outline' size={40} color={colors.error} />
                <TextComponent text={mapError} size={16} className='text-center mt-2' />
                <TextComponent text={t('map.check_connection')} size={14} className='text-center mt-1 text-gray-500' />
            </View>
        );
    }

    if (!isMapReady || !userLocation || !eventLocation) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color={colors.primary400} />
                <TextComponent text={t('map.loading_map')} size={16} className='text-center mt-2' />
            </View>
        );
    }

    const getBoundingBox = () => {
        if (!userLocation || !eventLocation) return null;

        // Increase padding for fullscreen mode
        const padding = fullscreenMode ? 0.01 : 0.02;

        const minLng = Math.min(userLocation.longitude, eventLocation.lng);
        const maxLng = Math.max(userLocation.longitude, eventLocation.lng);
        const minLat = Math.min(userLocation.latitude, eventLocation.lat);
        const maxLat = Math.max(userLocation.latitude, eventLocation.lat);

        // Make the bounding box a bit wider/taller for better visibility
        const width = maxLng - minLng;
        const height = maxLat - minLat;

        return {
            ne: [maxLng + padding * width, maxLat + padding * height],
            sw: [minLng - padding * width, minLat - padding * height],
            paddingTop: fullscreenMode ? 120 : 50,
            paddingBottom: fullscreenMode ? 150 : 50,
            paddingLeft: fullscreenMode ? 50 : 50,
            paddingRight: fullscreenMode ? 50 : 50,
        };
    };

    const zoomLevel = calculateZoomLevel();
    const boundingBox = getBoundingBox();

    return (
        <View style={styles.container}>
            <Mapbox.MapView
                style={styles.map}
                styleURL={mapStyle}
                zoomEnabled={true}
                scrollEnabled={true}
                rotateEnabled={true}
                pitchEnabled={true}
                compassEnabled={fullscreenMode}
                logoEnabled={fullscreenMode}
                scaleBarEnabled={fullscreenMode}
                onDidFinishLoadingMap={() => {
                    console.trace('Map finished loading');
                    setIsMapReady(true);
                }}
            >
                {boundingBox && (
                    <Mapbox.Camera
                        ref={cameraRef}
                        bounds={boundingBox}
                        zoomLevel={zoomLevel}
                        animationDuration={300}
                        animationMode='flyTo'
                    />
                )}

                {userLocation && (
                    <Mapbox.PointAnnotation
                        id='userLocation'
                        coordinate={[userLocation.longitude, userLocation.latitude]}
                    >
                        <View style={styles.userMarkerContainer}>
                            <View style={styles.userMarker} />
                            <View style={styles.userMarkerPulse} />
                        </View>
                        <Mapbox.Callout title={t('attendance_details.your_location')} />
                    </Mapbox.PointAnnotation>
                )}

                {eventLocation && (
                    <Mapbox.PointAnnotation
                        id='eventLocation'
                        coordinate={[eventLocation.lng, eventLocation.lat]}
                        title={eventLocation.name || t('map.event_location')}
                        selected={true}
                    >
                        <View style={styles.eventMarker}>
                            <View style={styles.eventMarkerIcon}>
                                <Ionicons name='location-sharp' size={22} color='white' />
                            </View>
                        </View>
                        <Mapbox.Callout title={eventLocation.name || t('map.event_location')} />
                    </Mapbox.PointAnnotation>
                )}

                {route && (
                    <Mapbox.ShapeSource id='routeSource' shape={route}>
                        <Mapbox.LineLayer
                            id='routeLine'
                            style={{
                                lineColor: '#3b82f6',
                                lineWidth: 4,
                                lineCap: 'round',
                                lineJoin: 'round',
                            }}
                        />
                    </Mapbox.ShapeSource>
                )}

                {route && (
                    <Mapbox.ShapeSource id='routeOutlineSource' shape={route}>
                        <Mapbox.LineLayer
                            id='routeOutlineLine'
                            belowLayerID='routeLine'
                            style={{
                                lineColor: '#93c5fd',
                                lineWidth: 6,
                                lineCap: 'round',
                                lineJoin: 'round',
                                lineOpacity: 0.5,
                            }}
                        />
                    </Mapbox.ShapeSource>
                )}
            </Mapbox.MapView>

            {renderTransportOptions()}
            {renderBottomInfo()}
            {renderMapControls()}
            {renderLateWarningModal()}

            {isRouteFetching && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size='large' color={colors.primary400} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden',
        height: '100%',
        position: 'relative',
    },
    map: {
        flex: 1,
        height: '100%',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 20,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userMarkerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
    },
    userMarker: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: colors.primary300,
        borderWidth: 3,
        borderColor: 'white',
    },
    userMarkerPulse: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: colors.primary300,
        zIndex: -1,
    },
    eventMarker: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    eventMarkerIcon: {
        width: 32,
        height: 32,
        backgroundColor: '#ef4444',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
        borderWidth: 2,
        borderColor: 'white',
    },
    poiMarker: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapControls: {
        position: 'absolute',
        right: 16,
        top: 100,
        flexDirection: 'column',
        gap: 8,
    },
    mapButton: {
        width: 36,
        height: 36,
        backgroundColor: 'white',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    transportOptionsContainer: {
        position: 'absolute',
        top: 60,
        alignSelf: 'center',
        zIndex: 5,
        width: '90%',
        maxWidth: 320,
    },
    transportOptionsHeader: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    transportIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    transportIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 2,
    },
    transportIconSelected: {
        backgroundColor: '#3b82f6',
    },
    transportOptionsToggle: {
        padding: 4,
        marginLeft: 6,
    },
    expandedTransportOptions: {
        backgroundColor: 'white',
        borderRadius: 16,
        marginTop: 8,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    transportOptionExpanded: {
        padding: 12,
        borderRadius: 8,
        marginVertical: 4,
    },
    transportOptionExpandedSelected: {
        backgroundColor: '#3b82f6',
    },
    transportOptionContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bottomInfoContainer: {
        position: 'absolute',
        bottom: 20,
        left: 16,
        right: 16,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoTab: {
        backgroundColor: 'white',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    infoTabContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    expandedInfo: {
        backgroundColor: 'white',
        padding: 12,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    startButton: {
        backgroundColor: '#3b82f6',
        borderRadius: 8,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    modalButton: {
        backgroundColor: '#3b82f6',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 20,
        alignItems: 'center',
    },
});

export default EventMap;
