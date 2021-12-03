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
const filtersFilepath = 'src/content/filters.json';
const settingsFilepath = 'src/content/settings.json';

const myEnv = require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

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

const SSR_getEvents = async (baseUrl, summitId, accessToken, page) => {
  return await axios.get(
      `${baseUrl}/api/v1/summits/${summitId}/events/published`,
      {
        params: {
          access_token: accessToken,
          per_page: 50,
          page: page,
          expand: 'slides, links, videos, media_uploads, type, track, track.allowed_access_levels, location, location.venue, location.floor, speakers, moderator, sponsors, current_attendance, groups, rsvp_template, tags',
        }
      });
};

exports.onPreBootstrap = async () => {
  const marketingData = await SSR_getMarketingSettings(process.env.GATSBY_MARKETING_API_BASE_URL, process.env.GATSBY_SUMMIT_ID);
  const colorSettings = fs.existsSync(colorsFilepath) ? JSON.parse(fs.readFileSync(colorsFilepath)) : {};
  const disqusSettings = fs.existsSync(disqusFilepath) ? JSON.parse(fs.readFileSync(disqusFilepath)) : {};
  const marketingSite = fs.existsSync(marketingFilepath) ? JSON.parse(fs.readFileSync(marketingFilepath)) : {};
  const homeSettings = fs.existsSync(homeFilepath) ? JSON.parse(fs.readFileSync(homeFilepath)) : {};
  const filterSettings = fs.existsSync(filtersFilepath) ? JSON.parse(fs.readFileSync(filtersFilepath)) : {};
  const globalSettings = fs.existsSync(settingsFilepath) ? JSON.parse(fs.readFileSync(settingsFilepath)) : {};
  // here we will store the filter keys from marketing api ...
  const filterKeysFromMarketingData = {};
  // default value
  filterSettings.color_source = '';
  marketingData.map(({key, value}) => {
    if (key.startsWith('color_')) colorSettings[key] = value;
    if (key.startsWith('disqus_')) disqusSettings[key] = value;
    if (key.startsWith('summit_')) marketingSite[key] = value;
    if (key.startsWith('SCHEDULE_FILTER_BY_')) {
      const filterKey = key.substr(0, key.lastIndexOf('_')).substr(19).toLowerCase();
      const defaultValues = filterKey === 'title' ? '' : [];

      if (!filterSettings[filterKey]) {
        filterSettings[filterKey] = {label: '', values: defaultValues, enabled: false};
      }

      if(!filterKeysFromMarketingData.hasOwnProperty(filterKey)) {
          filterKeysFromMarketingData[filterKey] = false;
      }

      if (key.includes('_ENABLED')) {
        filterSettings[filterKey].enabled = (value === '1');
        filterKeysFromMarketingData[filterKey] = filterSettings[filterKey].enabled;
        console.log(`filterSettings Adding Filter ${filterKey}: ${(value === '1') ? 'enabled' : 'disabled'}`);
      }

      if (key.includes('_LABEL')) filterSettings[filterKey].label = value;
      filterSettings[filterKey].values = defaultValues;
    }
    if (key === 'SCHEDULE_EVENT_COLOR_ORIGIN') {
      filterSettings.color_source = value.toLowerCase();
      console.log(`filterSettings filterSettings.color_source ${filterSettings.color_source}`)
    }
    if (key === 'schedule_default_image') homeSettings.schedule_default_image = value;
    if( key === 'registration_in_person_disclaimer') marketingSite[key] = value;
  });

  // now check using the original json file of filters
  // is the filter setting didnt came from marketing api
  // and filter does exists on json file, then should be turned off

  Object.entries(filterSettings).forEach(([key, value]) => {
     // check if filter came at marketing api
     if(key === 'color_source') return;
    if(!filterKeysFromMarketingData.hasOwnProperty(key)) {
       filterSettings[key].enabled = false;
       return;
     }
     filterSettings[key].enabled = filterKeysFromMarketingData[key];
  });

  //

  globalSettings.lastBuild = Date.now();

  fs.writeFileSync(colorsFilepath, JSON.stringify(colorSettings), 'utf8');
  fs.writeFileSync(disqusFilepath, JSON.stringify(disqusSettings), 'utf8');
  fs.writeFileSync(marketingFilepath, JSON.stringify(marketingSite), 'utf8');
  fs.writeFileSync(homeFilepath, JSON.stringify(homeSettings), 'utf8');
  fs.writeFileSync(filtersFilepath, JSON.stringify(filterSettings), 'utf8');
  fs.writeFileSync(settingsFilepath, JSON.stringify(globalSettings), 'utf8');


  let sassColors = '';
  Object.entries(colorSettings).forEach(([key, value]) => sassColors += `$${key} : ${value};\n`);

  fs.writeFileSync('src/styles/colors.scss', sassColors, 'utf8');



  // Private API endpoints

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

  const getAccessToken = async () => {
    const client = new ClientCredentials(config);

    const tokenParams = {
      scope: process.env.GATSBY_BUILD_SCOPES
    };

    try {
      return await client.getToken(tokenParams);
    } catch (error) {
      console.log('Access Token error', error);
    }
  };

  const accessToken = await getAccessToken().then(({token}) => token.access_token);

  let events_page = 1;
  let events_last_page = 0;

  let allEvents = await SSR_getEvents(process.env.GATSBY_SUMMIT_API_BASE_URL, process.env.GATSBY_SUMMIT_ID, accessToken, events_page)
      .then((response) => {
        events_last_page = response.data.last_page;
        return response.data.data;
      })
      .catch(e => console.log('ERROR: ', e));

  while (events_last_page > 1 && events_page <= events_last_page) {
    events_page++;
    await SSR_getEvents(process.env.GATSBY_SUMMIT_API_BASE_URL, process.env.GATSBY_SUMMIT_ID, accessToken, events_page)
        .then((response) => {
          allEvents = [...allEvents, ...response.data.data];
          return response.data;
        })
        .catch(e => console.log('ERROR: ', e));
  }

  fs.writeFileSync('src/content/events.json', JSON.stringify(allEvents), 'utf8');


  // Fetch Speakers

  // Get Featured Speakers

  let featured_speakers_page = 1;
  let featured_speakers_last_page = 0;

  let featuredSpeakers = await axios.get(
    `${process.env.GATSBY_SUMMIT_API_BASE_URL}/api/v1/summits/${process.env.GATSBY_SUMMIT_ID}/speakers/on-schedule`,
    {
      params: {
        access_token: accessToken,
        page: featured_speakers_page,
        per_page: 30,
        'filter[]': 'featured==true',
      }
    }).then((response) => {
      featured_speakers_last_page = response.data.last_page;
      return response.data.data;
    })
    .catch(e => console.log('ERROR: ', e));

  while (featured_speakers_last_page > 1 && featured_speakers_page <= featured_speakers_last_page) {
    featured_speakers_page++;
    await axios.get(
      `${process.env.GATSBY_SUMMIT_API_BASE_URL}/api/v1/summits/${process.env.GATSBY_SUMMIT_ID}/speakers/on-schedule`,
      {
        params: {
          access_token: accessToken,
          page: featured_speakers_page,
          per_page: 30,
          'filter[]': 'featured==true',
        }
      }).then((response) => {
        featuredSpeakers = [...featuredSpeakers, ...response.data.data];
        return response.data;
      })
      .catch(e => console.log('ERROR: ', e));
  }

  featuredSpeakers = featuredSpeakers.map(speaker => ({ ...speaker, featured: true }));

  let speakers_page = 1;
  let speakers_last_page = 0;

  let allSpeakers = await axios.get(
    `${process.env.GATSBY_SUMMIT_API_BASE_URL}/api/v1/summits/${process.env.GATSBY_SUMMIT_ID}/speakers/on-schedule`,
    {
      params: {
        access_token: accessToken,
        page: speakers_page,
        per_page: 30,
      }
    }).then((response) => {
      speakers_last_page = response.data.last_page;
      return response.data.data;
    })
    .catch(e => console.log('ERROR: ', e));

  while (speakers_last_page > 1 && speakers_page <= speakers_last_page) {
    speakers_page++;
    await axios.get(
      `${process.env.GATSBY_SUMMIT_API_BASE_URL}/api/v1/summits/${process.env.GATSBY_SUMMIT_ID}/speakers/on-schedule`,
      {
        params: {
          access_token: accessToken,
          page: speakers_page,
          per_page: 30,
        }
      }).then((response) => {
        allSpeakers = [...allSpeakers, ...response.data.data];
        return response.data;
      })
      .catch(e => console.log('ERROR: ', e));
  }

  allSpeakers = allSpeakers.filter(speaker => featuredSpeakers.every(s => s.id !== speaker.id));

  allSpeakers = [...allSpeakers, ...featuredSpeakers];

  fs.writeFileSync('src/content/speakers.json', JSON.stringify(allSpeakers), 'utf8', function (err) {
    if (err) throw err;
    console.log('Saved!');
  });

};

// makes Summit logo optional for graphql queries
// explicit Frontmatter declaration for custom pages.
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type Summit implements Node {
      logo: String
    }
    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
    }
    type Frontmatter {            
      title: String
      userRequirement: String
      desktopImagePage: File @fileByRelativePath
      mobileImagePage: File @fileByRelativePath
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

  const params = {
    expand: 'event_types,tracks,track_groups,presentation_levels,locations.rooms,locations.floors,order_extra_questions.values'
  }

  const summit = await axios.get(
    `${process.env.GATSBY_SUMMIT_API_BASE_URL}/api/public/v1/summits/${process.env.GATSBY_SUMMIT_ID}`, { params }
  ).then((response) => response.data)
    .catch(e => console.log('ERROR: ', e));

  const summitObject = { summit };

  fs.writeFileSync('src/content/summit.json', JSON.stringify(summitObject), 'utf8', function (err) {
    if (err) throw err;
    console.log('Saved!');
  });

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