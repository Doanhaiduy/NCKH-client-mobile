import { appInfo } from '@/constants/appInfo';
import axios from 'axios';

// const handleDetectFace : params: formdata with image file and user_id
const handleDetectFace = async (formData: FormData) => {
    try {
        const response = await axios.post(`${appInfo.base_url_face_detect}/verify`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error detecting face:', error);
        throw error;
    }
};

export default handleDetectFace;
