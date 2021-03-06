import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default class Auth {

    static setAuthData(data) {
        cookies.set('spotify_data', data);
    }
    static getAuthData() {
        return cookies.get('spotify_data');
    }
};