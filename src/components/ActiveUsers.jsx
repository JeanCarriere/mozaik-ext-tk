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
      axis: {
        x: {
          type: 'timeseries'
        },
        y: {
          min: 0
        }
      }
    });
  }

  load(data) {
    return this.chart.load(data);
  }

  loadEntries(entries) {
    var xData = [];
    var visitsData = [];
    var sessionsData = [];
    var weekDayRegions = [];

    if (!entries || entries.length === 0) {
      console.warn('No statistics provided');
      return;
    }

    _.each(entries, function(entry) {
      //
      var entryObj = _.zipObject(['date', 'views', 'sessions'], entry);
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
      visitsData.push(parseInt(entryObj.views.value, 10));
      sessionsData.push(parseInt(entryObj.sessions.value, 10));
    });

    return this.load({
      columns: [
        ['x'].concat(xData),
        ['Page views'].concat(visitsData),
        ['Sessions'].concat(sessionsData)
      ],
      regions: weekDayRegions
    });
  }
};

class ActiveUsers extends Component {
    

    constructor(props) {
        super(props);
        this.state = {
            total: 0
        };
    }


    getApiRequest() {
        let { id } = this.props; 
        return {
            id: `intercom.getActiveUsers`,
            params:{
                id:id
            }
        }
    }

    onApiData(data) {
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
        console.log('data results', data.results);
        this.chart.loadEntries(this.state.entries);
    }

    render() {
        return (
            <div>
                <div className="widget__header">
                  Active Users (1 day) #{this.state.total}
                </div>
                <div className="widget__body">
                    <div ref="chart" className="widget__chart"></div>
                </div>
            </div>
        )
    }
}

reactMixin(ActiveUsers.prototype, ListenerMixin);
reactMixin(ActiveUsers.prototype, Mozaik.Mixin.ApiConsumer);

export { ActiveUsers as default };