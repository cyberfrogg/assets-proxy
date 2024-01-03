export const getApiBaseUrl = () => {
    // @ts-ignore
    if(process.env.NODE_ENV === 'development'){
        return 'http://localhost:4000/api'
    } else {
        return "/api"
    }
}