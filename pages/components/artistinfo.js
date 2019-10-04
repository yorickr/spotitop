import React, { Component } from 'react';


class ArtistInfo extends Component {
    constructor(props) {
        super(props);
        const { data } = props;
        this.state = {
            auth_data: data,
            user_data: null
        };
        this.renderUserData = this.renderUserData.bind(this);
    }

    componentDidMount () {
        // fetch("https://api.spotify.com/v1/me", {
        //         headers: {
        //             'Authorization': 'Bearer ' + this.state.auth_data.access_token
        //         }
        // }).then((data) => {
        //     return data.json();
        // }).then((json) => {
        //     console.log(json);
        //     this.setState({user_data: json});
        // }).catch((error) => console.log(error));
    }

    renderUserData () {
        if (!this.state.user_data) {
            return <div/>;
        }
        const {user_data} = this.state;
        return (
            <div>
                <h1>Logged in as {user_data.display_name}</h1>

            </div>
        );
    }

    render () {
        return (
            <div>
                Track Info
                {this.renderUserData()}
            </div>
        );
    }
};

export default ArtistInfo;