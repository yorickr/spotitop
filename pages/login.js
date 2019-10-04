import React, { Component } from 'react';
import Header from './components/header.js';
import Router from 'next/router';

class Login extends Component {
    constructor(props) {
        super(props);
    }

    static getInitialProps({query}) {
        // koos nutteloos maar dit is blijkbaar nodig om statisch renderen van next niet uit te voeren.
        return {query}
    }

    onClickLogin () {
        console.log("Logging in");
        Router.push("/api/login");
    }

    componentDidMount() {
        if (!Router.query) {
            console.log("Router query is empty.");
            return;
        }
        const blob = Router.query.blob;
        if (!blob) {
            console.log("Blob is empty.");
            return;
        }
        Router.push({pathname: '/user', query: {blob}});
    }

	render () {
		return (
			<div className="container">
                <Header/>
                <button className="btn btn-primary" onClick={this.onClickLogin}>
                    Log in with Spotify
                </button>
			</div>
		);
	}
};

export default Login;