import React, { Component } from 'react';
import { Grid, Typography, Button, Switch, CircularProgress } from '@material-ui/core'
import BulkButton from '../components/bulkUploadButton'
import axios from 'axios'
import { Link } from 'react-router-dom';
import { baseApiUrl } from "../shared/constants"

interface AppState  {
    uploading: boolean,
    images: any[],
    private: boolean
  }
  
  class App extends Component<any, AppState> {
    constructor (props: any) {
      super(props)
      this.state = {
        uploading: false,
        images: [],
        private: false,
      }
    } 
  
    captureFiles = (event: any) => {
      this.setState({
        images: event.target.files
      })
    }

    handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, [event.target.name]: event.target.checked });
      };

    uploadFiles = async () => {
        const data = new FormData()
        if (this.state.images.length === 0) {
            console.log("No images")
            return
        } else if (this.state.images.length === 1) {
            //Do a single image upload
            data.append('image', this.state.images[0])
            if (this.state.private) {
                this.setState({uploading: true})
                const res = await axios.post(`${baseApiUrl}/add?private=true`, data);
                this.setState({uploading: false})
                alert(`Images Uploaded! Go to /search to view them. Your access token is: ${res.data.data.accessToken}`)
                return
            } else {
                this.setState({uploading: true})
                await axios.post(`${baseApiUrl}/add`, data);
                this.setState({uploading: false})
                alert(`Images Uploaded! Go to /search to view them.`)
                return
            }
        } else {
            //Do a bulk image upload
            console.log("Doing a bulk image upload")
            for(var i = 0; i < this.state.images.length; i++) {
                data.append('image', this.state.images[i])
            }

            if (this.state.private) {
                this.setState({uploading: true})
                const res = await axios.post(`${baseApiUrl}/add/bulk?private=true`, data);
                this.setState({uploading: false})
                alert(`Private Images Uploaded! Go to /search to view them. Your access token is: ${res.data.data.accessToken}`)
                return
            } else {
                this.setState({uploading: true})
                await axios.post(`${baseApiUrl}/add/bulk`, data);
                this.setState({uploading: false})
                alert(`Images Uploaded! Go to /search to view them.`)
                return
            }
        }
    }
  
    render() {
      return (
          <React.Fragment>
                <Grid  
                    container
                    direction="column"
                    spacing={2}
                    alignItems="center"
                    justify="center"
                    style={{ minHeight: '100vh', marginTop: 50}}>
                     {this.state.uploading ? <CircularProgress /> : null}
                    <Link to="/search">
                        <Button variant="outlined" color="primary">Go to Search</Button>
                    </Link>
                    <Typography variant="h5" style={{marginTop: 20, marginBottom: 20 }}>
                        Upload your files here
                    </Typography>
                    <BulkButton onChange={this.captureFiles}/>
                    <Typography>
                        Filp switch to choose between a public and private upload
                    </Typography>
                    {this.state.private ? <Typography>Private Upload</Typography> : <Typography>Public Upload</Typography>}
                    <Switch
                    checked={this.state.private}
                    onChange={this.handleSwitchChange}
                    name="private"
                    inputProps={{ 'aria-label': 'secondary checkbox' }} />
                    <Button onClick={this.uploadFiles} style={{marginTop: 20, marginBottom: 10 }}>
                        Upload
                    </Button>
                </Grid>
        </React.Fragment>
      );
    }
  }
  
  export default App;
  