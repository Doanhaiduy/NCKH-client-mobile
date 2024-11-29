import { ContainerComponent, SectionComponent, TextComponent } from '@/components';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function TermsPolicies() {
    return (
        <ContainerComponent isScroll iconLeft="back" title="Điều khoản và chính sách" notification>
            <SectionComponent title="Điều khoản sử dụng">
                <TextComponent
                    text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vehicula, leo non ornare
                    suscipit, mauris nibh egestas dui, placerat tristique nisl risus et augue. Nulla facilisi. Sed nec
                    mi nec sapi en. Nullam in nunc nec purus ultrices lacinia. Nulla facilisi. Sed nec mi nec sapien.
                    Nullam in nunc nec purus ultrices lacinia."
                />
                <TextComponent
                    text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vehicula, leo non ornare
                    suscipit, mauris nibh egestas dui, placerat tristique nisl risus et augue. Nulla facilisi. Sed nec
                    mi nec sapi en. Nullam in nunc nec purus ultrices lacinia. Nulla facilisi. Sed nec mi nec sapien.
                    Nullam in nunc nec purus ultrices lacinia."
                />
            </SectionComponent>
            <SectionComponent title="Chính sách bảo mật">
                <TextComponent
                    text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vehicula, leo non ornare
                    suscipit, mauris nibh egestas dui, placerat tristique nisl risus et augue. Nulla facilisi. Sed nec
                    mi nec sapi en. Nullam in nunc nec purus ultrices lacinia. Nulla facilisi. Sed nec mi nec sapien.
                    Nullam in nunc nec purus ultrices lacinia."
                />
                <TextComponent
                    text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vehicula, leo non ornare
                    suscipit, mauris nibh egestas dui, placerat tristique nisl risus et augue. Nulla facilisi. Sed nec
                    mi nec sapi en. Nullam in nunc nec purus ultrices lacinia. Nulla facilisi. Sed nec mi nec sapien.
                    Nullam in nunc nec purus ultrices lacinia."
                />
            </SectionComponent>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
