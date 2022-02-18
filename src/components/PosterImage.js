import React from "react"
import 'react-medium-image-zoom/dist/styles.css'

const PosterImage = ({ mediaUpload , shouldShow = true}) => {
    return(
            <img
                alt={mediaUpload?.name}
                style={{ display: shouldShow ? 'inherit' : 'none' }}
                src={mediaUpload?.public_url}
            />
    );
};

export default PosterImage;