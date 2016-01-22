import React, { Component, DOM } from 'react';
import reactMixin from 'react-mixin';
import { ListenerMixin } from 'reflux';
import Mozaik from 'mozaik/browser';
import c3 from 'c3';
var _ = require('lodash');
var moment = require('moment');

class TimeseriesChart {

  constructor(bindTo, opts) {
    opts = opts || {};
    this.chart = c3.generate({
      bindto: bindTo,
      transition: {
        // Skipping transition for now
        duration: null
      },
      data: {
        labels: true,
        x: 'x',
        xFormat: '%Y-%m-%d',
        columns: []
      },
      color: {
      pattern: ['#eedba5']
    },
    axis: {
        x: {
          type: 'timeseries'
        },
        y: {
          min: 0
        }
    },
    legend: {
        hide: true
    }
    });
  }

  load(data) {
    return this.chart.load(data);
  }

  loadEntries(entries) {
    var xData = [];
    var activeData = [];
    var weekDayRegions = [];

    if (!entries || entries.length === 0) {
      console.warn('No statistics provided');
      return;
    }

    _.each(entries, function(entry) {
      var entryObj = _.zipObject(['date', 'active'], entry);
      console.log('entryObj',entryObj);
      
      var date = moment(entryObj.date.value, 'YYYYMMDD');

      // Mark Sat and Sun with region
      if (_.contains([6, 7], date.isoWeekday())) {
        var weekDayRegion = {
          start: date.format('YYYY-MM-DD'),
          end: date.format('YYYY-MM-DD')
        };
        weekDayRegions.push(weekDayRegion);
      };

      xData.push(date.format('YYYY-MM-DD'));

      activeData.push(parseInt(entryObj.active.value, 10));
    });

    return this.load({
      columns: [
        ['x'].concat(xData),
        ['NewCompanies'].concat(activeData)
      ],
      regions: weekDayRegions
    });
  }
};

class NewCompanies extends Component {
    

    constructor(props) {
        super(props);
        this.state = {
            total: 0
        };
    }


    getApiRequest() {
        let { id } = this.props; 
        return {
            id: `tk.getNewCompanies`,
            params:{
                id:id
            }
        }
    }

    onApiData(data) {
      console.log('data results companies', data.results);
        
        var total = data.totalsForAllResults['ga:1dayUsers'] || null;
        var avg = Math.floor(total / data.totalResults, -1);

        if(!this.chart) {
            var chartElement = React.findDOMNode(this.refs.chart);
            this.chart = new TimeseriesChart(chartElement, {
                min: this.props.min,
                max: this.props.max,
                tickCount: this.props.tickCount,
                dateFormat: this.props.dateFormat
            });
        }
    
        this.setState({
          total: total,
          avg: avg,
          entries: data.results
        });
        this.chart.loadEntries(this.state.entries);
    }

    render() {
        return (
            <div>
                <div className="widget__header">
                  New Companies (1 day)
                </div>
                <div className="widget__body">
                    <div ref="chart" className="widget__chart"></div>
                </div>
            </div>
        )
    }
}

reactMixin(NewCompanies.prototype, ListenerMixin);
reactMixin(NewCompanies.prototype, Mozaik.Mixin.ApiConsumer);

export { NewCompanies as default };