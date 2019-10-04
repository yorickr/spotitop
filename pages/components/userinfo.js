import React, { Component } from 'react';


class UserInfo extends Component {
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
        fetch("https://api.spotify.com/v1/me", {
                headers: {
                    'Authorization': 'Bearer ' + this.state.auth_data.access_token
                }
        }).then((data) => {
            return data.json();
        }).then((json) => {
            console.log(json);
            this.setState({user_data: json});
        }).catch((error) => console.log(error));
        
    }

    renderUserData () {
        if (!this.state.user_data) {
            return <div/>;
        }
        const {user_data} = this.state;
        return (
            <div>
                <h1>Logged in as {user_data.display_name}</h1>
                <div className="media">
                    <div className="pull-left">
                        <img className="media-object" width="150" src={user_data.images[0].url} />
                    </div>
                    <div className="media-body">
                        <dl className="dl-horizontal">
                            <dt>Display name</dt><dd className="clearfix">{user_data.display_name}</dd>
                            <dt>Id</dt><dd>{user_data.id}</dd>
                            <dt>Spotify URI</dt><dd><a href={user_data.external_urls.spotify} >{user_data.external_urls.spotify}</a></dd>
                            <dt>Country</dt><dd>{user_data.country}</dd>
                        </dl>
                    </div>
                </div>
            </div>
        );
    }

    render () {
        return (
            this.renderUserData()
        );
    }
};

export default UserInfo;