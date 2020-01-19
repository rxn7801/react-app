import React, {Component} from 'react';
import './App.css';

class Welcome extends Component {

    state = {
        subscriptions: [],
        notifications: []
    }

    componentDidMount() {
        this.subscriptions();
        this.events();
    }

    handleSubmit = (event) => {
        event.preventDefault();
        fetch('http://localhost:8080/webhooks', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: event.target.sub_name.value,
                level: event.target.level.value,
                url: event.target.callback_url.value
            }),
        }).then(res => res.json())
            .then((data) => {
                this.componentDidMount();
            })
            .catch(console.log)
    }

    subscriptions() {
        fetch('http://localhost:8080/webhooks')
            .then(res => res.json())
            .then((data) => {
                this.setState({subscriptions: data})
            })
            .catch(console.log)
    }


    handleEventSubmit = (event) => {
        event.preventDefault();
        console.log(event.target.sub_id.value);
        console.log(event.target.message.value);
        fetch('http://localhost:8080/push/' + event.target.sub_id.value, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: event.target.message.value
            }),
        }).then(res => res.json())
            .then((data) => {
                this.componentDidMount();
            })
            .catch(console.log)
    }

    events() {
        fetch('http://localhost:8080/events')
            .then(res => res.json())
            .then((data) => {
                this.setState({notifications: data})
            })
            .catch(console.log)
    }

    render() {
        return (
            <div>
                <h1 className="header">Subscriptions</h1>

                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>Add a WebHook subscription: </label><br/>
                        <label>
                            Subscription Name :
                        </label> <input type="text" name="sub_name"/><br/>
                        <label>
                            Pick a subscription level :
                            <select name="level" value={this.state.value}>
                                <option value="All">All</option>
                                <option value="Credits">Credits</option>
                                <option value="Debits">Debits</option>
                            </select>
                        </label>
                        <br/>
                        Callback URL:
                        <div className="input-group mb-3">
                            <input type="text" name="callback_url" maxLength="60" className="form-control"
                                   id="basic-url" aria-describedby="basic-addon3"/>
                        </div>
                        <br/>
                        <button type="submit" className="btn btn-primary">Subscribe</button>
                    </div>
                </form>

                <table className="table table-sm">
                    <thead>
                    <tr>
                        <th scope="col">Sub Id</th>
                        <th scope="col">Subscription Name</th>
                        <th scope="col">Subscription Level</th>
                        <th scope="col">Callback URL</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.subscriptions.map((subscription) => (
                        <tr>
                            <th scope="row">{subscription.id}</th>
                            <td>{subscription.name}</td>
                            <td>{subscription.level}</td>
                            <td>{subscription.url}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <h2>Publish an event</h2>
                <form onSubmit={this.handleEventSubmit}>
                    <label>For Subscription Id </label> <input type = "text" name="sub_id"/>
                    <label> Message </label>
                    <input type="text" name="message"/><br/>
                    <button type="submit" className="btn btn-primary">Publish!</button>
                </form>
                <br/>
                <br/>
                <h2>Push notifications </h2>
                {this.state.notifications.map((notification) => (
                    <ul>{notification.message}</ul>
                    ))}
            </div>
        )
    };
}

export default Welcome;
