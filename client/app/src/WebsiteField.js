import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class WebsiteField extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: "Enter Website URL"
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
        console.log(event.target.value);
    }

    handleSubmit = (event) => {
        // alert("Processing Website");

        // console.log(event.textarea.value);
        this.props.onClick(this.state.value);
        event.preventDefault();
        /*s
        console.log("hi");
        event.preventDefault();
        */
    }
    render() {
        return (
        <div class="mb-3">
            <form onSubmit={this.handleSubmit}>
            <label>
              URL:
              <textarea value={this.state.value} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
          </form>
            {/* <Form >
                <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>URL:</Form.Label>
                <Form.Control placeholder="Enter a Website URL" class= "form-control form-control-lg" type="email" rows="5" cols = "100"></Form.Control>
                {/* <textarea placeholder={this.state.value} onChange={this.handleChange} /> */}
                {/* </Form.Group>
                <Button variant="primary" type="submit" value="Submit" onClick={this.handleSubmit} size="lg"/>
            </Form> */}
        </div>)
    }
}

export default WebsiteField;