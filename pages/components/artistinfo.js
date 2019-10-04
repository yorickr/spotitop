import React, { Component } from 'react';

import getArtists from '../utils/artists';

class ArtistInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            artistData: null
        };
        this.renderUserData = this.renderArtistData.bind(this);
    }

    componentDidMount () {
        getArtists().then((artists) => {
            this.setState({artistData: artists});
        }).catch((error) => console.log(error));
    }

    renderArtistData () {
        if (!this.state.artistData) {
            return <div/>;
        }
        const {artistData} = this.state;
        return (
            <div>
                {artistData.map((artistMap, idx) => {
                    return (
                    <div key={idx}>
                        <h2>Artists: {artistMap.time}</h2>
                        <ol>
                            {artistMap.artists.map((artist, idy) => {
                                return(
                                    <li key={idy}>
                                        {artist.name}
                                    </li>
                                );
                            })}
                        </ol>
                    </div>
                    );

                })}

            </div>
        );
    }

    render () {
        return (
            <div>
                {this.renderArtistData()}
            </div>
        );
    }
};

export default ArtistInfo;