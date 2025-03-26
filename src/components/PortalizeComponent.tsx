import React, { forwardRef } from 'react';
import { Platform } from 'react-native';
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';

interface Props {
    children: React.ReactNode;
    radius?: number;
    onClose?: () => void;
}

const PortalizeComponent = forwardRef((props: Props, ref) => {
    const { children, radius, onClose } = props;

    return (
        <Portal>
            <Modalize
                onClose={onClose}
                ref={ref}
                adjustToContentHeight
                childrenStyle={{
                    borderTopRightRadius: radius || 50,
                    borderTopLeftRadius: radius || 50,
                    paddingBottom: Platform.OS === 'ios' ? 30 : 0,
                    paddingTop: 20,
                }}
            >
                {children}
            </Modalize>
        </Portal>
    );
});

export default PortalizeComponent;
