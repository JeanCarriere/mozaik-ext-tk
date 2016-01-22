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

class SegmentCompaniesCount extends Component {
    

    constructor(props) {
        super(props);
        this.state = {
            total: 0,
            active:0
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
            id: `tk.getCompaniesBySegment.${ segment }`,
            params: {
                segment: segment,
                title: title
            }
        }
    }

    onApiData(response) {
        var data = [
            ['Active', response.segment.total_count],
            ['Inactive', response.total.total_count - response.segment.total_count]
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
            active: response.segment.total_count,
            total: response.total.total_count,
        });
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

reactMixin(SegmentCompaniesCount.prototype, ListenerMixin);
reactMixin(SegmentCompaniesCount.prototype, Mozaik.Mixin.ApiConsumer);

export { SegmentCompaniesCount as default };