import React from 'react'
import styles from '../styles/documents.module.scss'

const DocumentsComponent = ({ event, sponsor }) => {

  const getMaterials = (event) => {
    let materials = [];
    if (event.links?.length > 0) materials = [...materials, ...event.links]
    if (event.videos?.length > 0) materials = [...materials, ...event.videos]
    if (event.slides?.length > 0) materials = [...materials, ...event.slides]
    return materials;
  }

  let sortedMaterials = [...getMaterials(event)].sort((a, b) => {
    if (a.order > b.order) {
      return 1;
    } else if (a.order < b.order) {
      return -1;
    } else {
      return 0;
    }
  });

  if (sortedMaterials.length > 0) {
    return (
      <div className={`${sponsor ? '' : 'column is-one-quarter'}`}>
        <div className={`${styles.docsContainer}`} style={{ marginTop: '1em' }}>
          <div className={`navbar-brand ${styles.title}`}>Documents</div>
          <hr />
          {sortedMaterials.map((material, index) => {
              return (
                <React.Fragment key={index}>
                  {material.class_name === 'PresentationSlide' ?
                    <div className={`${styles.documentColumn} columns is-mobile is-vcentered`} key={index}>
                      <div className="column is-2 is-offset-1">
                        <i className={`fa fa-file-o icon is-large`}></i>
                      </div>
                      <div className={`column is-6 ${styles.documentName}`}>
                        <span>{material.name}</span>
                      </div>
                      <div className="column is-2 has-text-right">
                        <a target="_blank" rel="noreferrer" href={material.link}><i className="fa fa-download icon is-large"></i></a>
                      </div>
                      <div className="column is-1"></div>
                    </div>
                    :
                    <div className={`${styles.documentColumn} columns is-mobile is-vcentered`} key={index}>
                      <div className="column is-2 is-offset-1">
                        <i className={`fa ${material.class_name === 'PresentationVideo' ? 'fa-video-camera' : 'fa-link'} icon is-large`}></i>
                      </div>
                      <div className={`column is-8 ${styles.documentName}`}>
                        <a target="_blank" rel="noreferrer" href={material.class_name === 'PresentationVideo' ? `https://www.youtube.com/watch?v=${material.youtube_id}` : material.link}>
                          <span>{material.name}</span>
                        </a>
                      </div>
                      <div className="column is-1"></div>
                    </div>}
                  <hr />
                </React.Fragment>
              )
            })
          }
        </div>
      </div>
    )
  } else {
    return null;
  }
}

export default DocumentsComponent;
