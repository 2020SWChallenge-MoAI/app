<script>
import * as forceSimulation from 'd3-force';
import svgRenderer from './svgRenderer.vue';
var d3 = Object.assign({}, forceSimulation);

export default {
  name: "mindmap",
  props: {
    mindmapData: Object,
    bookId: Number
  },
  components: {
    svgRenderer
  },
  data: function() {
    return {
      nodes: [],
      links: [],
      simulation: null,
      size: {
        w: 0,
        h: 0
      },
      textSize: 15,
      forces: {
        force: 10000,
        X: 0.5,
        Y: 0.5,
      },
      selected: false,
      selectedNode: {},
      dragging: false,
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
  watch: {
    mindmapData: {
      deep: true,
      handler() {
        this.convertDataIntoGraph(this.mindmapData);
        this.reset();
      }
    }
  },
  created: function() {
    this.convertDataIntoGraph(this.mindmapData);
  },
  mounted: function() {
    this.size.w = this.$el.clientWidth;
    this.size.h = this.$el.clientHeight;

    this.$nextTick(() => {
      this.animate();
    })
  },
  render: function(createElement) {
    //첫 번째 node가 최초 고정 위치로 화면 중앙을 잡는 코드
    if(this.center.x != 0 && this.center.y != 0) {
      if(this.nodes[0].fx === undefined && this.nodes[0].fy === undefined) {
        this.nodes[0].fx = this.center.x;
        this.nodes[0].fy = this.center.y;
      }
    }

    var props = {
      bookId: this.bookId,
      mindmapData: this.mindmapData,
      size: this.size,
      nodes: this.nodes,
      links: this.links,
      textSize: this.textSize,
      selected: this.selected,
      selectedNode: this.selectedNode
    }
    return createElement('div', {
      attrs: {class: 'net'},
      on: { 'mousemove': this.move, '&touchmove': this.move }
    }, [createElement('svg-renderer', {
      props,
      on: { action: this.methodCall, mindmapDataUpdated: this.mindmapDataUpdated, resetSelection: this.resetSelection }
    })]);
  },
  methods: {
    convertDataIntoGraph(mindmapData) {
      this.nodes = [];
      this.links = [];

      var root = mindmapData;
      
      var linkId = 0;

      var queue = [];

      queue.push({
        depth: 0,
        content: root,
        parentNode: {
          id: undefined
        }
      });

      while (queue.length != 0) {
        var item = queue.shift();

        var curNodeId = item["content"]["id"];
        var parentNode = item["parentNode"];
        var parentNodeId = parentNode["id"];
        var depth = item["depth"];
        var text = item["content"]["text"];
        var children = item["content"]["children"];

        var curNode = {
          id: curNodeId,
          parentId: parentNodeId,
          depth: depth,
          text: text,
          x: 0,
          y: 0,
          class: ["node", "depth-" + depth],
          rx: 10,
          ry: 10,
          pinned: false,
          fx: undefined,
          fy: undefined
        };

        this.nodes.push(curNode);

        if (depth > 0) {
          var curLinkId = linkId++;

          var curLink = {
            id: curLinkId,
            from: parentNodeId,
            to: curNode.id,
            depth: depth,
            source: parentNode,
            target: curNode,
            class: ["link",  "depth-" + parentNode.depth]
          };

          this.links.push(curLink);
        }

        for (var i = 0; i < children.length; i++) {
          var child = children[i];
          queue.push({
            depth: depth + 1,
            content: child,
            parentNode: curNode
          });
        }
      }

      this.nodes[0].pinned = true; //0번 노드(제목) 위치 고정
    },
    mindmapDataUpdated(mindmapData) {
      this.$emit("mindmapDataUpdated", mindmapData);
    },
    methodCall (action, args) {
      let method = this[action]
      if (method && typeof (method) === 'function') {
        if (args) method(...args)
        else method()
      }
    },
    animate() {
      if(this.simulation) this.simulation.stop();
      this.simulation = this.simulate();
      this.simulation.restart();
    },
    reset() {
      this.animate();
      this.nodes = this.simulation.nodes();
      this.links = this.simulation.force('link').links();
    },
    simulate() {
      var sim = d3.forceSimulation().stop().alpha(0.5).nodes(this.nodes);

      sim.force('center', d3.forceCenter(this.center.x, this.center.y)); //view 중심으로 node들을 모음

      sim.force('X', d3.forceX(this.center.x).strength(this.forces.X)); //
      sim.force('Y', d3.forceY(this.center.y).strength(this.forces.Y));
      
      sim.force('charge', d3.forceManyBody().strength(-this.forces.force)); //view들이 서로 밀어내게 함 (strength() 인자가 양수면 인력, 음수면 척력)
      
      //TODO : 아래 함수 작동 안함
      //sim.force('collision', d3.forceCollide().radius(function(d) { return Math.max(d.rx, d.ry); }));
      sim.force('collision', d3.forceCollide().radius(this.textSize));

      sim.force('link', d3.forceLink(this.links).id(function (d) { return d.id }));
      return sim;
    },
    // -- Mouse Interaction
    move (event) {
      let pos = this.clientPos(event)
      if (this.dragging !== false) {
        if (this.nodes[this.dragging]) {
          this.simulation.restart()
          this.simulation.alpha(0.5)
          this.nodes[this.dragging].fx = pos.x - this.mouseOfst.x
          this.nodes[this.dragging].fy = pos.y - this.mouseOfst.y
        }
      }
    },
    clientPos (event) {
      let x = (event.touches) ? event.touches[0].clientX : event.clientX
      let y = (event.touches) ? event.touches[0].clientY : event.clientY
      x = x || 0
      y = y || 0
      return { x, y }
    },
    dragStart (event, nodeKey) {
      this.dragging = (nodeKey === false) ? false : nodeKey
      this.setMouseOffset(event, this.nodes[nodeKey])
      if (this.dragging === false) {
        this.simulation.alpha(0.1)
        this.simulation.restart()
        this.setMouseOffset()
      }
    },
    dragEnd () {
      let node = this.nodes[this.dragging]
      if (node && !node.pinned) {
        // unfix node position
        node.fx = null
        node.fy = null
      }
      this.dragStart(false)
    },
    // -- Render helpers
    nodeClick (event, selectedNode) {
      this.selected = true;
      this.selectedNode = selectedNode;

      for(var node of this.nodes) {
        if(node.id == selectedNode.id) {
          var newClassList = this.addSelectedFromClassList(node.class);
          node.class = newClassList;
        } else {
          var newClassList = this.removeSelectedFromClassList(node.class);
          node.class = newClassList;
        }
      }

      this.$emit('node-click', event, node)
    },
    setMouseOffset (event, node) {
      let x = 0
      let y = 0
      if (event && node) {
        let pos = this.clientPos(event)
        x = (pos.x) ? pos.x - node.x : node.x
        y = (pos.y) ? pos.y - node.y : node.y
      }
      this.mouseOfst = { x, y }
    },
    removeSelectedFromClassList(classList) {
      var arr = Array.prototype.slice.call(classList);
      return classList.filter((item) => item != 'selected');
    },
    addSelectedFromClassList(classList) {
      var arr = Array.prototype.slice.call(classList);
      if(!arr.includes("selected")) arr.push("selected");
      return arr;
    },
    resetSelection() {
      this.selected = false;
      this.selectedNode = {};

      for(var node of this.nodes) {
        var newClassList = this.removeSelectedFromClassList(node.class);
        node.class = newClassList;
      }
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