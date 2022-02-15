import React, { useCallback, useState } from "react"

import { Controlled as ControlledZoom } from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

import styles from '../styles/poster-components.module.scss'

const PosterButton = ({ poster }) => {

    const [isZoomed, setIsZoomed] = useState(false)

    const handleZoomChange = useCallback(shouldZoom => {
        setIsZoomed(shouldZoom)
    }, [])

    return (
        <>
            <button className={styles.posterButton} onClick={() => setIsZoomed(true)}>
                View poster detail
            </button>
            {
                <ControlledZoom
                    isZoomed={isZoomed}
                    onZoomChange={handleZoomChange}
                    overlayBgColorStart="rgba(0, 0, 0, 0)"
                    overlayBgColorEnd="rgba(0, 0, 0, 0.8)"
                    zoomMargin="100"                    
                >
                    {isZoomed && <img
                        alt="that wanaka tree"
                        src={poster?.media_uploads.find(e => e.order === 1).public_url}
                    />}
                </ControlledZoom>}
        </>
    )
}

export default PosterButton;