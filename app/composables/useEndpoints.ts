export const useEndpoints = () => {
    const { app } = useAppConfig();
    const baseURL = app.baseURL || '';
    return {
        chat: `${baseURL}api/chat       `
    }
}