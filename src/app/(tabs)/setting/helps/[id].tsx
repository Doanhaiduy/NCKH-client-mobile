import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ContainerComponent, SectionComponent, TextComponent } from '@/components';

const DetailsUserGuid = () => {
    const { id, title } = useLocalSearchParams();

    return (
        <ContainerComponent iconLeft="back" title="Hướng dẫn sử dụng" notification>
            <SectionComponent title={title?.toString() || ''}>
                <TextComponent text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vehicula, leo non ornare suscipit, mauris nibh egestas dui, placerat tristique nisl risus et augue." />
            </SectionComponent>
            <SectionComponent className="" title="Chức năng">
                <TextComponent text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vehicula, leo non ornare suscipit, mauris nibh egestas dui, placerat tristique nisl risus et augue." />
            </SectionComponent>
        </ContainerComponent>
    );
};

export default DetailsUserGuid;

const styles = StyleSheet.create({});
