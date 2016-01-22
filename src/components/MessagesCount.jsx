import React, { Component, DOM } from 'react';
import reactMixin from 'react-mixin';
import { ListenerMixin } from 'reflux';
import Mozaik from 'mozaik/browser';
import c3 from 'c3';

class DonutChart {

  constructor(bindTo, opts, data) {
    this.chart = c3.generate({
        bindto: bindTo,
        data: {
            columns: data,
            type: 'donut'
        },
        donut: {
            label: {
                format: function(value, ratio, id) {
                    console.log('format', arguments);
                    return value + ' ' + id;
                },
                show: true
            }
        },
        color: {
          pattern: ['#1f77b4', '#60B044']
        },
        legend: {
            hide: true
        }
    });
  }

  load(data) {
    return this.chart.load(data);
  }

  destroy () {
    console.log('destroy chart');   
    this.chart.destroy();
  }
}

class MessagesCount extends Component {
    

    constructor(props) {
        super(props);
        this.state = {
            messages: 0,
            connectors:0
        };
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.destroy();
        }
    }

    getApiRequest() {
        let { segment, title, segmentCompanies } = this.props; 

        return {
            id: `tk.getMessagesCount`,
        }
    }

    onApiData(response) {
        var data = [
            ['Connectors', response.connectors],
            ['Mess.', response.messages]
            ];
        if(!this.chart) {
            var chartElement = React.findDOMNode(this.refs.chart);
            this.chart = new DonutChart(chartElement, null, data);
        } else if(this.state.messages !== response.messages || this.state.connectors !== response.connectors) {
            this.chart.load({
                columns: data
            });
        }
        this.setState({
            messages: response.messages,
            connectors: response.connectors,
        });
    }

    render() {
        return (
            <div>
                <div className="widget__header">
                  Messages
                </div>
                <div className="widget__body">
                    <div ref="chart" className="widget__chart"></div>
                </div>
            </div>
        )
    }
}

reactMixin(MessagesCount.prototype, ListenerMixin);
reactMixin(MessagesCount.prototype, Mozaik.Mixin.ApiConsumer);

export { MessagesCount as default };