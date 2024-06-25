import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { ContainerComponent, LanguageCard, SectionComponent, SpaceComponent, TextComponent } from '@/components';

const LanguageData = [
    {
        name: 'Tiếng Việt',
        icon: 'https://s3-alpha-sig.figma.com/img/847c/878a/35cd32c837751de0827b1ff22123bd54?Expires=1720396800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=CbvPn~epEQJzeKkXeXQcn7fqYo5wkBaMVc-JAj-jULG9EOZg3opzeU1ui0Q-QzSQiNWiE~KwXxe-V8za3cMutI9LpEqgwQYXS-tv4E5YsyLknH~D8NQ-PGkcyEYqe08R24Af2qvpYkYQUZ20RkgVsE3U9yNkKApVwXue6qT-9XUHAlRfpTV6jcjSLq0LTUadkbAHDX2Fh-6bPI1uE1WH23bpgxMV1i0QtdQ1J0vipU6fLW6TGW3D66lInGGcyBsYQMO4bSDVvu7JJk9RqQk0zVsAfzX6UJYqP78pgtjTQ5jvnrpy1ID975WLuQHL0FYKHDJp0B47atxTECUTJoQUHg__',
        lang: 'vi',
    },
    {
        name: 'English',
        icon: 'https://s3-alpha-sig.figma.com/img/ea84/6b87/aaf26a1bcfe670c3bc4b131a362728d5?Expires=1720396800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=IEOqtuLIzjOwpGF0x2C~Tn8xN5LRhR6vFZrcOXrvEYxQzbuK1p5dA9jJdVxzPK9xK3ukH1iyqDeebdPpnisrVpffnESmz9writuEy1gT~gTloMGTDShN3M0SbCuuyjEHksVY73qd3dYfteSoE4zC-dQe8HCvKNfTtlpHfoCPwyosiVS2qZUHnEnK~a97KUQ61Srhk~5brhnPXJBSXpxmqIaHjWnlLSu7ueVFNfJppNStnDcNXO5RdapDmERJb6xCXdnAhPmdiCuXvqN3Ze6rvfDVECYJhzr5iM6nFtCCChUKCurWp0TxfmuFmuxMrPJ1iH8YQIpYoerNWZ3dsPJQAQ__',
        lang: 'en',
    },
];

export default function Language() {
    const [lang, setLang] = useState('vi');

    return (
        <ContainerComponent iconLeft="back" title="Ngôn ngữ" search>
            <TextComponent text="Chọn ngôn ngữ của bạn:" size={16} className="my-4 ml-4" />
            <SectionComponent>
                {LanguageData.map((item, index) => (
                    <LanguageCard
                        lang={item.lang}
                        key={index}
                        text={item.name}
                        icon={item.icon}
                        active={item.lang === lang}
                        onPress={(val: string) => setLang(val)}
                    />
                ))}
            </SectionComponent>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
