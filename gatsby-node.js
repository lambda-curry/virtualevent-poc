const axios = require('axios');
const path = require('path');
const fs = require("fs");
const { createFilePath } = require('gatsby-source-filesystem');
const { fmImagesToRelative } = require('gatsby-remark-relative-images');
const { ClientCredentials } = require('simple-oauth2');

const colorsFilepath = 'src/content/colors.json';
const disqusFilepath = 'src/content/disqus-settings.json';
const marketingFilepath = 'src/content/marketing-site.json';
const homeFilepath = 'src/content/home-settings.json';
const settingsFilepath = 'src/content/settings.json';

const myEnv = require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

const getAccessToken = async (config, scope) => {
  const client = new ClientCredentials(config);

  try {
    return await client.getToken({scope});
  } catch (error) {
    console.log('Access Token error', error);
  }
};

const SSR_getMarketingSettings = async (baseUrl, summitId) => {
  const params = {
    per_page: 100,
  };

  return await axios.get(
      `${baseUrl}/api/public/v1/config-values/all/shows/${summitId}`,
      { params }
  )
      .then(response => {return response.data.data})
      .catch(e => console.log('ERROR: ', e));
};

const SSR_getEvents = async (baseUrl, summitId, accessToken, page = 1, results = []) => {
  return await axios.get(
      `${baseUrl}/api/v1/summits/${summitId}/events/published`,
      {
        params: {
          access_token: accessToken,
          per_page: 50,
          page: page,
          expand: 'slides, links, videos, media_uploads, type, track, track.allowed_access_levels, location, location.venue, location.floor, speakers, moderator, sponsors, current_attendance, groups, rsvp_template, tags',
        }
      }).then(({data}) => {
        if (data.page < data.last_page) {
          return SSR_getEvents(baseUrl, summitId, accessToken, data.page + 1, data.data);
        }

        return [...results, ...data.data];
      })
      .catch(e => console.log('ERROR: ', e));
};

const SSR_getSpeakers = async (baseUrl, summitId, accessToken, filter = null, page = 1, results = [] ) => {
  const params = {
    access_token: accessToken,
    per_page: 30,
    page: page,
  };

  if (filter) {
    params['filter[]'] = filter;
  }

  return await axios.get(
      `${baseUrl}/api/v1/summits/${summitId}/speakers/on-schedule`,
      { params}
  )
      .then(({data}) => {
        if (data.page < data.last_page) {
          return SSR_getSpeakers(baseUrl, summitId, accessToken, filter,data.page + 1, data.data);
        }

        return [...results, ...data.data];
      })
      .catch(e => console.log('ERROR: ', e));
};

const SSR_getSummit = async (baseUrl, summitId) => {
  const params = {
    expand: 'event_types,tracks,track_groups,presentation_levels,locations.rooms,locations.floors,order_extra_questions.values'
  };

  return await axios.get(
      `${baseUrl}/api/public/v1/summits/${summitId}`,
      { params }
  )
      .then(({data}) => {return data.data})
      .catch(e => console.log('ERROR: ', e));
};

exports.onPreBootstrap = async () => {
  const summitId = process.env.GATSBY_SUMMIT_ID;
  const summitApiBaseUrl = process.env.GATSBY_SUMMIT_API_BASE_URL;
  const marketingData = await SSR_getMarketingSettings(process.env.GATSBY_MARKETING_API_BASE_URL, process.env.GATSBY_SUMMIT_ID);
  const colorSettings = fs.existsSync(colorsFilepath) ? JSON.parse(fs.readFileSync(colorsFilepath)) : {};
  const disqusSettings = fs.existsSync(disqusFilepath) ? JSON.parse(fs.readFileSync(disqusFilepath)) : {};
  const marketingSite = fs.existsSync(marketingFilepath) ? JSON.parse(fs.readFileSync(marketingFilepath)) : {};
  const homeSettings = fs.existsSync(homeFilepath) ? JSON.parse(fs.readFileSync(homeFilepath)) : {};
  const globalSettings = fs.existsSync(settingsFilepath) ? JSON.parse(fs.readFileSync(settingsFilepath)) : {};

  const config = {
    client: {
      id: process.env.GATSBY_OAUTH2_CLIENT_ID_BUILD,
      secret: process.env.GATSBY_OAUTH2_CLIENT_SECRET_BUILD
    },
    auth: {
      tokenHost: process.env.GATSBY_IDP_BASE_URL,
      tokenPath: process.env.GATSBY_OAUTH_TOKEN_PATH
    },
    options: {
      authorizationMethod: 'header'
    }
  };

  const accessToken = await getAccessToken(config, process.env.GATSBY_BUILD_SCOPES).then(({token}) => token.access_token);



  // Marketing Settings
  marketingData.map(({key, value}) => {
    if (key.startsWith('color_')) colorSettings[key] = value;
    if (key.startsWith('disqus_')) disqusSettings[key] = value;
    if (key.startsWith('summit_')) marketingSite[key] = value;

    if (key === 'schedule_default_image') homeSettings.schedule_default_image = value;
    if( key === 'registration_in_person_disclaimer') marketingSite[key] = value;
  });

  globalSettings.lastBuild = Date.now();

  fs.writeFileSync(colorsFilepath, JSON.stringify(colorSettings), 'utf8');
  fs.writeFileSync(disqusFilepath, JSON.stringify(disqusSettings), 'utf8');
  fs.writeFileSync(marketingFilepath, JSON.stringify(marketingSite), 'utf8');
  fs.writeFileSync(homeFilepath, JSON.stringify(homeSettings), 'utf8');
  fs.writeFileSync(settingsFilepath, JSON.stringify(globalSettings), 'utf8');


  let sassColors = '';
  Object.entries(colorSettings).forEach(([key, value]) => sassColors += `$${key} : ${value};\n`);
  fs.writeFileSync('src/styles/colors.scss', sassColors, 'utf8');


  // Show Events
  const allEvents = await SSR_getEvents(summitApiBaseUrl, summitId, accessToken);
  fs.writeFileSync('src/content/events.json', JSON.stringify(allEvents), 'utf8');


  // Show Speakers
  const allSpeakers = await SSR_getSpeakers(summitApiBaseUrl, summitId, accessToken);
  fs.writeFileSync('src/content/speakers.json', JSON.stringify(allSpeakers), 'utf8');

};

// makes Summit logo optional for graphql queries
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type Summit implements Node {
      logo: String
    }
  `;
  createTypes(typeDefs)
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;
  fmImagesToRelative(node); // convert image paths for gatsby images

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
};

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest
}) => {
  const { createNode } = actions;

  const summit = await SSR_getSummit(process.env.GATSBY_SUMMIT_API_BASE_URL, process.env.GATSBY_SUMMIT_ID);
  const summitObject = { summit };
  fs.writeFileSync('src/content/summit.json', JSON.stringify(summitObject), 'utf8');

  const nodeContent = JSON.stringify(summit);

  const nodeMeta = {
    ...summit,
    id: createNodeId(`summit-${summit.id}`),
    summit_id: summit.id,
    parent: null,
    children: [],
    internal: {
      type: `Summit`,
      mediaType: `application/json`,
      content: nodeContent,
      contentDigest: createContentDigest(summit)
    }
  };

  const node = Object.assign({}, summit, nodeMeta);
  createNode(node)
};



exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;


  return graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              templateKey
            }
          }
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      result.errors.forEach((e) => console.error(e.toString()));
      return Promise.reject(result.errors)
    }

    const posts = result.data.allMarkdownRemark.edges;

    posts.forEach((edge) => {
      const id = edge.node.id;
      if (edge.node.fields.slug.match(/custom-pages/)) {
        edge.node.fields.slug = edge.node.fields.slug.replace('/custom-pages/', '/');
      }
      createPage({
        path: edge.node.fields.slug,
        component: path.resolve(
          `src/templates/${String(edge.node.frontmatter.templateKey)}.js`
        ),
        // additional data can be passed via context
        context: {
          id,
        },
      })
    })
  })
};

exports.onCreateWebpackConfig = ({ actions, plugins, loaders }) => {
  actions.setWebpackConfig({
    // canvas is a jsdom external dependency
    externals: ['canvas'],
    plugins: [
      plugins.define({
        'global.GENTLY': false,
        'global.BLOB': false
      })
    ]
  })
};