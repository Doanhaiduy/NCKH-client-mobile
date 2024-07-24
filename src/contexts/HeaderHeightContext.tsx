import { appInfo } from '@/constants/appInfo';
import React, { createContext, useContext, useState } from 'react';
import { Platform } from 'react-native';

const HeaderHeightContext = createContext({
    headerHeight: appInfo.headerHeight.default,
    setHeaderHeight: (height: number) => {},
});

export const HeaderHeightProvider = ({ children }: { children: React.ReactNode }) => {
    const [headerHeight, setHeaderHeight] = useState(appInfo.headerHeight.default);
    return (
        <HeaderHeightContext.Provider value={{ headerHeight, setHeaderHeight }}>
            {children}
        </HeaderHeightContext.Provider>
    );
};

export const useHeaderHeight = () => {
    return useContext(HeaderHeightContext);
};
