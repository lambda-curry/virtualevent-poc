import React from 'react'
import Loadable from "@loadable/component"

import Layout from '../../components/Layout'

import DisqusComponent from '../../components/DisqusComponent'
const ScheduleClientSide = Loadable(() => import('../../components/ScheduleComponent'))

export default class BlogIndexPage extends React.Component {
  render() {
    return (
      <Layout>
        Testing place      
        <DisqusComponent />
        <ScheduleClientSide base='blog'/>
      </Layout>
    )
  }
}
