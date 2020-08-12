import React from "react"

const FullscreenMessageComponent = ({ title, subtitle }) => {
  return (
    <section class="hero is-fullheight">
      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title">{title}</h1>
          <h2 class="subtitle">{subtitle}</h2>
        </div>
      </div>
    </section>
  )
}

export default FullscreenMessageComponent;