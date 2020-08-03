import React from "react"


const withOrchestra = (WrappedComponent) => {
    return class extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                widgetRefs: []
            };
        }

        addWidgetRef = widgetRef => {
          this.setState(prevState => ({ widgetRefs: [ ...prevState.widgetRefs, widgetRef ]}))  ;
        };

        updateWidgets = (action, event) => {
            this.state.widgetRefs.forEach(x => {
                x.triggerUpdate(action, event);
            });
        };

        render() {
            return <WrappedComponent {...this.props} addWidgetRef={this.addWidgetRef} updateWidgets={this.updateWidgets} />;
        }
    };
};

export default withOrchestra;

