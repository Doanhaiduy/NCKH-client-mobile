import React, { forwardRef } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';

interface Props {
    children: React.ReactNode;
    radius?: number;
}

const PortalizeComponent = forwardRef((props: Props, ref) => {
    const { children, radius } = props;

    return (
        <Portal>
            <Modalize
                ref={ref}
                adjustToContentHeight
                childrenStyle={{
                    borderTopRightRadius: radius || 50,
                    borderTopLeftRadius: radius || 50,
                    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
                    paddingTop: 20,
                }}
            >
                {children}
            </Modalize>
        </Portal>
    );
});

const styles = StyleSheet.create({});

export default PortalizeComponent;
