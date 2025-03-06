import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import {
    CollapsibleGuideComponent,
    ContainerComponent,
    SectionComponent,
    SpaceComponent,
    TextComponent,
} from '@/components';
import { ScrollView } from 'react-native-gesture-handler';
import { colors } from '@/constants/colors';

interface GuideContent {
    content: string;
    image?: string;
}
interface GuideSection {
    title: string;
    content: string | string[] | GuideContent[];
    image?: string;
    isMainFeature?: boolean;
    highlighted?: boolean;
}

const guideSections: GuideSection[] = [
    {
        title: 'Giới thiệu tính năng điểm danh bằng mã QR',
        content:
            'Tính năng điểm danh bằng mã QR giúp bạn dễ dàng quản lý việc điểm danh lớp học hoặc sự kiện mà không cần điểm danh thủ công từng người. Hệ thống sẽ tự động ghi nhận thông tin điểm danh thông qua việc quét mã QR.',
        image: 'https://images.pexels.com/photos/30847375/pexels-photo-30847375/free-photo-of-ng-i-dan-ong-sanh-di-u-di-d-c-theo-b-c-t-ng-g-ch-luc-hoang-hon.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
    },
    {
        title: 'Giới thiệu tính năng điểm danh bằng mã QR',
        content:
            'Tính năng điểm danh bằng mã QR giúp bạn dễ dàng quản lý việc điểm danh lớp học hoặc sự kiện mà không cần điểm danh thủ công từng người. Hệ thống sẽ tự động ghi nhận thông tin điểm danh thông qua việc quét mã QR.',
        image: 'https://126.vn/uploads/2023/11/hinh-nen-toi-cho-ipohne-126vn-17.webp',
    },
    {
        title: 'Cách tạo mã QR điểm danh',
        content: [
            'Đăng nhập vào tài khoản giáo viên/quản lý',
            'Chọn lớp học/sự kiện cần điểm danh',
            'Nhấn vào nút "Tạo mã QR" ở góc phải màn hình',
            'Chọn thời gian hiệu lực của mã QR (mặc định là 15 phút)',
            'Nhấn "Xác nhận" để tạo mã',
        ],
    },
    {
        title: 'Cách chia sẻ mã QR với người tham gia',
        content: [
            {
                content: 'Sử dụng tính năng "Trình chiếu mã QR" để hiển thị mã',
                image: 'https://images.pexels.com/photos/30847375/pexels-photo-30847375/free-photo-of-ng-i-dan-ong-sanh-di-u-di-d-c-theo-b-c-t-ng-g-ch-luc-hoang-hon.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
            },
            {
                content: 'Sử dụng tính năng "Trình chiếu mã QR" để hiển thị mã',
                image: 'https://images.pexels.com/photos/30847375/pexels-photo-30847375/free-photo-of-ng-i-dan-ong-sanh-di-u-di-d-c-theo-b-c-t-ng-g-ch-luc-hoang-hon.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
            },
            {
                content: 'Sử dụng tính năng "Trình chiếu mã QR" để hiển thị mã',
                image: 'https://images.pexels.com/photos/30840677/pexels-photo-30840677/free-photo-of-phong-c-nh-bi-n-tuy-t-d-p-v-i-nh-ng-kh-i-da-g-gh.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
            },
        ],
    },
    {
        title: 'Cách chia sẻ mã QR với người tham gia',
        content: [
            'Sử dụng tính năng "Trình chiếu mã QR" để hiển thị mã trên màn hình lớn',
            'Sử dụng nút "Chia sẻ" để gửi mã QR qua các ứng dụng tin nhắn',
            'Nhấn "Lưu ảnh" để lưu mã QR vào thiết bị và in ra nếu cần',
        ],
    },
    {
        title: 'Hướng dẫn học viên điểm danh',
        content:
            'Học viên chỉ cần mở ứng dụng, chọn mục "Quét mã QR" và quét mã được hiển thị. Hệ thống sẽ tự động xác thực và ghi nhận thông tin điểm danh của học viên đó.',
    },
    {
        title: 'Các tính năng con',
        content: [
            'Điểm danh theo vị trí GPS',
            'Điểm danh có giới hạn thời gian',
            'Điểm danh có xác thực khuôn mặt',
            'Báo cáo thống kê điểm danh',
        ],
    },
    {
        title: 'Xem báo cáo điểm danh',
        content:
            'Sau khi hoàn tất quá trình điểm danh, giáo viên/quản lý có thể xem báo cáo chi tiết bằng cách vào mục "Báo cáo" > "Điểm danh". Tại đây bạn có thể xem danh sách những người đã điểm danh, thời gian điểm danh và xuất báo cáo dưới dạng Excel nếu cần.',
    },
    {
        title: 'Xử lý sự cố thường gặp',
        content: [
            'Mã QR không quét được: Đảm bảo độ sáng màn hình đủ và camera được làm sạch',
            'Thông báo lỗi "Hết hạn": Mã QR đã quá thời gian hiệu lực, cần tạo mã mới',
            'Thông báo "Đã điểm danh": Học viên đã quét mã QR và điểm danh trước đó',
            'Lỗi kết nối: Kiểm tra kết nối internet và thử lại',
        ],
    },
];

const DetailsUserGuid = () => {
    const { id, title } = useLocalSearchParams();

    return (
        <ContainerComponent iconLeft='back' title='Hướng dẫn sử dụng' notification isScroll>
            <SectionComponent className='flex-1'>
                <View style={styles.header}>
                    <TextComponent text={title.toString()} color={colors.primary400} size={20} fontBold />
                </View>
                <View className='py-2'>
                    <TextComponent
                        text='
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Et iusto consequatur incidunt atque ipsa. Ducimus perferendis sit placeat modi autem voluptatem voluptate recusandae labore facilis. Esse necessitatibus nam iure eveniet!
                    '
                    />
                </View>

                <View className='py-4'>
                    <TextComponent text={'Chức năng'} color={colors.black} size={18} fontBold />
                    <SpaceComponent height={8} />
                    <CollapsibleGuideComponent sections={guideSections} />
                </View>
            </SectionComponent>
        </ContainerComponent>
    );
};

export default DetailsUserGuid;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderColor: colors.text200,
        width: '100%',
    },
});
