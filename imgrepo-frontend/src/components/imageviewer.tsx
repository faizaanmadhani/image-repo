import React from 'react'
import { Typography, Grid } from '@material-ui/core'

const ImageViewer = (props: { imageData: any[] }) => {
    return (
        <Grid container spacing={1} direction="column" style={{marginTop: 20, marginBottom: 20 }}>
            {props.imageData.map((image, i) =>
                    <Grid container direction="row" spacing={0}>
                    <Grid item>
                    <img src={image.data.url} alt='' height="300" width="300" /><br></br>
                    </Grid>
                    <Grid item>
                        <Typography>Tags: {JSON.stringify(image.data.tags, null, 5)}</Typography>
                    </Grid>
                    </Grid>
            )}
        </Grid>
    )
}

export default ImageViewer