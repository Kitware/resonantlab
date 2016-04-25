import Underscore from 'underscore';
import Widget from '../Widget';
import myTemplate from './template.html';
import candela from '../../../../../src/candela';
import './style.css';

import infoTemplate from './infoTemplate.html';

let VisualizationView = Widget.extend({
  initialize: function () {
    Widget.prototype.initialize.apply(this, arguments);
    
    this.friendlyName = 'Visualization';

    this.statusText.onclick = () => {
      window.mainPage.overlay.render('VisualizationLibrary');
    };
    this.statusText.title = 'Click to select a different visualization.';

    this.newInfo = true;
    this.icons.splice(0, 0, {
      src: () => {
        return this.newInfo ? Widget.newInfoIcon : Widget.infoIcon;
      },
      title: () => {
        return 'About this panel';
      },
      onclick: () => {
        this.renderInfoScreen();
      }
    });
    
    this.ok = null;
    this.icons.splice(0, 0, {
      src: () => {
        if (this.ok === null) {
          return Widget.spinnerIcon;
        } else if (this.ok === true) {
          return Widget.okayIcon;
        } else {
          return Widget.warningIcon;
        }
      },
      title: () => {
        if (this.ok === null) {
          return 'The visualization hasn\'t finished loading yet';
        } else if (this.ok === true) {
          return 'The visualization appears to be working';
        } else {
          return 'Something isn\'t quite right; click for details';
        }
      },
      onclick: () => {
        this.renderHelpScreen();
      }
    });
    
    this.listenTo(window.mainPage, 'rra:changeToolchain',
      this.handleNewToolchain);
    this.handleNewToolchain();
  },
  handleNewToolchain: function () {
    this.$el.html('');
    this.ok = null;
    this.vis = null;
    
    this.listenTo(window.mainPage.toolchain, 'rra:changeVisualizations',
      this.render);
    this.listenTo(window.mainPage.toolchain, 'rra:changeMappings',
      this.render);
  },
  renderInfoScreen: function () {
    this.newInfo = false;
    this.renderIndicators();

    window.mainPage.overlay.render(infoTemplate);
  },
  renderHelpScreen: function () {
    if (this.ok === null) {
      window.mainPage.overlay.renderUserErrorScreen(`
You have not chosen a visualization yet. Click 
<a onclick="window.mainPage.overlay.render('VisualizationLibrary')">
here</a> to choose one.`);
    } else if (this.ok === true) {
      window.mainPage.overlay.renderSuccessScreen(`
The visualization appears to be functioning correctly.`);
    } else {
      let meta = window.mainPage.toolchain.get('meta');

      if (!meta || !meta.visualizations || !meta.visualizations[0]) {
        window.mainPage.overlay.renderUserErrorScreen(`
You have not chosen a visualization yet. Click 
<a onclick="window.mainPage.overlay.render('VisualizationLibrary')">
here</a> to choose one.`);
      } else {
        window.mainPage.overlay.renderReallyBadErrorScreen(`
Corrupted visualization meta information.`);
      }
    }
  },
  render: Underscore.debounce(function () {
    if (!this.canRender()) {
      return;
    }
    
    // Get the visualization in the toolchain (if there is one)
    let spec = window.mainPage.toolchain.getMeta('visualizations');
    if (spec) {
      // Use the first spec (TODO: support multiple visualizations)
      spec = spec[0];
      
      // Get the options for the vis
      let options = window.mainPage.toolchain.getVisOptions();
      
      // Start with an initial empty dataset (gets populated
      // asynchronously)
      options.data = [];
      
      // How is this render pass different from the last?
      if (!this.vis || this.vis.spec.name !== spec.name) {
        // We've changed visualizations; nuke the DOM element
        // and create a new candela component
        this.$el.html(myTemplate);
        
        this.vis = {
          spec: spec,
          options: options,
          component: new candela.components[spec.name](
            '#' + this.spec.hashName + 'Container .visualization', options)
        };
      } else {
        // The visualization hasn't changed, but the options may have.
        Object.keys(this.vis.options).forEach(key => {
          if (!options.hasOwnProperty(key)) {
            // This option is no longer specified; set it to
            // null so that it's removed from the visualization
            options[key] = null;
          }
        })
        
        this.vis.options = options;
      }
      
      // Okay, now ask the toolchain if it has any new data for
      // us (changing the mappings, editing the data, or grabbing
      // a new dataset will invalidate the parsed cache).
      this.vis.component.render();
      this.ok = null;
      this.statusText.text = 'Loading...';
      this.renderIndicators();
      window.mainPage.toolchain.shapeDataForVis().then(data => {
        this.vis.options.data = data;
        
        // TODO: how do we update the data for a component in
        // general?
        if (this.vis.component.chart &&
            this.vis.component.chart.update) {
          this.vis.component.chart.update(this.vis.options);
        } else {
          // Nuke the vis and start fresh
          this.$el.html(myTemplate);
          this.vis.component = new candela.components[this.vis.spec.name](
            '#' + this.spec.hashName + 'Container .visualization', options);
        }
        if (this.isTargeted()) {
          this.vis.component.render();
        }
        this.ok = true;
        this.statusText.text = this.vis.spec.name;
        this.renderIndicators();
      });
    } else {
      this.$el.html(myTemplate);
      this.vis = null;
      this.ok = false;
      this.statusText.text = 'None selected';
      this.renderIndicators();
    }
  }, 300)
});

export default VisualizationView;
