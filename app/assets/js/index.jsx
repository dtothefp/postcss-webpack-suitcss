require('../css/main'); // jshint ignore:line
var React = require('react');

var Hello = React.createClass({
  render() {
    return (
      <h1>Hello</h1>
    );
  }
});

React.render(<Hello />, document.querySelector('.calendar'));
