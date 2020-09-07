import React, { Component } from 'react'
import ImageViewer from '../components/imageviewer'
import axios from 'axios'
import ChipInput from 'material-ui-chip-input'
import { Button, Switch, Grid, TextField, Typography } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { baseApiUrl } from "../shared/constants"


interface SearchState {
    imageData: any[]
    tags: string[]
    private: boolean
    privateKey: string
}

class Search extends Component<any, SearchState> {
    constructor(props: any) {
        super(props)

        this.state = {
            imageData: [],
            tags: [],
            private: false,
            privateKey: ""
        }
    }

    fetchImages = async () => {
        const tagString = this.state.tags.join()
        const config = {
            headers: { 
                Authorization: `Bearer ${this.state.privateKey}`
            }
        };
        if (this.state.private) {
            const response = await axios.get(`${baseApiUrl}/search/private?tags=${tagString}`, config)
            console.log("Resulting URLS", response.data)
            this.setState({imageData: response.data.data})
        } else {
            const response = await axios.get(`${baseApiUrl}/search/public?tags=${tagString}`)
            console.log("Resulting URLS", response.data.data)
            this.setState({imageData: response.data.data})
        }
    }

    handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, [event.target.name]: event.target.checked });
      };

    render() {
        console.log(this.state)
        return (
            <React.Fragment>
                <Grid  container
                        direction="column"
                        spacing={4}
                        alignItems="center"
                        justify="center"
                        style={{ minHeight: '100vh', marginTop: 50, textAlign: "center" }}>
                <Link to="/">
                    <Button variant="outlined" color="primary">Go to Upload</Button>
                </Link>
                <Typography variant="h5" style={{paddingTop: 10}}>Search by Tag (Press Enter after every tag)</Typography>
                <ChipInput
                    value={this.state.tags}
                    onDelete={(chip, _index) => this.setState({
                        tags: this.state.tags.filter((tag) => {
                            return tag !== chip
                        })
                    })}
                    onAdd={(chip) => this.setState(prevState => ({
                        tags: [...prevState.tags, chip]
                      }))}
                    label="Search"
                    style={{marginBottom: 20}}
                    />
                <Typography>Flip the switch to either search through private or public images</Typography>
                <Typography>Now Searching through {this.state.private ? <Typography display="inline">your private</Typography> : <Typography display="inline">public</Typography>} images</Typography>
                <Switch
                    checked={this.state.private}
                    onChange={this.handleSwitchChange}
                    name="private"
                    inputProps={{ 'aria-label': 'secondary checkbox' }} />
                {this.state.private ? 
                    <TextField
                        label="Enter Access Token"
                        value={this.state.privateKey}
                        onChange={event => this.setState({privateKey: event.target.value})} /> : null}
                 <Button
                    onClick={this.fetchImages}
                    style={{marginTop: 20}}>
                    Search Images
                </Button>
                <ImageViewer imageData={this.state.imageData} />
                </Grid>
            </React.Fragment>

        )
    }
}

export default Search