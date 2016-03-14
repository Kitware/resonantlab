import d3 from 'd3';
import Widget from '../Widget';
import myTemplate from './template.html';
import candela from './../../../../../src';
import './style.css';

import loadingHelpTemplate from './loadingHelpTemplate.html';
import successHelpTemplate from './successHelpTemplate.html';
import noVisLoadedTemplate from './noVisLoadedTemplate.html';

let SingleVisualizationView = Widget.extend({
  initialize: function (options) {
    let self = this;
    Widget.prototype.initialize.apply(self, options);
    
    self.friendlyName = 'Visualization';
    self.hashName = 'singleVisualizationView';
    
    self.statusText.onclick = function () {
      window.layout.overlay.render('visualizationLibrary');
    };
    self.statusText.title = 'Click to select a different visualization.';
    
    self.infoHint = true;
    self.icons.splice(0, 0, {
      src: function () {
        return self.infoHint ? Widget.newInfoIcon : Widget.infoIcon;
      },
      onclick: function () {
        self.renderInfoScreen();
      }
    });
    
    self.ok = null;
    self.icons.splice(0, 0, {
      src: function () {
        if (self.ok === null) {
          return Widget.spinnerIcon;
        } else if (self.ok === true) {
          return Widget.okayIcon;
        } else {
          return Widget.warningIcon;
        }
      },
      title: function () {
        if (self.ok === null) {
          return 'The visualization hasn\'t finished loading yet';
        } else if (self.ok === true) {
          return 'The visualization appears to be working';
        } else {
          return 'Something isn\'t quite right; click for details';
        }
      },
      onclick: function () {
        self.renderHelpScreen();
      }
    });

    self.listenTo(window.toolchain, 'rra:changeVisualizations', self.render);
    self.listenTo(window.toolchain, 'rra:changeMappings', self.render);
  },
  renderInfoScreen: function () {
    let self = this;
    self.infoHint = false;
    self.renderIndicators();
    
    window.layout.overlay.render('<div id="singleVisualizationHelp"></div>');
    d3.select('#singleVisualizationHelp')
      .append('div').attr('class', 'hint')
      .text('TODO: give the user hints and/or info about how to use this view');
  },
  renderHelpScreen: function () {
    let self = this;
    self.infoHint = false;
    window.layout.overlay.render('<div id="singleVisualizationHelp"></div>');
    
    let message;
    if (self.ok === null) {
      message = loadingHelpTemplate;
    } else if (self.ok === true) {
      message = successHelpTemplate;
    } else {
      let meta = window.toolchain.get('meta');
      
      if (!meta || !meta.visualizations || !meta.visualizations[0]) {
        message = noVisLoadedTemplate;
      }
      // TODO: add a warning + explanation when the
      // base number of mappings are missing
    }
    
    d3.select('#singleVisualizationHelp')
      .append('div').attr('class', 'hint')
      .html(message);
  },
  render: function () {
    let self = this;
    
    // Get the visualization in the toolchain (if there is one)
    let visSpec = window.toolchain.get('meta');
    if (visSpec) {
      visSpec = visSpec.visualizations;
      if (visSpec) {
        visSpec = visSpec[0];
      }
    }
    
    self.$el.html(myTemplate);
    
    if (visSpec) {
      let options = window.toolchain.getVisOptions();
      
      self.ok = null;
      self.statusText.text = 'Loading...';
      self.renderIndicators();
      
      window.toolchain.shapeDataForVis(function (data) {
        // Temporarily force the scrollbars, so
        // the view can account for the needed space
        self.$el.css('overflow', 'scroll');
        self.vis = new candela.components[visSpec.name]('.visualization',
                                                        data, options);
        self.vis.render();
        self.$el.css('overflow', '');
        
        self.ok = true;
        self.statusText.text = visSpec['name'];
        self.renderIndicators();
      });
    } else {
      self.ok = false;
      self.statusText.text = 'None selected';
      self.renderIndicators();
    }
  }
});

export default SingleVisualizationView;
