
// url: 'https://api.spotify.com/v1/me/top/' + type + '?limit=50&time_range=' + time_range,
// headers: {
// 'Authorization': 'Bearer ' + access_token
// },

import Auth from './auth';


class Artist {
    constructor(blob) {
        this.followers = blob.followers.total;
        this.genres = blob.genres;
        this.link = blob.href;
        this.id = blob.id;
        this.images = blob.images;
        this.name = blob.name;
    }
};

export default () => {
    var types = [
        'tracks',
        'artists'
    ];
    var time_ranges = [
        "short_term",
        "medium_term",
        "long_term"
    ];
    var promises = time_ranges.map(async (time) => {
        const urlToFetch = "https://api.spotify.com/v1/me/top/artists?limit=50&time_range=" + time
        var data = await fetch(urlToFetch, {
            headers: {
                'Authorization': 'Bearer ' + Auth.getAuthData().access_token
            }
        });
        data = await data.json();
        console.log(data);
        var artists = data.items.map((item) => {
            return new Artist(item);
        });
        return {time, artists};
    });
    return Promise.all(promises);
}; 