import React, {Component} from "react";


class Notifications extends Component {

    state = {
        notifications: []
    }

    componentDidMount() {
        this.events();
    }

    events() {
        fetch('http://localhost:8080/events')
            .then(res => res.json())
            .then((data) => {
                this.setState({notifications: data})
                this.componentDidMount();
            })
            .catch(console.log)
    }

    render() {
        return (
            <div>
                <h2>Push notifications </h2>
                {this.state.notifications.map((notification) => (
                    <ul>{notification.message}</ul>
                ))}
            </div>
        )
    };
}

export default Notifications;