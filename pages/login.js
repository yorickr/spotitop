import fetch from 'node-fetch'
import React, { Component } from 'react';
import Head from 'next/head';
import Router from 'next/router';

class Login extends Component {
    constructor(props) {
        super(props);
    }

    onClickLogin () {
        console.log("Logging in");
        Router.push("/api/login");
    }

    componentDidMount() {
        if (!Router.query) {
            return;
        }
        const blob = Router.query.blob;
        if (!blob) {
            return;
        }
        Router.push({pathname: '/user', query: {blob}});
    }

	render () {
		return (
			<div>
                <Head>
					<title>Spotify top artists/tracks</title>
				</Head>
                <button onClick={this.onClickLogin}>
                    Log in with Spotify
                </button>
			</div>
		);
	}
};

export default Login;