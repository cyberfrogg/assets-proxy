import axios from 'axios';
import { getApiBaseUrl } from '~/utils/url';


export async function dynamicStatus () {
    const { data: payload } = await axios.get(getApiBaseUrl() + '/status/dynamicStatus', {
        params: {}
    })

    return payload;
}