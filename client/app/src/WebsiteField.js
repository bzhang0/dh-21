import React from 'react';
class WebsiteField extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: "Enter Webiste URL"
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        alert("Processing Webiste");
    }
    render() {
        return (<form onSubmit={this.handleSubmit}>
            <label>
              URL:
              <textarea value={this.state.value} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
          </form>) 
    };
}

export default WebsiteField;