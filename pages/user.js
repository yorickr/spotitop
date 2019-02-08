import fetch from 'node-fetch'
import React, { Component } from 'react';
import Head from 'next/head';
import Router from 'next/router';

import Cookies from 'universal-cookie';

const cookies = new Cookies();

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
                    <text>
                        Access token is: {this.state.spotify_data && this.state.spotify_data.access_token}
                    </text>
                </div>
			</div>
		);
	}
};

export default User;