import React, {useCallback, useState} from "react"

import {Controlled as ControlledZoom} from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

import styles from '../styles/poster-components.module.scss'
import PosterImage from "./PosterImage";

const PosterButton = ({mediaUpload}) => {

    const [isZoomed, setIsZoomed] = useState(false)

    const handleZoomChange = useCallback(shouldZoom => {
        setIsZoomed(shouldZoom)
    }, [])

    if (!mediaUpload) return null;

    return (
        <>
            <button className={styles.posterButton} onClick={() => setIsZoomed(true)}>
                View poster detail
            </button>
            <ControlledZoom
                isZoomed={isZoomed}
                onZoomChange={handleZoomChange}
                zoomMargin={-130}
                overlayBgColorStart="rgba(0, 0, 0, 0)"
                overlayBgColorEnd="rgba(0, 0, 0, 0.8)"
                wrapStyle={{ transform: 'translateY(-10px)' }}
            >
                <PosterImage mediaUpload={mediaUpload} shouldShow={isZoomed}/>
            </ControlledZoom>
        </>
    )
}

export default PosterButton;