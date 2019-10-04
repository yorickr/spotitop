import React, { Component } from 'react';
import Auth from '../utils/auth';


class TrackInfo extends Component {
    constructor(props) {
        super(props);
        const { data } = props;
        this.state = {
            auth_data: data,
            user_data: null
        };
        this.renderUserData = this.renderTrackData.bind(this);
    }

    componentDidMount () {
        // fetch("https://api.spotify.com/v1/me", {
        //         headers: {
        //             'Authorization': 'Bearer ' + Auth.getAuthToken()
        //         }
        // }).then((data) => {
        //     return data.json();
        // }).then((json) => {
        //     console.log(json);
        //     this.setState({user_data: json});
        // }).catch((error) => console.log(error));
    }

    renderTrackData () {
        if (!this.state.user_data) {
            return <div/>;
        }
        const {user_data} = this.state;
        return (
            <div>
                <h1>Logged in as {user_data.display_name}</h1>
                <ul class="data_list" style="list-style: none;">
                    <li>
                        <div class="tracks">
                            <h2>Tracks: </h2>
                            <ol class="song_list">
                            </ol>
                        </div>
                    </li>
                </ul>
            </div>
        );
    }

    render () {
        return (
            <div>
                Track Info
                {this.renderTrackData()}
            </div>
        );
    }
};

export default TrackInfo;