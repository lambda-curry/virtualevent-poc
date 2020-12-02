const _ = require('lodash')
const axios = require('axios')
const path = require('path')
const fs = require("fs")
const { createFilePath } = require('gatsby-source-filesystem')
const { fmImagesToRelative } = require('gatsby-remark-relative-images')

const myEnv = require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

exports.onPreBootstrap = async () => {

  let marketingData;

  let params = {    
    per_page: 100,
};

  const colours = await axios.get(
    `${process.env.GATSBY_MARKETING_API_BASE_URL}/api/public/v1/config-values/all/shows/${process.env.GATSBY_SUMMIT_ID}`, { params }
  ).then((response) => {
    marketingData = response.data.data;
    let colorObject = { colors: {} }
    response.data.data.map((color) => {
      if (color.key.startsWith('color_')) colorObject.colors[color.key] = color.value;
    })
    return colorObject;
  }).catch(e => console.log('ERROR: ', e));

  fs.writeFileSync('src/content/colors.json', JSON.stringify(colours), 'utf8', function (err) {
    if (err) throw err;
    console.log('Saved!');
  });

  let sassColors = '';
  Object.keys(colours.colors).forEach(e => sassColors += `$${e} : ${colours.colors[e]};\n`);

  fs.writeFileSync('src/styles/colors.scss', sassColors, 'utf8', function (err) {
    if (err) throw err;
    console.log('Saved!');
  });

  let disqusSettings = JSON.parse(fs.readFileSync('src/content/disqus-settings.json'));

  marketingData.map((item) => {
    if (item.key.startsWith('disqus_')) disqusSettings[item.key] = item.value;
  });

  fs.writeFileSync('src/content/disqus-settings.json', JSON.stringify(disqusSettings), 'utf8', function (err) {
    if (err) throw err;
    console.log('Saved!');
  });

  let marketingSite = JSON.parse(fs.readFileSync('src/content/marketing-site.json'));

  marketingData.map((item) => {
    if (item.key.startsWith('summit_')) {
      marketingSite[item.key] = item.value;
    }
  });

  fs.writeFileSync('src/content/marketing-site.json', JSON.stringify(marketingSite), 'utf8', function (err) {
    if (err) throw err;
    console.log('Saved!');
  });

  let homeSettings = JSON.parse(fs.readFileSync('src/content/home-settings.json'));

  marketingData.map((item) => {
    if (item.key.startsWith('schedule_default_image')) {
      homeSettings[item.key] = item.value;
    }
  });

  fs.writeFileSync('src/content/home-settings.json', JSON.stringify(homeSettings), 'utf8', function (err) {
    if (err) throw err;
    console.log('Saved!');
  });

}

// makes Summit logo optional for graphql queries
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type Summit implements Node {
      logo: String
    }
  `
  createTypes(typeDefs)
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  fmImagesToRelative(node) // convert image paths for gatsby images

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest
}) => {
  const { createNode } = actions

  const summit = await axios.get(
    `${process.env.GATSBY_SUMMIT_API_BASE_URL}/api/public/v1/summits/${process.env.GATSBY_SUMMIT_ID}?expand=event_types%2C+tracks%2C+track_groups%2C+presentation_levels%2C+locations.rooms%2C+locations.floors`
  ).then((response) => response.data)
    .catch(e => console.log('ERROR: ', e));

  const summitObject = { summit }

  fs.writeFileSync('src/content/summit.json', JSON.stringify(summitObject), 'utf8', function (err) {
    if (err) throw err;
    console.log('Saved!');
  });

  const nodeContent = JSON.stringify(summit)

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
  }

  const node = Object.assign({}, summit, nodeMeta)
  createNode(node)
}

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions


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
      result.errors.forEach((e) => console.error(e.toString()))
      return Promise.reject(result.errors)
    }

    const posts = result.data.allMarkdownRemark.edges

    posts.forEach((edge) => {
      const id = edge.node.id
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
}

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
}