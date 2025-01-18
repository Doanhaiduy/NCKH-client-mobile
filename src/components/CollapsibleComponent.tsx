import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Collapsible from "react-native-collapsible";
import Accordion from "react-native-collapsible/Accordion";

const CollapsibleComponent = () => {
    const [activeSections, setActiveSections] = React.useState<number[]>([]);

    const renderHeader = (section: string, _: number, isActive: boolean) => {
        return (
            <View style={{ backgroundColor: isActive ? "lightgray" : "white" }}>
                <Text>{section}</Text>
            </View>
        );
    };

    const renderContent = (section: string) => {
        return (
            <View>
                <Text>{section} content</Text>
            </View>
        );
    };

    return (
        <Accordion
            activeSections={activeSections}
            sections={["Section 1", "Section 2", "Section 3"]}
            renderContent={renderContent}
            renderHeader={renderHeader}
            onChange={(sections) => setActiveSections(sections)}
        />
    );
};

export default CollapsibleComponent;

const styles = StyleSheet.create({});
