import { StyleSheet, View } from 'react-native';
import React from 'react';
import Carousel from 'react-native-reanimated-carousel';
import { appInfo } from '@/constants/appInfo';
import { EventData } from '@/mockData';
import ItemCardGrid from './ItemCardGrid';
import { useSharedValue } from 'react-native-reanimated';
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel';
import { globalStyles } from '@/styles';

interface Props {
    data: CardItemData[];
    autoPlay?: boolean;
    duration?: number;
}

export default function SlideCardComponent(props: Props) {
    const { data, autoPlay, duration } = props;

    const scrollOffsetValue = useSharedValue<number>(0);
    const [isVertical, setIsVertical] = React.useState(false);
    const [index, setIndex] = React.useState(0);

    const baseOptions = isVertical
        ? ({
              vertical: true,
              width: appInfo.sizes.WIDTH,
              height: 365,
          } as const)
        : ({
              vertical: false,
              width: appInfo.sizes.WIDTH,
              height: 365,
          } as const);

    return (
        <View style={{ flex: 1, height: 290 }}>
            <Carousel
                {...baseOptions}
                loop
                defaultScrollOffsetValue={scrollOffsetValue}
                testID={'xxx'}
                style={{ width: '100%' }}
                autoPlay={autoPlay}
                autoPlayInterval={duration || 5000}
                data={data}
                pagingEnabled={true}
                panGestureHandlerProps={{
                    activeOffsetX: [-10, 10],
                }}
                onSnapToItem={(index) => setIndex(index)}
                renderItem={({ item, index }) => (
                    <View className="mx-2">
                        <ItemCardGrid size="large" key={index} data={item} onPress={() => {}} />
                    </View>
                )}
            />
            <View
                style={[
                    {
                        marginHorizontal: 'auto',
                        height: 25,
                    },
                ]}
            >
                <AnimatedDotsCarousel
                    length={EventData.length}
                    currentIndex={index}
                    maxIndicators={EventData.length}
                    interpolateOpacityAndColor={true}
                    activeIndicatorConfig={{
                        color: '#FFD000',
                        margin: 3,
                        opacity: 1,
                        size: 8,
                    }}
                    inactiveIndicatorConfig={{
                        color: '#D9D9D9',
                        margin: 3,
                        opacity: 0.5,
                        size: 8,
                    }}
                    decreasingDots={[
                        {
                            config: { color: 'white', margin: 3, opacity: 0.5, size: 6 },
                            quantity: 1,
                        },
                        {
                            config: { color: 'white', margin: 3, opacity: 0.5, size: 4 },
                            quantity: 1,
                        },
                    ]}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({});
