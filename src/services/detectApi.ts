import { appInfo } from '@/constants/appInfo';
import axiosClient from '@/apis';

// const handleDetectFace : params: formdata with image file and user_id
const handleDetectFace = async (formData: FormData) => {
    return await axiosClient.post(`${appInfo.base_url_face_detect}/verify`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export default handleDetectFace;
