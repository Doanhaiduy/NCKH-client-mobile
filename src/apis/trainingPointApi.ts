import { AxiosRequestConfig } from 'axios';
import axiosClient from './index';
import { Platform } from 'react-native';
import QueryString from 'qs';
import { appInfo } from '@/constants/appInfo';

class TrainingPointAPI {
    HandleTrainingPoint = async <T>(
        url: string,
        data?: any,
        method?: 'get' | 'post' | 'put' | 'delete',
        options: AxiosRequestConfig = {},
    ): Promise<T> => {
        return await axiosClient(`${appInfo.base_url}/training-points${url}`, {
            method: method || 'get',
            data,
            params: method === 'get' ? data : undefined,
            ...options,
        });
    };

    getTrainingPoints = async (
        userId: string,
        data?: TrainingPointsParams,
        option: AxiosRequestConfig = {},
    ): Promise<TrainingPoint[]> => {
        if (Platform.OS === 'ios') {
            return await this.HandleTrainingPoint(
                `/get-all?${QueryString.stringify({
                    ...data,
                    userId,
                })}`,
                undefined,
                'get',
                option,
            );
        }
        return await this.HandleTrainingPoint(`/${userId}/training-points`, { ...data, userId }, 'get');
    };

    getTrainingPointById = async (id = '', option: AxiosRequestConfig = {}): Promise<TrainingPoint> => {
        return await this.HandleTrainingPoint(`/${id}`, undefined, 'get', option);
    };

    getCriteriaEvidence = async (id = '', option: AxiosRequestConfig = {}): Promise<Criteria> => {
        return await this.HandleTrainingPoint(`/criteria/${id}`, undefined, 'get', option);
    };

    updateCriteriaEvidence = async (id = '', data: FormData, option: AxiosRequestConfig = {}): Promise<any> => {
        return await this.HandleTrainingPoint(`/${id}/update-criteria-evidence`, data, 'put', {
            ...option,
            timeout: 30000,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    };

    updateScoresAssessment = async (
        id = '',
        data: CriteriaScoreParams[],
        option: AxiosRequestConfig = {},
    ): Promise<any> => {
        return await this.HandleTrainingPoint(
            `/${id}/update-criteria-score-template`,
            {
                criteriaScores: data,
            },
            'put',
            option,
        );
    };
}

const trainingPointAPI = new TrainingPointAPI();

export default trainingPointAPI;
