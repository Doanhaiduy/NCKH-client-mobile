import { StyleSheet, View } from "react-native";
import React, { useCallback, useState } from "react";
import Carousel from "react-native-reanimated-carousel";
import { appInfo } from "@/constants/appInfo";
import { EventData } from "@/mockData";
import ItemCardGrid from "./ItemCardGrid";
import { useSharedValue } from "react-native-reanimated";
import AnimatedDotsCarousel from "react-native-animated-dots-carousel";
import { router, useFocusEffect } from "expo-router";

interface Props {
    data: CardItemData[];
    autoPlay?: boolean;
    duration?: number;
}

export default function SlideCardComponent(props: Props) {
    const { data, autoPlay, duration } = props;

    const scrollOffsetValue = useSharedValue<number>(0);
    const [isVertical, setIsVertical] = useState(false);
    const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(autoPlay || false);

    const [index, setIndex] = useState(0);

    const baseOptions = isVertical
        ? ({
              vertical: true,
              width: appInfo.sizes.WIDTH * 0.95,
              height: 365,
          } as const)
        : ({
              vertical: false,
              width: appInfo.sizes.WIDTH * 0.95,
              height: 365,
          } as const);

    useFocusEffect(
        useCallback(() => {
            setIsAutoPlayEnabled(true); // Enable autoPlay when screen is focused

            return () => {
                setIsAutoPlayEnabled(false); // Disable autoPlay when screen is unfocused
            };
        }, []),
    );

    return (
        <View style={{ height: 380 }}>
            <Carousel
                {...baseOptions}
                loop
                defaultScrollOffsetValue={scrollOffsetValue}
                testID={"xxx"}
                style={{ width: "100%" }}
                autoPlay={isAutoPlayEnabled}
                autoPlayInterval={duration || 5000}
                data={data}
                pagingEnabled={true}
                panGestureHandlerProps={{
                    activeOffsetX: [-10, 10],
                }}
                onSnapToItem={(index) => setIndex(index)}
                renderItem={({ item, index }) => (
                    <View className="mx-2">
                        <ItemCardGrid
                            size="large"
                            key={index}
                            data={item}
                            onPress={() => {
                                router.push(`/activity/${item._id}`);
                            }}
                        />
                    </View>
                )}
            />
            <View
                style={[
                    {
                        marginHorizontal: "auto",
                        height: 25,
                    },
                ]}
            >
                <AnimatedDotsCarousel
                    length={EventData.length - 1}
                    currentIndex={index}
                    maxIndicators={EventData.length - 1}
                    interpolateOpacityAndColor={true}
                    activeIndicatorConfig={{
                        color: "#FFD000",
                        margin: 3,
                        opacity: 1,
                        size: 8,
                    }}
                    inactiveIndicatorConfig={{
                        color: "#D9D9D9",
                        margin: 3,
                        opacity: 0.5,
                        size: 8,
                    }}
                    decreasingDots={[
                        {
                            config: { color: "white", margin: 3, opacity: 0.5, size: 6 },
                            quantity: 1,
                        },
                        {
                            config: { color: "white", margin: 3, opacity: 0.5, size: 4 },
                            quantity: 1,
                        },
                    ]}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({});
