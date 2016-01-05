import React, { Component, DOM } from 'react';
import reactMixin from 'react-mixin';
import { ListenerMixin } from 'reflux';
import Mozaik from 'mozaik/browser';
import c3 from 'c3';

class GaugeChart {

  constructor(bindTo, opts, data) {
    this.chart = c3.generate({
        bindto: bindTo,
        data: {
            columns: [data],
            type: 'gauge'
        },
        gauge: {
            label: {
                format: function(value, ratio) {
                    return value;
                },
                show: true
            },
            max: opts.max
        },
        color: {
            pattern: ['#60B044']
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

class ActiveUsers extends Component {
    

    constructor(props) {
        super(props);
        this.state = {
            total: 0
        };
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.destroy();
        }
    }

    getApiRequest() {
        let { segment, title } = this.props; 

        return {
            id: `intercom.getCompaniesBySegment.${ segment }`,
            params: {
                segment: segment,
                title: title
            }
        }
    }

    onApiData(response) {
        if(response.segment && response.segment.total_count) {
            if(response.total.total_count !== this.state.total || !this.chart) {
                if (this.chart) {
                    this.chart.destroy();
                }

                var chartElement = React.findDOMNode(this.refs.chart);
                this.chart = new GaugeChart(chartElement, {max: response.total.total_count, min:0}, ['data', response.segment.total_count]);
            } else if(response.segment.total_count !== this.state.segment){
                this.chart.load({
                    columns: [['data', response.segment.total_count]]
                })
            }
            this.setState({
                segment: response.segment.total_count,
                total: response.total.total_count,
            });
        }
    }

    render() {
        return (
            <div>
                <div className="widget__header">
                  Active companies (7 days)
                </div>
                <div className="widget__body">
                    <div ref="chart"></div>
                    
                </div>
            </div>
        )
    }
}

reactMixin(ActiveUsers.prototype, ListenerMixin);
reactMixin(ActiveUsers.prototype, Mozaik.Mixin.ApiConsumer);

export { ActiveUsers as default };