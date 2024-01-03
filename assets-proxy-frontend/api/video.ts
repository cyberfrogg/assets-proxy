import axios from 'axios';
import { getApiBaseUrl } from '~/utils/url';


export async function getVideo ({ url, lifetime }: any) {

    const { data: payload } = await axios.get(getApiBaseUrl() + '/video', {
        params: {
            url,
            lifetime
        }
    })

    return payload;
}