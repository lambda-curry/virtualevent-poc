import React from "react"

const HeroComponent = ({ title, subtitle, event }) => {

  return (
    <section className={`hero is-fullheight ${event ? 'talk__break' : ''}`}>
      <div className="hero-body">
        <div className={`${event ? '' : 'container has-text-centered'}`}>
          <h1 className="title">{title}</h1>
          <h2 className="subtitle">{subtitle}</h2>
        </div>
      </div>
    </section>
  )
}

export default HeroComponent;