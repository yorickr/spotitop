import React, { Component } from 'react';
import Head from 'next/head';
import Router from 'next/router';

import Header from './components/header.js';
import UserInfo from './components/userinfo.js';
import TrackInfo from './components/trackinfo';
import ArtistInfo from './components/artistinfo';
import Auth from './utils/auth';

import Cookies from 'universal-cookie';

const cookies = new Cookies();


class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spotify_data: Auth.getAuthData() || null
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
        Auth.setAuthData(data);
        this.setState({spotify_data: data});
    }

	render () {
		return (
			<div className="container">
                <Header/>
                {this.state.spotify_data && 
                    <div>
                        <UserInfo data={this.state.spotify_data}/>
                        <TrackInfo />
                        <ArtistInfo />

                    </div>
                }
			</div>
		);
	}
};

export default User;