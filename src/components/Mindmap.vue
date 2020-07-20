<template>
  <div>
    <!--div class="debug">
      <p>{{ center }}</p>
    </!--div-->
    <svg class="mindmap">
      <g id="links" class="links" />
      <g id="nodes" class="nodes" />
    </svg>
  </div>
</template>

<script>
import * as forceSimulation from 'd3-force';
var d3 = Object.assign({}, forceSimulation);

export default {
  name: "mindmap",
  props: {
    mindmapData: Object
  },
  data: function() {
    return {
      netNodes: [],
      netLinks: [],
      nodes: [],
      links: [],
      simulation: null,
      size: {
        w: 500,
        h: 500
      },
      force: 500,
      forces: {
        Center: false,
        X: 0.5,
        Y: 0.5,
        ManyBody: true,
        Link: true
      }
    };
  },
  computed: {
    center: function() {
      return {
        x: this.size.w / 2,
        y: this.size.h / 2,
      }
    }
  },
  created: function() {
    this.convertDataIntoGraph();
    this.buildNodes();
    this.buildLinks();
  },
  mounted: function() {
    this.size.w = this.$el.clientWidth;
    this.size.h = this.$el.clientHeight;

    console.log(this.center);

    this.$nextTick(() => {
      this.animate();
    })
  },
  methods: {
    convertDataIntoGraph() {
      var root = this.mindmapData;
      var nodeId = 0;
      var linkId = 0;

      var queue = [];

      queue.push({
        depth: 0,
        content: root,
        parentNodeId: undefined
      });

      while (queue.length != 0) {
        var item = queue.shift();

        var curNodeId = nodeId++;
        var parentNodeId = item["parentNodeId"];
        var depth = item["depth"];
        var text = item["content"]["text"];
        var children = item["content"]["children"];

        this.netNodes.push({
          id: curNodeId,
          depth: depth,
          text: text
        });

        if (depth > 0) {
          var curLinkId = linkId++;
          this.netLinks.push({
            id: curLinkId,
            from: parentNodeId,
            to: curNodeId,
            depth: depth
          });
        }

        for (var i = 0; i < children.length; i++) {
          var child = children[i];
          queue.push({
            depth: depth + 1,
            content: child,
            parentNodeId: curNodeId
          });
        }
      }
    },
    buildNodes() {
      var vm = this;
      this.nodes = this.netNodes.map((node, index) => {
        vm.$set(node, 'x', 0);
        vm.$set(node, 'y', 0);

        return node;
      });
    },
    buildLinks() {
      var vm = this;
      this.links = this.netLinks.map((link, index) => {
        link.source = link.from;
        link.target = link.to;

        return link;
      });
    },
    animate() {
      if(this.simulation) this.simulation.stop();
      this.simulation = this.simulate();
      this.simulation.restart();
    },
    simulate() {
      var sim = d3.forceSimulation().stop().alpha(0.5).nodes(this.nodes);

      if (this.forces.Center !== false) sim.force('center', d3.forceCenter(this.center.x, this.center.y));
      if (this.forces.X !== false) {
        sim.force('X', d3.forceX(this.center.x).strength(this.forces.X));
      }
      if (this.forces.Y !== false) {
        sim.force('Y', d3.forceY(this.center.y).strength(this.forces.Y));
      }
      if (this.forces.ManyBody !== false) {
        sim.force('charge', d3.forceManyBody().strength(-this.force));
      }
      if (this.forces.Link !== false) {
        sim.force('link', d3.forceLink(this.links).id(function (d) { return d.id }));
      }
      console.log(sim);
      return sim;
    }
  }
};
</script>

<style>
.mindmap {
  width: 100%;
  height: 100%;
  margin: 0;
}
</style>