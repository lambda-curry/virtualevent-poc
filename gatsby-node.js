const _ = require('lodash')
const axios = require('axios')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')
const { fmImagesToRelative } = require('gatsby-remark-relative-images')

const myEnv = require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

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
              tags
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
      createPage({
        path: edge.node.fields.slug,
        tags: edge.node.frontmatter.tags,
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

  const events = await axios.get(
    `${process.env.GATSBY_SUMMIT_API_BASE_URL}/api/public/v1/summits/${process.env.GATSBY_SUMMIT_ID}/events/published?expand=rsvp_template%2C+type%2C+track%2C+location%2C+location.venue%2C+location.floor%2C+speakers%2C+moderator%2C+sponsors%2C+groups&page=1&per_page=100&order=%2Bstart_date`
  ).then((response) => response.data.data)
  .catch(e => console.log('ERROR: ', e));
  
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

  for (const event of events) {
    const nodeContent = JSON.stringify(event)

    const nodeMeta = {
      ...event,
      timezone: summit.time_zone_id,
      id: createNodeId(`event-${event.id}`),
      event_id: event.id,
      parent: null,
      children: [],
      internal: {
        type: `Event`,
        mediaType: `application/json`,
        content: nodeContent,
        contentDigest: createContentDigest(event)
      }
    }

    const node = Object.assign({}, event, nodeMeta)
    createNode(node)
  }
}

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  return graphql(`
    {
      allEvent(limit: 1000) {
        edges {
          node {
            id
            event_id
            attending_media
            description
            end_date
            etherpad_link
            meeting_url
            start_date
            streaming_url
            title
          }
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      result.errors.forEach((e) => console.error(e.toString()))
      return Promise.reject(result.errors)
    }

    const events = result.data.allEvent.edges

    events.forEach((edge) => {
      const { id, attending_media, description, end_date, etherpad_link,
        meeting_url, start_date, streaming_url, title } = edge.node
      createPage({
        path: `/a/event/${edge.node.event_id}`,
        matchPath: "/a/event/:eventId",
        component: path.resolve(
          `src/templates/event-page.js`
        ),
        // additional data can be passed via context
        context: {
          id,
          attending_media,
          description,
          end_date,
          etherpad_link,
          meeting_url,
          start_date,
          streaming_url,
          title,
        },
      })
    })
  })
}

exports.onCreateWebpackConfig = ({ stage, loaders, actions, plugins }) => {
  if (stage === "build-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /openstack-uicore-foundation/,
            use: loaders.null(),
          },
        ],
      },
    })
  } else {
    actions.setWebpackConfig({
      plugins: [
        plugins.define({
          'global.GENTLY': false,
        }),
      ],
    })
  }
}