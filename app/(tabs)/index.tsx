import { Link, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function HomePage() {
    return (
        <View style={styles.container}>
            <View style={styles.main}>
                <Text style={styles.title}>Hello World</Text>
                <Link href={'/users/1'}>Go to UserPage 1</Link>
                <Text style={styles.subtitle}>This is the first page of your app.</Text>
                <Pressable
                    onPress={() =>
                        router.push({
                            pathname: '/users/[id]',
                            params: { id: 2 },
                        })
                    }
                >
                    <Text>go to user2</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 24,
    },
    main: {
        flex: 1,
        justifyContent: 'center',
        maxWidth: 960,
        marginHorizontal: 'auto',
    },
    title: {
        fontSize: 64,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 36,
        color: '#38434D',
    },
});
