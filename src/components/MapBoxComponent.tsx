// Simplified MapBoxComponent.tsx for Student Event Navigation
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
    Linking,
    Animated,
    Text,
    Image,
} from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors } from '@/constants/colors';
import { TextComponent } from '@/components';
import PortalizeComponent from './PortalizeComponent';
import { Modalize } from 'react-native-modalize';

// Lấy access token từ biến môi trường
const MAPBOX_ACCESS_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_API_KEY!;

// Thiết lập public access token
try {
    Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);
} catch (error) {
    console.error('Lỗi khi khởi tạo Mapbox:', error);
}

const EventMap = ({
    userLocation,
    eventLocation,
    hasLocationPermission,
    previewMode = false,
    fullscreenMode = false,
    startAt,
}: {
    userLocation: { latitude: number; longitude: number } | null;
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

    const transportModes = [
        { id: 'walking', icon: 'walk-outline', label: t('map.walk') },
        { id: 'driving', icon: 'car-outline', label: t('map.car') },
        { id: 'cycling', icon: 'bicycle-outline', label: t('map.bike') },
    ];

    useEffect(() => {
        const checkMapboxStatus = async () => {
            if (!MAPBOX_ACCESS_TOKEN || MAPBOX_ACCESS_TOKEN === 'YOUR_BACKUP_TOKEN') {
                setMapError(t('map.missing_token'));
                return;
            }

            try {
                if (userLocation && eventLocation) {
                    const response = await fetch(
                        `https://api.mapbox.com/geocoding/v5/mapbox.places/${eventLocation.lng},${eventLocation.lat}.json?access_token=${MAPBOX_ACCESS_TOKEN}`,
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

    const handleGetDirections = async () => {
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
                `https://api.mapbox.com/directions/v5/mapbox/${selectedTransportMode}/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`,
            );

            if (!response.ok) {
                throw new Error(`Directions API error: ${response.status}`);
            }

            const responseData = await response.json();
            if (responseData.routes && responseData.routes.length > 0) {
                setRoute(responseData.routes[0].geometry);

                // Calculate and set travel time
                const durationInSeconds = responseData.routes[0].duration;
                const minutes = Math.round(durationInSeconds / 60);
                setTravelTime(`${minutes} ${t('map.minutes')}`);

                // Calculate and set travel distance
                const distanceInMeters = responseData.routes[0].distance;
                if (distanceInMeters < 1000) {
                    setTravelDistance(`(${Math.round(distanceInMeters)} m)`);
                } else {
                    const distanceInKm = (distanceInMeters / 1000).toFixed(1);
                    setTravelDistance(`(${distanceInKm} km)`);
                }

                // Animate the UI feedback
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
    };

    // Get route when mounting the map or when transport mode changes
    useEffect(() => {
        if (userLocation && eventLocation) {
            handleGetDirections();
        }
    }, [userLocation, eventLocation, selectedTransportMode]);

    // Cảnh báo đi trễ sử dụng Modalize
    useEffect(() => {
        if (startAt && travelTime) {
            const eventStart = new Date(startAt);
            const durationMinutes = parseInt(travelTime.split(' ')[0]);
            const expectedArrival = new Date(Date.now());
            expectedArrival.setMinutes(expectedArrival.getMinutes() + durationMinutes);
            if (expectedArrival > eventStart) {
                console.log('Late warning triggered');
                const minutesLate = Math.round((expectedArrival.getTime() - eventStart.getTime()) / 60000);
                setLateMinutes(minutesLate);
                modalizeRef.current?.open();
            }
        }
    }, [startAt, travelTime]);

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

        if (Platform.OS === 'ios') {
            // Apple Maps with label + navigation
            const appleMapsUrl = `maps:?q=${label}@${latLng}&dirflg=${selectedTransportMode?.[0] || 'd'}`;

            // Google Maps iOS
            const googleMapsUrl = `comgooglemaps://?q=${latLng}(${label})&center=${latLng}&zoom=15&daddr=${latLng}&directionsmode=${selectedTransportMode}`;

            Linking.canOpenURL(googleMapsUrl).then((supported) => {
                if (supported) {
                    setLateMinutes(0);
                    modalizeRef.current?.open();
                } else {
                    // Default to Apple Maps
                    Linking.openURL(appleMapsUrl).catch(() => {
                        setLateMinutes(0);
                        modalizeRef.current?.open();
                    });
                }
            });
        } else {
            // Android
            const geoUrl = `geo:0,0?q=${latLng}(${label})`;

            const navigationUrl = `google.navigation:q=${latLng}&mode=${selectedTransportMode}`;

            Linking.canOpenURL(navigationUrl).then((supported) => {
                if (supported) {
                    setLateMinutes(0);
                    modalizeRef.current?.open();
                } else {
                    // Fallback to web Google Maps
                    const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latLng}&travelmode=${selectedTransportMode}`;
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

    // Compact transport mode selector
    const renderTransportOptions = () => {
        if (previewMode) return null;

        return (
            <View style={styles.transportOptionsContainer}>
                <View style={styles.transportOptions}>
                    {transportModes.map((mode) => (
                        <TouchableOpacity
                            key={mode.id}
                            style={[
                                styles.transportOption,
                                selectedTransportMode === mode.id ? styles.transportOptionSelected : null,
                            ]}
                            onPress={() => {
                                setSelectedTransportMode(mode.id);
                                setCenterUserLocation(false);
                            }}
                        >
                            <Ionicons
                                //@ts-ignore
                                name={mode.icon}
                                size={20}
                                color={selectedTransportMode === mode.id ? 'white' : '#4b5563'}
                            />
                            {selectedTransportMode === mode.id && travelTime && (
                                <TextComponent
                                    text={travelTime}
                                    size={10}
                                    className={`${selectedTransportMode === mode.id ? 'text-white' : 'text-gray-600'}`}
                                />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        );
    };

    // Compact bottom info panel with expandable details
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
                                        : selectedTransportMode === 'cycling'
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

    // Reorganized map controls
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

    // Render modal cảnh báo
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
                                ? t('map.late_warning', { minutes: lateMinutes })
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

                {/* Route line if available */}
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
        top: 20,
        alignSelf: 'center',
        zIndex: 5,
    },
    transportOptions: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    transportOption: {
        width: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        marginHorizontal: 2,
    },
    transportOptionSelected: {
        backgroundColor: '#3b82f6',
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
