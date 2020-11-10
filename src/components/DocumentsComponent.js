import React from 'react'
import Link from '../components/Link'
import styles from '../styles/documents.module.scss'

const DocumentsComponent = ({ event }) => {

  const getMaterials = (event) => {
    let materials = [];

    const mediaUploads = event.media_uploads?.filter(mu => mu.display_on_site);

    if (event.links?.length > 0) materials = [...materials, ...event.links]
    if (event.videos?.length > 0) materials = [...materials, ...event.videos]
    if (event.slides?.length > 0) materials = [...materials, ...event.slides]
    if (mediaUploads?.length > 0) materials = [...materials, ...mediaUploads]
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
      <div>
        <div className={`${styles.docsContainer}`} style={{ marginTop: '1em' , marginBottom: '1em'}}>
          <div className={`navbar-brand ${styles.title}`}>Additional Media/Links</div>
          <hr />
          {sortedMaterials.map((material, index) => {
              let faIcon = 'fa-link';
              switch (material.class_name) {
                case 'PresentationSlide':
                  faIcon = 'fa-file-o';
                  break;
                case 'PresentationVideo':
                  faIcon = 'fa-video-camera';
                  break;
                case 'PresentationMediaUpload':
                  faIcon = 'fa-file-o';
                  break;
              }

              const link = material.class_name === 'PresentationMediaUpload' ? material.public_url : material.link;

              return (
                <React.Fragment key={index}>
                  {material.class_name === 'PresentationSlide' || material.class_name === 'PresentationMediaUpload' ?
                    <div className={`${styles.documentColumn} columns is-mobile is-vcentered`} key={index}>
                      <div className="column is-2 is-offset-1">
                        <i className={`fa ${faIcon} icon is-large`}></i>
                      </div>
                      <div className={`column is-6 ${styles.documentName}`}>
                        <span>{material.name}</span>
                      </div>
                      <div className="column is-2 has-text-right">
                        <Link to={link}><i className="fa fa-download icon is-large"></i></Link>
                      </div>
                      <div className="column is-1"></div>
                    </div>
                    :
                    <div className={`${styles.documentColumn} columns is-mobile is-vcentered`} key={index}>
                      <div className="column is-2 is-offset-1">
                        <i className={`fa ${faIcon} icon is-large`}></i>
                      </div>
                      <div className={`column is-8 ${styles.documentName}`}>
                        <Link to={link}>
                          <span>{material.name}</span>
                        </Link>
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
