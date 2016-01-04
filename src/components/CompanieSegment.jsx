import React, { Component } from 'react';
import reactMixin from 'react-mixin';
import { ListenerMixin } from 'reflux';
import Company from './Company.jsx'
import Mozaik from 'mozaik/browser';
var c3 = require('c3');

class GaugeChart {

  constructor(bindTo, opts) {
    opts = opts || {};
    this.chart = c3.generate({
    	data: {
	        columns: [
	            ['data', 91.4]
	        ],
	        type: 'gauge'
	    },
	    gauge: {
	        label: {
	            format: function(value, ratio) {
	                return value;
	            },
				show: true
	        },
			max: 100
		}
	});
  }

  load(data) {
    return this.chart.load(data);
  }
}

class CompanieSegment extends Component {
	

	constructor(props) {
		super(props);
		this.state = {
			total: 0
		};
	}

	componentDidMount() {
	    var chartElement = ReactDOM.findDOMNode(this.refs.chart.getDOMNode());
	    this.chart = new GaugeChart(chartElement);
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
		this.setState({
			total: response.segment.total_count
		});
		this.chart.load({
	        columns: [['data', response.segment.total_count]]
	    });
	}

	render() {
		let { total } = this.state;
		let { title } = this.props;
		return (
			<div>
	        	<div className="widget__body">
	        		<div ref="chart"></div>
					
				</div>
			</div>
		)
	}
}

reactMixin(CompanieSegment.prototype, ListenerMixin);
reactMixin(CompanieSegment.prototype, Mozaik.Mixin.ApiConsumer);

export { CompanieSegment as default };