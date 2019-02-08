import React, { Component } from 'react';
import Head from 'next/head';
import Router from 'next/router';

import Cookies from 'universal-cookie';

const cookies = new Cookies();

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
            return <div></div>;
        }
        const {user_data} = this.state;
        return (
            <div>
                <h1>Logged in as {user_data.display_name}</h1>
                <div class="media">
                    <div class="pull-left">
                        <img class="media-object" width="150" src={user_data.images[0].url} />
                    </div>
                    <div class="media-body">
                        <dl class="dl-horizontal">
                            <dt>Display name</dt><dd class="clearfix">{user_data.display_name}</dd>
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
            <div>
                UserInfo
                {this.renderUserData()}
            </div>
        );
    }
};

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spotify_data: cookies.get('spotify_data') || null
        };
    }

    componentDidMount() {
        if (!Router.query) {
            return;
        }
        const blob = Router.query.blob;
        if (!blob) {
            return;
        }
        const data = JSON.parse(blob);
        console.log(data);
        Router.push(Router.pathname, '/user', {shallow:true});
        this.setState({spotify_data: data}, () => {
            cookies.set('spotify_data', data);
        });
    }

	render () {
		return (
			<div>
                <Head>
					<title>Spotify top artists/tracks</title>
				</Head>
                <div>
                    {this.state.spotify_data && 
                    <UserInfo data={this.state.spotify_data}>

                    </UserInfo>}
                    
                </div>
			</div>
		);
	}
};

export default User;