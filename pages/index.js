import fetch from 'node-fetch'
import React, { Component } from 'react';
import Head from 'next/head';
import Router from 'next/router';

export default class extends React.Component {
	static async getInitialProps ({ res }) {
		if (res) {
			res.writeHead(302, {
				Location: '/login'
			})
			res.end()
		} else {
			Router.push('/login')
		}
		return {}
	}
};