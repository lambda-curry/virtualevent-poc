import CMS from 'netlify-cms-app'
// import uploadcare from 'netlify-cms-media-library-uploadcare'
// import cloudinary from 'netlify-cms-media-library-cloudinary'

import IndexPagePreview from './preview-templates/IndexPagePreview'
import CustomPagePreview from './preview-templates/CustomPagePreview'
import MarketingPagePreview from './preview-templates/MarketingPagePreview'
import VirtualBoothPagePreview from './preview-templates/VirtualBoothPage'

// CMS.registerMediaLibrary(uploadcare)
// CMS.registerMediaLibrary(cloudinary)

CMS.registerPreviewTemplate('index', IndexPagePreview)
CMS.registerPreviewTemplate('pages', CustomPagePreview)
CMS.registerPreviewTemplate('virtualBoothPage', VirtualBoothPagePreview)
CMS.registerPreviewTemplate('marketing', MarketingPagePreview)