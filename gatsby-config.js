module.exports = {
  siteMetadata: {
    title: 'Virtual Event POC',
    description:
      'POC for virtual events',
    palette: {
      primary: "#00cec4",
      primaryDark: "#1eaaa3",
      secondary: "#6d6e71",
      secondaryDark: "#f1f2f2",
      textDark: "#006d68",
      textLight: "#ffffff",
      highlights: "#ff5e32"
    }
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass',
    'gatsby-plugin-theme-ui',
    {
      // keep as first gatsby-source-filesystem plugin for gatsby image support
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/static/img`,
        name: 'uploads',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/img`,
        name: 'images',
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [          
          `nunito sans\:300,700` // you can also specify font weights and styles
        ],
        display: 'swap'
      }
    },
    {
      resolve: `gatsby-plugin-stackbit-static-sass`,
      options: {
        inputFile: `${__dirname}/src/styles/palette.scss`,
        outputFile: `${__dirname}/public/assets/css/main.css`
      },
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-relative-images',
            options: {
              name: 'uploads',
            },
          },
          {
            resolve: 'gatsby-remark-images',
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 2048,
            },
          },
          {
            resolve: 'gatsby-remark-copy-linked-files',
            options: {
              destinationDir: 'static',
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-create-client-paths`,
      options: { prefixes: [`/auth/*`, `/a/*`] },
    },
    // {
    //   resolve: `gatsby-plugin-disqus`,
    //   options: {
    //     shortname: `fnvirtual-poc`
    //   }
    // },
    {
      resolve: 'gatsby-plugin-netlify-cms',
      options: {
        modulePath: `${__dirname}/src/cms/cms.js`,
        enableIdentityWidget: false
      },
    },
    // {
    //   resolve: 'gatsby-plugin-purgecss', // purges all unused/unreferenced css rules
    //   options: {
    //     develop: true, // Activates purging in npm run develop
    //     purgeOnly: ['/all.sass'], // applies purging only on the bulma css file
    //   },
    // }, // must be after other CSS plugins
    'gatsby-plugin-netlify', // make sure to keep it last in the array
  ],
}
